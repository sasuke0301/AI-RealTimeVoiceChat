// Script to create test users for AI Teacher System
// Run with: node scripts/createTestUsers.js

import admin from 'firebase-admin';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '..', '.env') });

// Initialize Firebase Admin
const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;

if (!serviceAccountKey) {
  console.error('❌ FIREBASE_SERVICE_ACCOUNT_KEY not found in .env file');
  process.exit(1);
}

const serviceAccount = JSON.parse(serviceAccountKey);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: serviceAccount.project_id
});

const auth = admin.auth();
const db = admin.firestore();

// Test users to create
const testUsers = [
  {
    email: 'test-preschool@example.com',
    password: 'Test1234!',
    displayName: 'テストユーザー(年長)',
    courseLevel: 'preschool'
  },
  {
    email: 'test-grade1@example.com',
    password: 'Test1234!',
    displayName: 'テストユーザー(小1)',
    courseLevel: 'grade1'
  },
  {
    email: 'test-grade3@example.com',
    password: 'Test1234!',
    displayName: 'テストユーザー(小3)',
    courseLevel: 'grade3'
  }
];

async function createTestUser(userData) {
  try {
    // Create authentication user
    const userRecord = await auth.createUser({
      email: userData.email,
      password: userData.password,
      displayName: userData.displayName
    });
    
    console.log(`✅ Created auth user: ${userData.email}`);
    
    // Create Firestore user document
    const nextResetDate = new Date();
    nextResetDate.setMonth(nextResetDate.getMonth() + 1);
    nextResetDate.setDate(1);
    
    await db.collection('users').doc(userRecord.uid).set({
      userId: userRecord.uid,
      email: userData.email,
      displayName: userData.displayName,
      usageLimit: 300,
      usageCount: 0,
      resetDate: admin.firestore.Timestamp.fromDate(nextResetDate),
      courseLevel: userData.courseLevel,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      lastUsedAt: null
    });
    
    console.log(`✅ Created Firestore document for ${userData.email}`);
    console.log(`   UID: ${userRecord.uid}`);
    console.log(`   Course Level: ${userData.courseLevel}`);
    console.log('');
    
  } catch (error) {
    if (error.code === 'auth/email-already-exists') {
      console.log(`⚠️  User ${userData.email} already exists, skipping...`);
    } else {
      console.error(`❌ Error creating user ${userData.email}:`, error.message);
    }
  }
}

async function main() {
  console.log('🚀 Creating test users for AI Teacher System...\n');
  
  for (const userData of testUsers) {
    await createTestUser(userData);
  }
  
  console.log('✅ Test user creation complete!');
  console.log('\n📝 Test Credentials:');
  testUsers.forEach(user => {
    console.log(`   Email: ${user.email}`);
    console.log(`   Password: ${user.password}`);
    console.log(`   Level: ${user.courseLevel}\n`);
  });
  
  process.exit(0);
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

