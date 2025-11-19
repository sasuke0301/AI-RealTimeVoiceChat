# 🤖 AI Teacher System - Setup Guide

Complete setup guide for transforming the OpenAI Realtime Console into a full-featured AI Teacher System for children's learning.

---

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Firebase Setup](#firebase-setup)
3. [Environment Configuration](#environment-configuration)
4. [Install Dependencies](#install-dependencies)
5. [Initialize Database](#initialize-database)
6. [Security Rules](#security-rules)
7. [Running the System](#running-the-system)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)

---

## 🔧 Prerequisites

Before starting, ensure you have:

- **Node.js** v16+ installed
- **npm** or **yarn** package manager
- **OpenAI API Key** with Realtime API access
- **Firebase Account** (free plan works)
- **Git** installed (optional)

---

## 🔥 Firebase Setup

### Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Add project"** or **"Create a project"**
3. Enter project name: `ai-teacher-system` (or your preferred name)
4. Click **Continue**
5. (Optional) Disable Google Analytics or enable it
6. Click **"Create project"**
7. Wait for project creation, then click **"Continue"**

### Step 2: Enable Authentication

1. In Firebase Console sidebar, click **"Authentication"**
2. Click **"Get started"** button
3. Click **"Email/Password"** tab under "Sign-in method"
4. Toggle **"Enable"** switch to ON
5. Click **"Save"**

### Step 3: Create Firestore Database

1. In Firebase Console sidebar, click **"Firestore Database"**
2. Click **"Create database"**
3. Select **"Start in test mode"** (we'll add security rules later)
4. Choose location: **asia-northeast1 (Tokyo)** or closest to your users
5. Click **"Enable"**
6. Wait for database creation (~30 seconds)

### Step 4: Get Firebase Configuration (Client)

1. Click the **⚙️ Settings icon** → **"Project settings"**
2. Scroll down to **"Your apps"** section
3. Click the **`</>`** (Web) icon
4. Register app nickname: `ai-teacher-web`
5. **Don't check** "Firebase Hosting"
6. Click **"Register app"**
7. **Copy the `firebaseConfig` object** - you'll need this!

Example:
```javascript
const firebaseConfig = {
  apiKey: "AIzaSyC-abc123xyz...",
  authDomain: "ai-teacher-system.firebaseapp.com",
  projectId: "ai-teacher-system",
  storageBucket: "ai-teacher-system.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456"
};
```

### Step 5: Generate Service Account Key (Server)

1. Still in **"Project settings"**
2. Click **"Service accounts"** tab
3. Click **"Generate new private key"**
4. Click **"Generate key"** in the confirmation dialog
5. **A JSON file will download** - keep this safe!
6. **⚠️ NEVER commit this file to Git!**

---

## ⚙️ Environment Configuration

### Step 1: Create .env File

1. Copy `env.example.txt` to `.env` in the project root:
   ```bash
   cp env.example.txt .env
   ```

2. Open `.env` in a text editor

### Step 2: Fill in OpenAI API Key

```env
OPENAI_API_KEY=sk-your-actual-api-key-here
```

Get your API key from: https://platform.openai.com/api-keys

### Step 3: Fill in Firebase Client Config

Copy the values from Step 4 above:

```env
REACT_APP_FIREBASE_API_KEY=AIzaSyC-abc123xyz...
REACT_APP_FIREBASE_AUTH_DOMAIN=ai-teacher-system.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=ai-teacher-system
REACT_APP_FIREBASE_STORAGE_BUCKET=ai-teacher-system.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

### Step 4: Fill in Firebase Admin Key

Open the downloaded JSON file from Step 5 above.

**Important:** The entire JSON must be on ONE LINE:

```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"ai-teacher-system",...}
```

### Step 5: Verify .env File

Your `.env` should look like:

```env
OPENAI_API_KEY=sk-proj-abc123...
PORT=8081
REACT_APP_LOCAL_RELAY_SERVER_URL=http://localhost:8081
REACT_APP_FIREBASE_API_KEY=AIza...
REACT_APP_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
REACT_APP_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
REACT_APP_FIREBASE_APP_ID=1:123456789:web:abc123
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project",...}
```

---

## 📦 Install Dependencies

Run this command in the project root:

```bash
npm install
```

This will install all required packages including:
- Firebase Client SDK
- Firebase Admin SDK
- OpenAI Realtime API Beta
- React and related libraries

---

## 🗄️ Initialize Database

### Step 1: Create Test Users

Run the script to create test users:

```bash
node scripts/createTestUsers.js
```

This creates 3 test users:
- `test-preschool@example.com` (Password: `Test1234!`)
- `test-grade1@example.com` (Password: `Test1234!`)
- `test-grade3@example.com` (Password: `Test1234!`)

### Step 2: Import Sample Data

Run the script to import RAG content, experiments, and prompts:

```bash
node scripts/importRAGContent.js
```

This imports:
- 7 RAG content items (safety rules, experiments, science explanations)
- 3 experiment records with URLs
- 3 course level prompts (preschool, grade1, grade3)

### Step 3: Verify Data in Firebase Console

1. Go to **Firestore Database** in Firebase Console
2. You should see these collections:
   - **users** (3 documents)
   - **ragContent** (7 documents)
   - **experiments** (3 documents)
   - **prompts** (3 documents)

---

## 🔒 Security Rules

### Update Firestore Security Rules

1. In Firebase Console, go to **Firestore Database**
2. Click **"Rules"** tab
3. **Replace all rules** with the following:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users collection
    match /users/{userId} {
      // Users can only read their own profile
      allow read: if request.auth != null && request.auth.uid == userId;
      // Nobody can write from client (only server with Admin SDK)
      allow write: if false;
    }
    
    // Conversations collection
    match /conversations/{conversationId} {
      // Users can only read their own conversations
      allow read: if request.auth != null && 
                     resource.data.userId == request.auth.uid;
      // Nobody can write from client
      allow write: if false;
    }
    
    // Prompts collection
    match /prompts/{promptId} {
      // All authenticated users can read prompts
      allow read: if request.auth != null;
      // Nobody can write from client
      allow write: if false;
    }
    
    // Experiments collection
    match /experiments/{experimentId} {
      // All authenticated users can read
      allow read: if request.auth != null;
      // Nobody can write from client
      allow write: if false;
    }
    
    // RAG content collection
    match /ragContent/{contentId} {
      // All authenticated users can read educational materials
      allow read: if request.auth != null;
      // Nobody can write from client
      allow write: if false;
    }
    
    // System logs (optional)
    match /systemLogs/{logId} {
      // Only server can read/write
      allow read, write: if false;
    }
  }
}
```

4. Click **"Publish"**
5. Wait for confirmation message

---

## 🚀 Running the System

### Option 1: Run Both Servers (Recommended for Development)

**Terminal 1 - Start Relay Server:**
```bash
npm run relay
```

You should see:
```
[Server] Starting AI Teacher Relay Server...
[Firebase Admin] Initialized successfully
[RealtimeRelay] Listening on ws://localhost:8081
[Server] AI Teacher System ready on port 8081
```

**Terminal 2 - Start React App:**
```bash
npm start
```

The app will open at `http://localhost:3000`

### Option 2: Production Build

```bash
# Build the React app
npm run build

# Serve the build
npx serve -s build

# In another terminal, start relay server
npm run relay
```

---

## 🧪 Testing

### Test 1: Login

1. Open `http://localhost:3000`
2. You should see the login page
3. Enter credentials:
   - Email: `test-preschool@example.com`
   - Password: `Test1234!`
4. Click **ログイン** (Login)
5. You should be redirected to the AI Teacher interface

### Test 2: Voice Interaction

1. After logging in, you'll see a large **🎤 button**
2. **Press and hold** the button (don't click quickly)
3. Speak a question in Japanese: "空はなぜ青いの？"
4. **Release** the button
5. Wait 2-3 seconds
6. The AI should respond in Japanese with a child-friendly explanation

### Test 3: Usage Limit

1. Check the Firestore Database → **users** collection
2. Find your test user document
3. Note the `usageCount` field increases after each interaction
4. Try changing `usageLimit` to `1` and `usageCount` to `1`
5. Try to use the system again
6. You should see: "今月の利用上限に達しました"

### Test 4: RAG Content

1. Ask: "実験の安全ルールは？"
2. The AI should reference the safety rules from RAG content
3. Check the console logs in Terminal 1 (relay server)
4. You should see: `[RAG] Found X relevant documents`

### Test 5: Auto URL Append

1. Ask: "色水実験について教えて"
2. The AI response should include a URL at the end
3. Check relay server logs for: `[URLService] Found relevant experiment`

---

## 🐛 Troubleshooting

### Problem: "FIREBASE_SERVICE_ACCOUNT_KEY is required"

**Solution:**
- Verify `.env` file exists in project root
- Check `FIREBASE_SERVICE_ACCOUNT_KEY` is on ONE line
- Ensure the JSON is valid (no line breaks)

### Problem: Login fails with "auth/invalid-credential"

**Solution:**
- Run `node scripts/createTestUsers.js` again
- Check Firebase Authentication console for user
- Verify password is exactly `Test1234!`

### Problem: "Usage limit exceeded" immediately

**Solution:**
- Check Firestore → `users` collection
- Reset `usageCount` to `0`
- Verify `usageLimit` is `300`

### Problem: PTT button doesn't work on tablet

**Solution:**
- Use HTTPS (required for microphone access on mobile)
- Check browser permissions for microphone
- Try Chrome or Safari (not all browsers support WebRTC)

### Problem: Slow response (>5 seconds)

**Solution:**
- Check internet connection
- Verify OpenAI API key has Realtime API access
- Check OpenAI API status page
- Consider reducing RAG search results (currently top 3)

### Problem: RAG content not being used

**Solution:**
- Run `node scripts/importRAGContent.js` again
- Check Firestore → `ragContent` collection has documents
- Look at relay server logs for `[RAG] Found X relevant documents`
- Try more specific questions that match keywords

### Problem: Conversation not being logged

**Solution:**
- Check Firestore security rules allow server writes
- Verify Firebase Admin SDK initialized successfully
- Look for `[Logger] Conversation logged` in relay server logs
- Check Firestore → `conversations` collection

---

## 📱 Tablet Deployment

### For Testing on Tablet:

1. Find your computer's IP address:
   ```bash
   # Windows
   ipconfig
   
   # Mac/Linux
   ifconfig
   ```

2. Update `.env`:
   ```env
   REACT_APP_LOCAL_RELAY_SERVER_URL=http://YOUR_IP:8081
   ```

3. Restart both servers

4. On tablet, open browser and go to:
   ```
   http://YOUR_IP:3000
   ```

5. **For production:** Use HTTPS with a proper SSL certificate

---

## 🎯 Next Steps

### Customization:

1. **Add Your Own RAG Content:**
   - Edit `scripts/importRAGContent.js`
   - Add more experiment data
   - Run the script again

2. **Adjust AI Personality:**
   - Edit prompts in Firestore → `prompts` collection
   - Or update `src/utils/conversation_config.js`

3. **Change Usage Limits:**
   - Update Firestore → `users` collection
   - Modify `usageLimit` per user

4. **Add New Course Levels:**
   - Create new prompt in Firestore
   - Update user's `courseLevel` field

### Deployment:

1. **Firebase Hosting (Recommended):**
   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

2. **Deploy Relay Server:**
   - Use services like Heroku, Railway, or AWS
   - Set environment variables in hosting platform
   - Update `REACT_APP_LOCAL_RELAY_SERVER_URL`

---

## 📞 Support

If you encounter issues:

1. Check the relay server logs (Terminal 1)
2. Check browser console (F12 → Console tab)
3. Verify all `.env` variables are set
4. Ensure Firebase services are enabled
5. Check Firestore security rules

---

## 🎉 Success!

If everything works:
- ✅ Users can log in
- ✅ Voice interaction works
- ✅ Usage limits are enforced
- ✅ Conversations are logged
- ✅ RAG content is used
- ✅ URLs are appended

You now have a complete AI Teacher System! 🚀

---

**Made with ❤️ for children's education**

