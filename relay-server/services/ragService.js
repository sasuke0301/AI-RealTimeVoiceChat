import { db } from '../firebase-admin.js';

/**
 * Simple keyword-based search for RAG content
 * This is a basic implementation. For production, consider using vector embeddings.
 * @param {string} query - The user's question
 * @param {number} topK - Number of top results to return
 * @returns {Promise<Array>} Array of relevant content
 */
export async function searchRAGContent(query, topK = 3) {
  try {
    // Extract keywords from query (simple tokenization)
    const keywords = extractKeywords(query);
    
    if (keywords.length === 0) {
      return [];
    }
    
    // Get all RAG content
    const ragSnapshot = await db.collection('ragContent').get();
    
    if (ragSnapshot.empty) {
      console.log('[RAG] No content found in database');
      return [];
    }
    
    // Score each document based on keyword matches
    const results = [];
    
    ragSnapshot.forEach(doc => {
      const data = doc.data();
      const score = calculateRelevanceScore(keywords, data);
      
      if (score > 0) {
        results.push({
          id: doc.id,
          title: data.title || '',
          content: data.content || '',
          category: data.category || '',
          score: score,
          ...data
        });
      }
    });
    
    // Sort by score (descending) and return top K
    results.sort((a, b) => b.score - a.score);
    const topResults = results.slice(0, topK);
    
    console.log(`[RAG] Found ${topResults.length} relevant documents for query: "${query}"`);
    
    return topResults;
    
  } catch (error) {
    console.error('[RAG] Error searching content:', error.message);
    return [];
  }
}

/**
 * Build context string from RAG results to add to AI prompt
 * @param {string} query - The user's question
 * @param {number} maxResults - Maximum number of results to include
 * @returns {Promise<string>} Formatted context string
 */
export async function buildContextFromRAG(query, maxResults = 3) {
  try {
    const relevantContent = await searchRAGContent(query, maxResults);
    
    if (relevantContent.length === 0) {
      return '';
    }
    
    let context = '\n\n【参考資料】\n';
    context += '以下の情報を参考にして、子どもにわかりやすく答えてください：\n\n';
    
    relevantContent.forEach((content, index) => {
      context += `${index + 1}. ${content.title}\n`;
      context += `${content.content}\n\n`;
    });
    
    return context;
    
  } catch (error) {
    console.error('[RAG] Error building context:', error.message);
    return '';
  }
}

/**
 * Extract keywords from query (simple Japanese tokenization)
 * @param {string} query - The user's question
 * @returns {Array<string>} Array of keywords
 */
function extractKeywords(query) {
  // Remove punctuation and split into words
  const cleaned = query
    .replace(/[？！。、，]/g, ' ')
    .trim()
    .toLowerCase();
  
  // Split on spaces and common particles
  const words = cleaned.split(/[\s　]+/);
  
  // Remove common particles and very short words
  const stopWords = ['は', 'が', 'を', 'に', 'で', 'と', 'の', 'や', 'か', 'も', 'から', 'まで', 'より'];
  
  const keywords = words.filter(word => 
    word.length > 1 && !stopWords.includes(word)
  );
  
  return keywords;
}

/**
 * Calculate relevance score based on keyword matching
 * @param {Array<string>} keywords - Query keywords
 * @param {object} document - RAG document data
 * @returns {number} Relevance score
 */
function calculateRelevanceScore(keywords, document) {
  let score = 0;
  
  const title = (document.title || '').toLowerCase();
  const content = (document.content || '').toLowerCase();
  const docKeywords = document.keywords || [];
  const category = (document.category || '').toLowerCase();
  
  keywords.forEach(keyword => {
    // Title matches are worth more
    if (title.includes(keyword)) {
      score += 5;
    }
    
    // Keyword field matches
    if (docKeywords.some(k => k.toLowerCase().includes(keyword))) {
      score += 4;
    }
    
    // Content matches
    const contentMatches = (content.match(new RegExp(keyword, 'g')) || []).length;
    score += contentMatches * 2;
    
    // Category matches
    if (category.includes(keyword)) {
      score += 3;
    }
  });
  
  return score;
}

/**
 * Get RAG content by category
 * @param {string} category - Category name
 * @returns {Promise<Array>}
 */
export async function getContentByCategory(category) {
  try {
    const snapshot = await db.collection('ragContent')
      .where('category', '==', category)
      .get();
    
    const contents = [];
    snapshot.forEach(doc => {
      contents.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return contents;
    
  } catch (error) {
    console.error('[RAG] Error getting content by category:', error.message);
    return [];
  }
}

/**
 * Add new RAG content (for admin purposes)
 * @param {object} contentData - Content data to add
 * @returns {Promise<string>} Document ID
 */
export async function addRAGContent(contentData) {
  try {
    const docRef = await db.collection('ragContent').add({
      ...contentData,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log(`[RAG] Added content with ID: ${docRef.id}`);
    return docRef.id;
    
  } catch (error) {
    console.error('[RAG] Error adding content:', error.message);
    throw error;
  }
}

