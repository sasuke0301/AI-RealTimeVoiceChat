# 🤖 AI Teacher System

A voice-based AI learning assistant for children, built on OpenAI's Realtime API with Firebase backend.

## 🎯 Features

### ✅ Core Functionality
- **Voice Interaction**: Push-to-talk (PTT) interface optimized for tablets
- **User Authentication**: Secure login with email/password
- **Usage Limits**: Per-user monthly interaction limits (default: 300)
- **Conversation Logging**: All interactions stored in Firestore
- **Multi-Level Support**: Different difficulty levels (preschool, grade 1, grade 3)

### ✅ AI Features
- **Child-Friendly Personality**: Warm, encouraging "Sensei" persona
- **RAG (Retrieval-Augmented Generation)**: Uses educational materials database
- **Auto URL Append**: Automatically suggests relevant experiment links
- **Response Time Monitoring**: Optimized for <2 second responses
- **Error Handling**: Child-friendly error messages in Japanese

### ✅ Technical Features
- **Firebase Authentication**: Secure user management
- **Firestore Database**: Real-time database with security rules
- **Firebase Admin SDK**: Server-side operations and logging
- **Relay Server**: Secure API key management
- **Tablet Optimized**: Large touch targets, simplified UI

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Setup Environment
Copy `env.example.txt` to `.env` and fill in your credentials:
- OpenAI API Key
- Firebase Client Config
- Firebase Admin Service Account Key

### 3. Setup Firebase
Follow the detailed guide in `SETUP_GUIDE.md`:
- Create Firebase project
- Enable Authentication (Email/Password)
- Create Firestore Database
- Set security rules

### 4. Initialize Database
```bash
# Create test users
node scripts/createTestUsers.js

# Import sample data (RAG content, experiments, prompts)
node scripts/importRAGContent.js
```

### 5. Run the System
```bash
# Terminal 1: Start relay server
npm run relay

# Terminal 2: Start React app
npm start
```

### 6. Test It!
- Open `http://localhost:3000`
- Login with: `test-preschool@example.com` / `Test1234!`
- Press and hold the 🎤 button
- Speak in Japanese: "空はなぜ青いの？"
- Release and wait for response

---

## 📁 Project Structure

```
AI-RealTimeVoiceChat/
├── src/
│   ├── config/
│   │   └── firebase.ts              # Firebase client configuration
│   ├── pages/
│   │   ├── LoginPage.tsx            # Login UI
│   │   ├── LoginPage.scss           # Login styles
│   │   ├── ConsolePage.tsx          # Main AI interface (updated)
│   │   ├── ConsolePage.scss         # Main styles
│   │   └── ConsolePage-tablet.scss  # Tablet-optimized styles
│   ├── utils/
│   │   └── conversation_config.js   # AI Teacher personality
│   └── App.tsx                      # Authentication flow
│
├── relay-server/
│   ├── index.js                     # Server entry point
│   ├── firebase-admin.js            # Firebase Admin SDK setup
│   ├── lib/
│   │   ├── relay.js                 # Original relay (backup)
│   │   └── relay-enhanced.js        # Enhanced relay with AI features
│   ├── middleware/
│   │   └── usageLimit.js            # Usage limit checker
│   └── services/
│       ├── ragService.js            # RAG content search
│       ├── urlService.js            # Auto URL append
│       └── logger.js                # Conversation logging
│
├── scripts/
│   ├── createTestUsers.js          # Create test accounts
│   └── importRAGContent.js         # Import sample data
│
├── .env                             # Environment variables (create this!)
├── env.example.txt                  # Environment template
├── SETUP_GUIDE.md                   # Detailed setup instructions
└── AI_TEACHER_README.md             # This file
```

---

## 🎨 User Interface

### Login Page
- Clean, modern design with gradient background
- Email/password authentication
- Child-friendly error messages
- Responsive for tablets

### AI Teacher Interface
- **Large PTT Button**: 180x180px circular button
- **Visual Feedback**: Color changes and animations
- **Usage Counter**: Displays remaining interactions
- **Child-Friendly Errors**: Japanese messages with emojis
- **Conversation History**: Color-coded user/assistant messages

---

## 🗄️ Database Structure

### Firestore Collections

#### `users`
```javascript
{
  userId: "abc123",
  email: "student@example.com",
  displayName: "テストユーザー",
  usageLimit: 300,
  usageCount: 45,
  resetDate: Timestamp,
  courseLevel: "preschool",
  createdAt: Timestamp,
  lastUsedAt: Timestamp
}
```

#### `conversations`
```javascript
{
  userId: "abc123",
  question: "空はなぜ青いの？",
  answer: "すごい質問だね！...",
  audioLength: 3.5,
  timestamp: Timestamp,
  responseTime: 1234
}
```

#### `ragContent`
```javascript
{
  contentId: "safety001",
  title: "実験の安全ルール",
  content: "実験を始める前に...",
  category: "safety",
  keywords: ["安全", "ルール"],
  targetAge: "all",
  createdAt: Timestamp
}
```

#### `experiments`
```javascript
{
  experimentId: "exp001",
  title: "色水実験",
  description: "色を混ぜて...",
  url: "https://example.com/exp001",
  keywords: ["色", "水", "混ぜる"],
  category: "実験"
}
```

#### `prompts`
```javascript
{
  courseLevel: "preschool",
  instructions: "あなたは優しいAI先生です...",
  difficultyDescription: "年長向け - 簡単な言葉"
}
```

