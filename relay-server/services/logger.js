import { db, admin } from '../firebase-admin.js';

/**
 * Log a conversation to Firestore
 * @param {string} userId - The Firebase user ID
 * @param {string} question - The user's question
 * @param {string} answer - The AI's answer
 * @param {number} audioLength - Length of audio in seconds
 * @param {object} metadata - Additional metadata
 */
export async function logConversation(userId, question, answer, audioLength = 0, metadata = {}) {
  try {
    const conversationData = {
      userId,
      question: question || '',
      answer: answer || '',
      audioLength,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
      ...metadata
    };
    
    await db.collection('conversations').add(conversationData);
    
    console.log(`[Logger] Conversation logged for user ${userId}`);
    
    return { success: true };
    
  } catch (error) {
    console.error('[Logger] Error logging conversation:', error.message);
    // Don't throw error - logging failure shouldn't break the conversation
    return { success: false, error: error.message };
  }
}

/**
 * Get conversation history for a user
 * @param {string} userId - The Firebase user ID
 * @param {number} limit - Number of conversations to retrieve
 * @returns {Promise<Array>}
 */
export async function getConversationHistory(userId, limit = 50) {
  try {
    const conversationsRef = db.collection('conversations');
    const query = conversationsRef
      .where('userId', '==', userId)
      .orderBy('timestamp', 'desc')
      .limit(limit);
    
    const snapshot = await query.get();
    
    const conversations = [];
    snapshot.forEach(doc => {
      conversations.push({
        id: doc.id,
        ...doc.data(),
        timestamp: doc.data().timestamp?.toDate()
      });
    });
    
    return conversations;
    
  } catch (error) {
    console.error('[Logger] Error getting history:', error.message);
    throw error;
  }
}

/**
 * Log system events (errors, warnings, etc.)
 * @param {string} level - Log level (info, warning, error)
 * @param {string} message - Log message
 * @param {object} data - Additional data
 */
export async function logSystemEvent(level, message, data = {}) {
  try {
    await db.collection('systemLogs').add({
      level,
      message,
      data,
      timestamp: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`[SystemLog] ${level.toUpperCase()}: ${message}`);
    
  } catch (error) {
    console.error('[SystemLog] Error:', error.message);
  }
}

