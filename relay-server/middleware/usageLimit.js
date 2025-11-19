import { db, admin } from '../firebase-admin.js';

/**
 * Check if user has exceeded their monthly usage limit
 * @param {string} userId - The Firebase user ID
 * @returns {Promise<{allowed: boolean, remaining: number, limit: number}>}
 * @throws {Error} If user not found or limit exceeded
 */
export async function checkUsageLimit(userId) {
  try {
    const userDocRef = db.collection('users').doc(userId);
    const userDoc = await userDocRef.get();
    
    if (!userDoc.exists) {
      throw new Error('User not found. Please contact administrator.');
    }
    
    const userData = userDoc.data();
    const now = new Date();
    const resetDate = userData.resetDate?.toDate() || new Date();
    
    // Reset monthly counter if the reset date has passed
    if (now > resetDate) {
      const nextResetDate = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      await userDocRef.update({
        usageCount: 0,
        resetDate: admin.firestore.Timestamp.fromDate(nextResetDate),
        lastResetAt: admin.firestore.FieldValue.serverTimestamp()
      });
      
      console.log(`[UsageLimit] Reset usage counter for user ${userId}`);
      
      return {
        allowed: true,
        remaining: userData.usageLimit - 1,
        limit: userData.usageLimit
      };
    }
    
    // Check if user has exceeded their limit
    if (userData.usageCount >= userData.usageLimit) {
      const daysUntilReset = Math.ceil((resetDate - now) / (1000 * 60 * 60 * 24));
      throw new Error(
        `今月の利用上限に達しました。` +
        `リセットまであと${daysUntilReset}日です。`
      );
    }
    
    // Increment usage count
    await userDocRef.update({
      usageCount: admin.firestore.FieldValue.increment(1),
      lastUsedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    const remaining = userData.usageLimit - userData.usageCount - 1;
    
    console.log(`[UsageLimit] User ${userId}: ${userData.usageCount + 1}/${userData.usageLimit} used`);
    
    return {
      allowed: true,
      remaining: remaining,
      limit: userData.usageLimit
    };
    
  } catch (error) {
    console.error('[UsageLimit] Error:', error.message);
    throw error;
  }
}

/**
 * Get user's current usage statistics
 * @param {string} userId - The Firebase user ID
 * @returns {Promise<{usageCount: number, usageLimit: number, resetDate: Date}>}
 */
export async function getUserUsageStats(userId) {
  try {
    const userDoc = await db.collection('users').doc(userId).get();
    
    if (!userDoc.exists) {
      throw new Error('User not found');
    }
    
    const userData = userDoc.data();
    
    return {
      usageCount: userData.usageCount || 0,
      usageLimit: userData.usageLimit || 300,
      resetDate: userData.resetDate?.toDate() || new Date(),
      remaining: Math.max(0, (userData.usageLimit || 300) - (userData.usageCount || 0))
    };
    
  } catch (error) {
    console.error('[UsageLimit] Error getting stats:', error.message);
    throw error;
  }
}

