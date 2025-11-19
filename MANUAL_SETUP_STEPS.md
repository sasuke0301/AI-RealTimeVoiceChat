# 📝 Manual Setup Steps - Complete Step-by-Step Guide

**This guide assumes you're a complete beginner. Follow every step exactly as written.**

**Estimated Time: 45 minutes**

---

## ✅ Prerequisites Check

Before starting, verify you have:

### 1. Check Node.js Installation
Open PowerShell (Windows key + X → PowerShell) and type:
```powershell
node --version
```

**Expected output:** `v16.0.0` or higher  
**If not installed:** Download from https://nodejs.org/ (LTS version)

### 2. Check npm Installation
```powershell
npm --version
```

**Expected output:** `8.0.0` or higher  
**If not installed:** It comes with Node.js, reinstall Node.js

### 3. Get OpenAI API Key
1. Go to https://platform.openai.com/api-keys
2. Click **"Create new secret key"**
3. Name it: `AI-Teacher-System`
4. Click **"Create secret key"**
5. **COPY THE KEY** (starts with `sk-proj-` or `sk-`)
6. Save it in a text file temporarily (you'll need it soon)
7. ⚠️ **You can only see this key once!**

---

## 🔥 Part 1: Firebase Console Setup (20 minutes)

### Step 1.1: Create Firebase Project

1. **Open your web browser** (Chrome recommended)

2. **Go to:** https://console.firebase.google.com/

3. **Sign in** with your Google account
   - If you don't have one, create one first

4. **Click the button** that says **"Add project"** or **"Create a project"**
   - It's a large card in the center of the page

5. **Enter Project Name:**
   ```
   Type: AI-Teacher-System
   ```
   - Press Enter or click Continue

6. **Google Analytics:**
   - You'll see "Enable Google Analytics for this project?"
   - **Toggle it OFF** (we don't need it)
   - Click **"Create project"**

7. **Wait for creation** (30-60 seconds)
   - You'll see a loading animation
   - Progress bar will complete

8. **Click "Continue"** when you see "Your new project is ready"

9. **You should now see the Firebase Console Dashboard**

---

### Step 1.2: Enable Authentication

1. **In the left sidebar**, find and click **"Authentication"**
   - It has a key icon 🔑

2. **Click the button** that says **"Get started"**
   - It's in the center of the page

3. **You'll see "Sign-in method" tab**
   - It should be already selected (underlined)

4. **Find "Email/Password" in the list**
   - It's usually the first or second provider

5. **Click on "Email/Password"**
   - A popup window will appear

6. **In the popup:**
   - Toggle the **first switch** (Email/Password) to **ON**
   - Leave the second switch (Email link) OFF
   - Click **"Save"**

7. **Verify:** You should now see "Email/Password" with status "Enabled"

---

### Step 1.3: Create Firestore Database

1. **In the left sidebar**, find and click **"Firestore Database"**
   - It has a database icon 💾
   - NOT "Realtime Database" (different service)

2. **Click the button** that says **"Create database"**

3. **Choose Location:**
   - A popup appears: "Secure rules for Cloud Firestore"
   - Select **"Start in test mode"**
   - Click **"Next"**

4. **Set Location:**
   - You'll see a dropdown for "Cloud Firestore location"
   - Choose: **"asia-northeast1 (Tokyo)"**
   - Or choose the closest location to your users
   - Click **"Enable"**

5. **Wait for creation** (30-60 seconds)
   - You'll see "Provisioning Cloud Firestore..."
   - A loading spinner will appear

6. **Database Created!**
   - You should now see the Firestore console
   - It will be empty (no collections yet)

---

### Step 1.4: Get Firebase Web Configuration

1. **Click the ⚙️ (gear/settings) icon** in the left sidebar
   - It's near the top, next to "Project Overview"

2. **Click "Project settings"** from the dropdown

3. **Scroll down** to the section that says **"Your apps"**

4. **Click the `</>` icon** (it means "Web")
   - It's a small icon that looks like HTML brackets

5. **Register your app:**
   - In the popup, enter nickname: `ai-teacher-web`
   - **DO NOT** check "Also set up Firebase Hosting"
   - Click **"Register app"**

6. **Copy the Configuration:**
   - You'll see JavaScript code that looks like this:

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

7. **COPY EACH VALUE** (not the entire code, just the values):
   - Open Notepad (search for "Notepad" in Windows)
   - Type exactly as follows (one per line):

   ```
   REACT_APP_FIREBASE_API_KEY=AIzaSyC-abc123xyz...
   REACT_APP_FIREBASE_AUTH_DOMAIN=ai-teacher-system.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=ai-teacher-system
   REACT_APP_FIREBASE_STORAGE_BUCKET=ai-teacher-system.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
   REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abc123def456
   ```

   - **Save this file** as `firebase-config.txt` on your Desktop

8. **Click "Continue to console"** at the bottom

---

### Step 1.5: Generate Service Account Key (IMPORTANT!)

1. **Still in "Project settings"** (where you just were)

2. **Click the "Service accounts" tab** at the top
   - It's next to "General"

3. **You'll see a section:**
   - "Firebase Admin SDK"
   - Some code snippets

4. **Click the button** that says **"Generate new private key"**
   - It's at the bottom of the page

5. **A warning popup appears:**
   - It says "Generate new private key?"
   - Click **"Generate key"**

6. **A JSON file downloads** to your computer
   - File name: `ai-teacher-system-firebase-adminsdk-xxxxx.json`
   - Usually downloads to your Downloads folder

7. **IMPORTANT: Keep this file safe!**
   - This is your admin password
   - Never share it or commit it to GitHub
   - We'll use it in a moment

8. **Open the downloaded JSON file:**
   - Right-click the file → Open with → Notepad

9. **Copy the ENTIRE content** (Ctrl+A, then Ctrl+C)

10. **Open Notepad again** and paste it
    - **On ONE single line** (remove all line breaks)
    - Should look like: `{"type":"service_account","project_id":"ai-teacher-system",...}`
    - **Save this** as `firebase-admin-key.txt` on your Desktop

---

## 📝 Part 2: Create Environment File (10 minutes)

### Step 2.1: Find Your Project Folder

1. **Open File Explorer** (Windows key + E)

2. **Navigate to:** `E:\AI-RealTimeVoiceChat`

3. **You should see files like:**
   - `package.json`
   - `README.md`
   - `src` folder
   - `relay-server` folder

---

### Step 2.2: Create .env File

1. **In your project folder**, find the file: `env.example.txt`

2. **Right-click** on `env.example.txt` → **Copy**

3. **Right-click in empty space** → **Paste**

4. **Rename the copy:**
   - Right-click on `env.example - Copy.txt`
   - Click **"Rename"**
   - Change the name to: `.env`
   - Press Enter
   
   **IMPORTANT:** 
   - The file name must be exactly `.env` (with the dot at the start)
   - No `.txt` extension
   - If you can't see extensions, go to File Explorer → View → Check "File name extensions"

5. **Right-click on `.env`** → **Open with** → **Notepad**

---

### Step 2.3: Fill in OpenAI API Key

1. **In the `.env` file**, find this line:
   ```
   OPENAI_API_KEY=sk-your-openai-api-key-here
   ```

2. **Replace** `sk-your-openai-api-key-here` with your actual API key
   - Get it from the text file you saved earlier
   - Should look like: `OPENAI_API_KEY=sk-proj-abc123xyz...`

3. **Save** (Ctrl+S)

---

### Step 2.4: Fill in Firebase Client Config

1. **Open** `firebase-config.txt` from your Desktop (the file you created earlier)

2. **Copy each line** and paste it into `.env`

3. **Your `.env` should now have:**
   ```env
   OPENAI_API_KEY=sk-proj-abc123xyz...
   PORT=8081
   REACT_APP_LOCAL_RELAY_SERVER_URL=http://localhost:8081
   REACT_APP_FIREBASE_API_KEY=AIzaSyC-abc123xyz...
   REACT_APP_FIREBASE_AUTH_DOMAIN=ai-teacher-system.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=ai-teacher-system
   REACT_APP_FIREBASE_STORAGE_BUCKET=ai-teacher-system.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789012
   REACT_APP_FIREBASE_APP_ID=1:123456789012:web:abc123def456
   ```

4. **Save** (Ctrl+S)

---

### Step 2.5: Fill in Firebase Admin Key

1. **Open** `firebase-admin-key.txt` from your Desktop

2. **Copy the ENTIRE JSON** (it's all on one line)
   - Should look like: `{"type":"service_account","project_id":"ai-teacher-system",...}`

3. **In `.env` file**, find this line:
   ```
   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"your-project",...}
   ```

4. **Replace everything after the `=` sign** with your copied JSON

5. **Final check:** The line should look like:
   ```
   FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"ai-teacher-system","private_key_id":"abc123",...}
   ```

6. **Save** (Ctrl+S)

7. **Close Notepad**

---

### Step 2.6: Verify .env File

Open `.env` again and verify you have ALL these lines filled in:

```env
✅ OPENAI_API_KEY=sk-proj-...
✅ PORT=8081
✅ REACT_APP_LOCAL_RELAY_SERVER_URL=http://localhost:8081
✅ REACT_APP_FIREBASE_API_KEY=AIza...
✅ REACT_APP_FIREBASE_AUTH_DOMAIN=...firebaseapp.com
✅ REACT_APP_FIREBASE_PROJECT_ID=ai-teacher-system
✅ REACT_APP_FIREBASE_STORAGE_BUCKET=...appspot.com
✅ REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
✅ REACT_APP_FIREBASE_APP_ID=1:123456789:web:...
✅ FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account",...}
```

---

## 🗄️ Part 3: Initialize Database (5 minutes)

### Step 3.1: Open PowerShell

1. **In File Explorer**, make sure you're in `E:\AI-RealTimeVoiceChat`

2. **Hold Shift** and **right-click** in empty space

3. **Click** "Open PowerShell window here" or "Open in Terminal"

4. **You should see:**
   ```
   PS E:\AI-RealTimeVoiceChat>
   ```

---

### Step 3.2: Create Test Users

1. **Type this command** (then press Enter):
   ```powershell
   node scripts/createTestUsers.js
   ```

2. **Wait for output** (5-10 seconds)

3. **You should see:**
   ```
   🚀 Creating test users for AI Teacher System...

   ✅ Created auth user: test-preschool@example.com
   ✅ Created Firestore document for test-preschool@example.com
      UID: abc123xyz...
      Course Level: preschool

   ✅ Created auth user: test-grade1@example.com
   ✅ Created Firestore document for test-grade1@example.com
      UID: def456uvw...
      Course Level: grade1

   ✅ Created auth user: test-grade3@example.com
   ✅ Created Firestore document for test-grade3@example.com
      UID: ghi789rst...
      Course Level: grade3

   ✅ Test user creation complete!

   📝 Test Credentials:
      Email: test-preschool@example.com
      Password: Test1234!
      Level: preschool
      ...
   ```

4. **If you see errors:**
   - Check that `.env` file has `FIREBASE_SERVICE_ACCOUNT_KEY` correctly
   - Make sure the JSON is all on ONE line
   - Try running the command again

---

### Step 3.3: Import Sample Data

1. **Type this command** (then press Enter):
   ```powershell
   node scripts/importRAGContent.js
   ```

2. **Wait for output** (5-10 seconds)

3. **You should see:**
   ```
   🚀 Starting data import for AI Teacher System...

   📚 Importing RAG content...

   ✅ Added RAG content: 実験の安全ルール
   ✅ Added RAG content: 色水を混ぜる実験
   ✅ Added RAG content: 氷の実験
   ✅ Added RAG content: 折り紙で作る動物
   ✅ Added RAG content: 空はなぜ青いの
   ✅ Added RAG content: 磁石のひみつ
   ✅ Added RAG content: 植物の育ち方

   🧪 Importing experiments...

   ✅ Added experiment: 色水実験
   ✅ Added experiment: 氷と水の実験
   ✅ Added experiment: 折り紙動物園

   📝 Importing course level prompts...

   ✅ Added prompt for: preschool
   ✅ Added prompt for: grade1
   ✅ Added prompt for: grade3

   ✅ All data imported successfully!

   📊 Summary:
      - RAG Content: 7 items
      - Experiments: 3 items
      - Prompts: 3 course levels
   ```

4. **Success!** Your database is now initialized

---

### Step 3.4: Verify in Firebase Console

1. **Go back to your browser** with Firebase Console

2. **Click "Firestore Database"** in the left sidebar

3. **You should now see collections:**
   - `users` (3 documents)
   - `ragContent` (7 documents)
   - `experiments` (3 documents)
   - `prompts` (3 documents)

4. **Click on `users` to expand it**
   - You should see 3 user documents with random IDs

5. **Click on one user document**
   - You should see fields like:
     - `userId`
     - `email: test-preschool@example.com`
     - `usageLimit: 300`
     - `usageCount: 0`
     - `courseLevel: preschool`

6. **Verify Authentication:**
   - Click "Authentication" in the left sidebar
   - Click "Users" tab
   - You should see 3 users with emails

---

## 🔒 Part 4: Set Security Rules (5 minutes)

### Step 4.1: Open Security Rules

1. **In Firebase Console**, click **"Firestore Database"**

2. **Click the "Rules" tab** at the top
   - It's next to "Data"

3. **You'll see a code editor** with some existing rules

---

### Step 4.2: Replace Rules

1. **Select ALL the existing text** (Ctrl+A)

2. **Delete it** (press Delete)

3. **Copy this entire code block:**

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

4. **Paste it** into the editor (Ctrl+V)

5. **Click the "Publish" button**
   - It's at the top right of the editor

6. **Wait for confirmation**
   - You'll see "Rules published successfully"

---

## 🚀 Part 5: Run the System (5 minutes)

### Step 5.1: Start Relay Server

1. **In PowerShell** (same window from earlier)

2. **Type this command:**
   ```powershell
   npm run relay
   ```

3. **Press Enter**

4. **Wait for output** (3-5 seconds)

5. **You should see:**
   ```
   [Server] Starting AI Teacher Relay Server...
   [Firebase Admin] Initialized successfully
   [RealtimeRelay] Listening on ws://localhost:8081
   [Server] AI Teacher System ready on port 8081
   ```

6. **SUCCESS!** The server is running

7. **⚠️ DO NOT CLOSE THIS WINDOW**
   - Keep it running in the background

---

### Step 5.2: Start React App (New Window)

1. **Open a NEW PowerShell window:**
   - Windows key + X → PowerShell
   - Or: Right-click in File Explorer → Open PowerShell

2. **Navigate to project:**
   ```powershell
   cd E:\AI-RealTimeVoiceChat
   ```

3. **Type this command:**
   ```powershell
   npm start
   ```

4. **Press Enter**

5. **Wait for compilation** (30-60 seconds)
   - You'll see "Compiling..."
   - Then "Compiled successfully!"

6. **Your browser will automatically open** to `http://localhost:3000`

7. **⚠️ DO NOT CLOSE THIS WINDOW**
   - Keep it running in the background

---

## 🧪 Part 6: Test the System (5 minutes)

### Step 6.1: Test Login

1. **In your browser**, you should see the **Login Page**
   - Blue/purple gradient background
   - Robot emoji 🤖
   - "AI先生" title
   - Email and password fields

2. **Enter credentials:**
   - Email: `test-preschool@example.com`
   - Password: `Test1234!`

3. **Click "ログイン" (Login) button**

4. **Wait 2-3 seconds**

5. **You should be redirected** to the AI Teacher interface
   - You'll see a large 🎤 button
   - Top of page shows connection status

---

### Step 6.2: Test Voice Interaction

**BEFORE STARTING:**
- Make sure your microphone is connected
- Close other apps using the microphone (Zoom, Discord, etc.)

1. **Look at the screen**
   - You should see a large circular green button
   - With text: "おして はなす" (Press to talk)

2. **PRESS AND HOLD** the button (don't just click)
   - The button turns RED
   - Text changes to: "話しています..." (Speaking...)

3. **While holding, speak clearly:**
   ```
   Say: "こんにちは"
   (or any simple Japanese phrase)
   ```

4. **RELEASE the button**

5. **Wait 2-3 seconds**

6. **The AI should respond:**
   - You'll hear audio output
   - You'll see text transcription
   - Response should be in Japanese

7. **SUCCESS!** The system is working

---

### Step 6.3: Check Usage Counter

1. **Go back to Firebase Console** in your browser

2. **Click "Firestore Database"**

3. **Click on `users` collection**

4. **Click on the user you logged in with**

5. **Check the `usageCount` field**
   - It should be `1` now (was `0` before)

6. **Click "Authentication"** in the left sidebar

7. **Click "Users" tab**

8. **Find your test user**
   - Check the "Last sign-in" timestamp
   - Should be just now

---

### Step 6.4: Check Conversation Logs

1. **In Firebase Console**, click **"Firestore Database"**

2. **Look for a NEW collection:** `conversations`
   - It should have appeared after your first interaction

3. **Click on `conversations`**

4. **Click on any document**

5. **You should see:**
   - `userId`: Your user ID
   - `question`: What you said
   - `answer`: What the AI replied
   - `timestamp`: When it happened
   - `audioLength`: Duration

6. **SUCCESS!** Everything is being logged correctly

---

## ✅ Verification Checklist

Go through this checklist to make sure everything works:

### Firebase Setup
- [ ] Firebase project created: "AI-Teacher-System"
- [ ] Authentication enabled (Email/Password)
- [ ] Firestore Database created
- [ ] Web app registered (got firebaseConfig)
- [ ] Service account key downloaded

### Environment Configuration
- [ ] `.env` file created in project root
- [ ] OPENAI_API_KEY filled in
- [ ] All REACT_APP_FIREBASE_* variables filled in (6 total)
- [ ] FIREBASE_SERVICE_ACCOUNT_KEY filled in (JSON on one line)

### Database Initialization
- [ ] Test users created (3 users)
- [ ] Sample data imported (RAG content, experiments, prompts)
- [ ] Verified in Firebase Console (4 collections exist)

### Security Rules
- [ ] Security rules copied from guide
- [ ] Rules published in Firebase Console
- [ ] No errors shown

### System Running
- [ ] Relay server running (Terminal 1)
- [ ] React app running (Terminal 2)
- [ ] Browser opened to localhost:3000
- [ ] No errors in PowerShell windows

### Testing
- [ ] Login page appears
- [ ] Can log in with test-preschool@example.com
- [ ] Redirected to AI Teacher interface
- [ ] PTT button visible and clickable
- [ ] Microphone access granted
- [ ] Can record audio (button turns red)
- [ ] AI responds after releasing button
- [ ] Response is in Japanese
- [ ] Usage counter incremented in Firestore
- [ ] Conversation logged in Firestore

---

## 🐛 Troubleshooting

### Problem: "Cannot find module 'dotenv'"

**Solution:**
```powershell
npm install
```
Then try again.

---

### Problem: "FIREBASE_SERVICE_ACCOUNT_KEY is required"

**Solution:**
1. Open `.env` file
2. Check that `FIREBASE_SERVICE_ACCOUNT_KEY=` line exists
3. Make sure the JSON is ALL ON ONE LINE (no line breaks)
4. Make sure there's no space after the `=` sign
5. Save the file
6. Restart the relay server

---

### Problem: Login fails immediately

**Solution:**
1. Check PowerShell relay server window for errors
2. Verify all REACT_APP_FIREBASE_* variables are correct
3. Check that email is exactly: `test-preschool@example.com`
4. Check that password is exactly: `Test1234!` (capital T, number 1)

---

### Problem: PTT button not working

**Solution:**
1. Check browser console (F12 → Console tab)
2. Allow microphone permissions when browser asks
3. Try Chrome instead of other browsers
4. Check that relay server is running (Terminal 1)

---

### Problem: "Usage limit exceeded" immediately

**Solution:**
1. Go to Firebase Console → Firestore Database
2. Click `users` collection
3. Click on your user document
4. Find `usageCount` field
5. Click the "..." menu next to it
6. Click "Edit field"
7. Change value to `0`
8. Click "Update"
9. Try logging in again

---

### Problem: No audio response

**Solution:**
1. Check your computer volume (not muted)
2. Check that relay server shows "Connected to OpenAI"
3. Verify OpenAI API key is correct in `.env`
4. Check OpenAI account has credits: https://platform.openai.com/usage

---

## 📞 Need More Help?

1. **Check PowerShell windows for error messages**
   - Relay server (Terminal 1)
   - React app (Terminal 2)

2. **Check browser console**
   - Press F12
   - Click "Console" tab
   - Look for red error messages

3. **Check Firebase Console**
   - Authentication → Users (should show your test users)
   - Firestore Database (should show 4 collections)

4. **Review the files:**
   - `SETUP_GUIDE.md` - Detailed troubleshooting
   - `AI_TEACHER_README.md` - System overview
   - `IMPLEMENTATION_SUMMARY.md` - Technical details

---

## 🎉 Success!

If you've completed all steps and passed all checks, congratulations!

Your AI Teacher System is now:
- ✅ Fully configured
- ✅ Connected to Firebase
- ✅ Connected to OpenAI
- ✅ Ready for use 

**Next Steps:**
1. Test with all 3 user accounts
2. Try different questions in Japanese
3. Monitor usage in Firebase Console
4. Customize RAG content for your needs
5. Deploy to production when ready

---

**You're ready to help children learn! 🎓✨**

