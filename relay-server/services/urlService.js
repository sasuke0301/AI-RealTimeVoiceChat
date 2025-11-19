import { db } from '../firebase-admin.js';

/**
 * Find relevant experiment URL based on question content
 * @param {string} question - The user's question
 * @returns {Promise<string>} URL to append, or empty string
 */
export async function findRelevantExperimentUrl(question) {
  try {
    // Get all experiments
    const experimentsSnapshot = await db.collection('experiments').get();
    
    if (experimentsSnapshot.empty) {
      console.log('[URLService] No experiments found in database');
      return '';
    }
    
    let bestMatch = null;
    let highestScore = 0;
    
    const questionLower = question.toLowerCase();
    
    experimentsSnapshot.forEach(doc => {
      const experiment = doc.data();
      let score = 0;
      
      // Check title match
      if (experiment.title && questionLower.includes(experiment.title.toLowerCase())) {
        score += 10;
      }
      
      // Check keyword matches
      if (experiment.keywords && Array.isArray(experiment.keywords)) {
        experiment.keywords.forEach(keyword => {
          if (questionLower.includes(keyword.toLowerCase())) {
            score += 3;
          }
        });
      }
      
      // Check description match
      if (experiment.description && questionLower.includes(experiment.description.toLowerCase())) {
        score += 5;
      }
      
      // Check category match
      if (experiment.category) {
        const categories = ['実験', '工作', 'アート', '科学', '観察'];
        categories.forEach(cat => {
          if (questionLower.includes(cat) && experiment.category.includes(cat)) {
            score += 2;
          }
        });
      }
      
      if (score > highestScore) {
        highestScore = score;
        bestMatch = experiment;
      }
    });
    
    // Only return URL if score is above threshold
    if (bestMatch && highestScore >= 3) {
      console.log(`[URLService] Found relevant experiment: ${bestMatch.title} (score: ${highestScore})`);
      
      // Format the URL message
      const urlMessage = formatUrlMessage(bestMatch);
      return urlMessage;
    }
    
    return '';
    
  } catch (error) {
    console.error('[URLService] Error finding URL:', error.message);
    return '';
  }
}

/**
 * Format URL message for appending to AI response
 * @param {object} experiment - Experiment data
 * @returns {string} Formatted message
 */
function formatUrlMessage(experiment) {
  let message = '\n\n';
  
  if (experiment.title) {
    message += `📚 ${experiment.title}について、もっと詳しく知りたい方はこちら：\n`;
  } else {
    message += `📚 詳しくはこちら：\n`;
  }
  
  message += experiment.url;
  
  return message;
}

/**
 * Get all experiments
 * @returns {Promise<Array>}
 */
export async function getAllExperiments() {
  try {
    const snapshot = await db.collection('experiments').get();
    
    const experiments = [];
    snapshot.forEach(doc => {
      experiments.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return experiments;
    
  } catch (error) {
    console.error('[URLService] Error getting experiments:', error.message);
    return [];
  }
}

/**
 * Add new experiment (for admin purposes)
 * @param {object} experimentData - Experiment data
 * @returns {Promise<string>} Document ID
 */
export async function addExperiment(experimentData) {
  try {
    const docRef = await db.collection('experiments').add({
      ...experimentData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`[URLService] Added experiment with ID: ${docRef.id}`);
    return docRef.id;
    
  } catch (error) {
    console.error('[URLService] Error adding experiment:', error.message);
    throw error;
  }
}

/**
 * Get experiment by ID
 * @param {string} experimentId - Experiment document ID
 * @returns {Promise<object|null>}
 */
export async function getExperimentById(experimentId) {
  try {
    const doc = await db.collection('experiments').doc(experimentId).get();
    
    if (!doc.exists) {
      return null;
    }
    
    return {
      id: doc.id,
      ...doc.data()
    };
    
  } catch (error) {
    console.error('[URLService] Error getting experiment:', error.message);
    return null;
  }
}

