# ✅ Quick Reference Checklist

**Print this page and check off each step as you complete it**

---

## 🔥 Firebase Console (https://console.firebase.google.com/)

### Create Project
- [ ] Go to Firebase Console
- [ ] Click "Add project"
- [ ] Name: `AI-Teacher-System`
- [ ] Disable Google Analytics
- [ ] Click "Create project"
- [ ] Click "Continue"

### Enable Authentication
- [ ] Click "Authentication" in sidebar
- [ ] Click "Get started"
- [ ] Click "Email/Password"
- [ ] Toggle ON
- [ ] Click "Save"

### Create Database
- [ ] Click "Firestore Database"
- [ ] Click "Create database"
- [ ] Select "Start in test mode"
- [ ] Choose location: `asia-northeast1`
- [ ] Click "Enable"

### Get Web Config
- [ ] Click ⚙️ → "Project settings"
- [ ] Scroll to "Your apps"
- [ ] Click `</>` (Web icon)
- [ ] Nickname: `ai-teacher-web`
- [ ] Don't check Hosting
- [ ] Click "Register app"
- [ ] **COPY** the config values

### Get Service Account
- [ ] Still in "Project settings"
- [ ] Click "Service accounts" tab
- [ ] Click "Generate new private key"
- [ ] Click "Generate key"
- [ ] **SAVE** the downloaded JSON file
- [ ] **COPY** entire JSON as ONE line

---

## 📝 Environment Setup (Your Computer)

### Prerequisites
- [ ] Node.js installed (v16+)
- [ ] npm installed
- [ ] OpenAI API key obtained

### Create .env File
- [ ] Open project folder: `E:\AI-RealTimeVoiceChat`
- [ ] Copy `env.example.txt` → `.env`
- [ ] Open `.env` in Notepad

### Fill in .env Variables
- [ ] `OPENAI_API_KEY=` (your OpenAI key)
- [ ] `REACT_APP_FIREBASE_API_KEY=` (from Web Config)
- [ ] `REACT_APP_FIREBASE_AUTH_DOMAIN=`
- [ ] `REACT_APP_FIREBASE_PROJECT_ID=`
- [ ] `REACT_APP_FIREBASE_STORAGE_BUCKET=`
- [ ] `REACT_APP_FIREBASE_MESSAGING_SENDER_ID=`
- [ ] `REACT_APP_FIREBASE_APP_ID=`
- [ ] `FIREBASE_SERVICE_ACCOUNT_KEY=` (JSON on ONE line)
- [ ] Save file (Ctrl+S)

---

## 🗄️ Database Initialization (PowerShell)

### Open PowerShell
- [ ] Navigate to project folder
- [ ] `cd E:\AI-RealTimeVoiceChat`

### Create Test Users
- [ ] Run: `node scripts/createTestUsers.js`
- [ ] See: "✅ Test user creation complete!"

### Import Sample Data
- [ ] Run: `node scripts/importRAGContent.js`
- [ ] See: "✅ All data imported successfully!"

### Verify in Firebase
- [ ] Open Firebase Console → Firestore Database
- [ ] See 4 collections: `users`, `ragContent`, `experiments`, `prompts`
- [ ] Click `users` → See 3 documents
- [ ] Click "Authentication" → See 3 users

---

## 🔒 Security Rules (Firebase Console)

### Update Rules
- [ ] Firestore Database → "Rules" tab
- [ ] Select all existing text (Ctrl+A)
- [ ] Delete
- [ ] Copy rules from `MANUAL_SETUP_STEPS.md` (Step 4.2)
- [ ] Paste into editor
- [ ] Click "Publish"
- [ ] See: "Rules published successfully"

---

## 🚀 Run the System (2 PowerShell Windows)

### Terminal 1: Relay Server
- [ ] Open PowerShell in project folder
- [ ] Run: `npm run relay`
- [ ] See: "[Server] AI Teacher System ready on port 8081"
- [ ] Keep window open

### Terminal 2: React App
- [ ] Open NEW PowerShell window
- [ ] Run: `cd E:\AI-RealTimeVoiceChat`
- [ ] Run: `npm start`
- [ ] See: "Compiled successfully!"
- [ ] Browser opens to `http://localhost:3000`
- [ ] Keep window open

---

## 🧪 Test the System

### Test Login
- [ ] See login page (gradient background, robot emoji)
- [ ] Email: `test-preschool@example.com`
- [ ] Password: `Test1234!`
- [ ] Click "ログイン"
- [ ] Redirected to AI interface

### Test Voice
- [ ] See large green 🎤 button
- [ ] **Press and HOLD** button (turns red)
- [ ] Say: "こんにちは"
- [ ] **Release** button
- [ ] Wait 2-3 seconds
- [ ] Hear AI response in Japanese
- [ ] See text transcription

### Verify Logging
- [ ] Firebase Console → Firestore Database
- [ ] Click `users` → Your user → Check `usageCount: 1`
- [ ] See new collection: `conversations`
- [ ] Click `conversations` → See your Q&A logged

---

## ✅ Final Verification

### Everything Working?
- [ ] Can log in
- [ ] PTT button works
- [ ] Can record audio
- [ ] AI responds
- [ ] Response is in Japanese
- [ ] Usage counter increments
- [ ] Conversations logged
- [ ] No errors in PowerShell windows

---

## 📞 If Something Goes Wrong

### Check These:
- [ ] Both PowerShell windows still running?
- [ ] Any red errors in PowerShell?
- [ ] Browser console errors (F12)?
- [ ] `.env` file saved?
- [ ] All `.env` variables filled in?
- [ ] JSON on ONE line in `.env`?
- [ ] Microphone permissions granted?
- [ ] Internet connection active?

### Get Help:
- [ ] Read `MANUAL_SETUP_STEPS.md` (detailed troubleshooting)
- [ ] Read `SETUP_GUIDE.md` (comprehensive guide)
- [ ] Check Firebase Console for errors
- [ ] Review PowerShell error messages

---

## 🎉 Success Criteria

**You're done when:**
- ✅ Both servers running without errors
- ✅ Login page loads at localhost:3000
- ✅ Can log in with test credentials
- ✅ PTT button visible and functional
- ✅ AI responds to voice input
- ✅ Conversations appear in Firestore
- ✅ Usage count increases

---

## 📝 Test Credentials (Save These!)

```
User 1 (Preschool):
Email: test-preschool@example.com
Password: Test1234!
Level: preschool (年長)

User 2 (Grade 1):
Email: test-grade1@example.com
Password: Test1234!
Level: grade1 (小1)

User 3 (Grade 3):
Email: test-grade3@example.com
Password: Test1234!
Level: grade3 (小3)
```

---

## ⏱️ Time Estimate

- Firebase Setup: 20 minutes
- Environment Config: 10 minutes
- Database Init: 5 minutes
- Security Rules: 5 minutes
- Run & Test: 5 minutes

**Total: 45 minutes**

---

## 🚀 Quick Commands Reference

```powershell
# Create test users
node scripts/createTestUsers.js

# Import sample data
node scripts/importRAGContent.js

# Start relay server (Terminal 1)
npm run relay

# Start React app (Terminal 2)
npm start
```

---

**Print this page and keep it handy! ✨**

