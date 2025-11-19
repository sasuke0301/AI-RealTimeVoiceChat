import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config({ override: true });

// Check if Firebase Admin is already initialized
let db;

try {
  if (!admin.apps.length) {
    // Initialize Firebase Admin SDK
    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
    
    if (!serviceAccountKey) {
      console.error(
        'Environment variable "FIREBASE_SERVICE_ACCOUNT_KEY" is required.\n' +
        'Please set it in your .env file as a JSON string.'
      );
      process.exit(1);
    }
    
    let serviceAccount;
    try {
      serviceAccount = JSON.parse(serviceAccountKey);
    } catch (e) {
      console.error('Failed to parse FIREBASE_SERVICE_ACCOUNT_KEY. Make sure it is valid JSON.');
      process.exit(1);
    }
    
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id
    });
    
    console.log('[Firebase Admin] Initialized successfully');
  }
  
  db = admin.firestore();
  
  // Set Firestore settings
  db.settings({
    ignoreUndefinedProperties: true
  });
  
} catch (error) {
  console.error('[Firebase Admin] Initialization error:', error);
  process.exit(1);
}

export { admin, db };