---

## 🔒 Security

### Firebase Security Rules
- Users can only read their own data
- All writes must come from server (Firebase Admin SDK)
- Prevents unauthorized access and data manipulation

### API Key Protection
- OpenAI API key stored only on server
- Relay server manages all API calls
- Client sends userId, not API credentials

### Authentication
- Firebase Authentication with email/password
- Session management with automatic token refresh
- Secure logout functionality

---

## 🎯 Key Requirements Met

| Requirement | Implementation | Status |
|------------|----------------|--------|
| Voice Q&A | PTT with OpenAI Realtime API | ✅ |
| Authentication | Firebase Auth (email/password) | ✅ |
| Usage Limits | Per-user monthly counter | ✅ |
| Logging | All conversations in Firestore | ✅ |
| RAG System | Keyword-based search | ✅ |
| Level Adjustment | Database-driven prompts | ✅ |
| Auto URL | Experiment matching logic | ✅ |
| Tablet UI | Large buttons, touch-optimized | ✅ |
| Child-Friendly | Warm personality, simple language | ✅ |
| Secure | API keys server-side only | ✅ |

---

## 🧪 Testing Credentials

After running `createTestUsers.js`:

```
Preschool Level:
- Email: test-preschool@example.com
- Password: Test1234!

Grade 1 Level:
- Email: test-grade1@example.com
- Password: Test1234!

Grade 3 Level:
- Email: test-grade3@example.com
- Password: Test1234!
```

---

## 📊 System Flow

```
1. User opens app
   ↓
2. Login with email/password
   ↓
3. Firebase Authentication verifies
   ↓
4. Load ConsolePage with userId
   ↓
5. Connect to Relay Server with userId
   ↓
6. Server checks usage limit in Firestore
   ↓
7. User presses PTT button and speaks
   ↓
8. Audio sent to relay server
   ↓
9. Server searches RAG content for context
   ↓
10. Server sends to OpenAI with enhanced prompt
    ↓
11. AI generates child-friendly response
    ↓
12. Server finds relevant experiment URL
    ↓
13. Server appends URL to response
    ↓
14. Response sent to client (audio + text)
    ↓
15. Server logs conversation to Firestore
    ↓
16. Server increments usage counter
```

---

## 🛠️ Customization

### Change AI Personality
Edit prompts in Firestore → `prompts` collection

### Add More RAG Content
1. Edit `scripts/importRAGContent.js`
2. Add new items to `ragContentSamples` array
3. Run: `node scripts/importRAGContent.js`

### Adjust Usage Limits
Update `usageLimit` field in Firestore → `users` collection

### Add New Course Levels
1. Create new prompt document in `prompts` collection
2. Set user's `courseLevel` to match
3. AI will automatically use appropriate difficulty

### Customize UI Colors
Edit `src/pages/ConsolePage-tablet.scss`

---

## 🚀 Deployment

### Frontend (React App)
```bash
# Build production bundle
npm run build

# Deploy to Firebase Hosting
firebase deploy --only hosting
```

### Backend (Relay Server)
Deploy to:
- **Heroku**: `heroku create` → `git push heroku main`
- **Railway**: Connect GitHub repo
- **AWS**: Use Elastic Beanstalk or Lambda
- **DigitalOcean**: App Platform

Remember to set environment variables on hosting platform!

---

## 📈 Monitoring

### Check Usage Stats
```javascript
// In Firestore Console
- Go to users collection
- See usageCount for each user
- Check lastUsedAt timestamps
```

### View Conversation Logs
```javascript
// In Firestore Console
- Go to conversations collection
- Filter by userId
- Sort by timestamp descending
```

### Server Logs
```bash
# Relay server shows:
- Connection events
- Usage limit checks
- RAG searches
- URL matches
- Conversation logging
```

---

## 🐛 Common Issues

### "Usage limit exceeded" immediately
→ Reset `usageCount` to 0 in Firestore

### PTT button not working
→ Check microphone permissions
→ Use HTTPS on mobile devices

### Slow responses (>5 seconds)
→ Check internet connection
→ Reduce RAG search results (change topK)

### RAG content not used
→ Verify content imported to Firestore
→ Check keyword matching in questions

See `SETUP_GUIDE.md` for detailed troubleshooting.

---

## 📚 Documentation

- **SETUP_GUIDE.md**: Complete setup instructions
- **AI_TEACHER_README.md**: This file (overview)
- **README.md**: Original OpenAI Realtime Console docs

---

## 🎉 Success Checklist

- [ ] Firebase project created
- [ ] Environment variables configured
- [ ] Dependencies installed
- [ ] Test users created
- [ ] Sample data imported
- [ ] Security rules deployed
- [ ] Both servers running
- [ ] Can log in successfully
- [ ] Voice interaction works
- [ ] Usage limits enforced
- [ ] Conversations logged
- [ ] RAG content used
- [ ] URLs appended

---

## 📞 Support

For issues or questions:
1. Check SETUP_GUIDE.md troubleshooting section
2. Review relay server logs
3. Check browser console for errors
4. Verify Firestore security rules
5. Ensure all .env variables are set

---

**Project Status: ✅ Complete and Ready for Use**

Target Delivery: November 30, 2025
Estimated Development Time: 2 weeks
Complexity: Advanced (Firebase + OpenAI + React)

**Built with ❤️ for children's education**

