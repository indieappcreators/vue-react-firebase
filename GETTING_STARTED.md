# 🚀 Quick Start Guide

## ⚡ Get Running in 5 Minutes

### 1. Install Firebase CLI (Required)
```bash
# Option 1: Run the setup script (recommended)
./setup.sh

# Option 2: Install manually
npm install -g firebase-tools
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Configure Firebase
- Open `firebaseConfig.js`
- Replace placeholder values with your Firebase project config
- Update `.firebaserc` with your project ID

### 4. Start Development
```bash
# Start everything with Firebase exec (recommended)
npm run dev:full

# Or separately:
npm run dev:firebase  # Firebase emulators
npm run dev:vite      # React dev server
```

## 🌐 Access Points
- **React App:** http://localhost:5173
- **Firebase Emulator UI:** http://localhost:4000

## 🔐 Test Authentication
1. Go to http://localhost:5173/login
2. Enter any email address
3. Check Firebase Emulator UI for the sign-in link
4. Click the link to sign in

## 📁 Key Files
- `firebaseConfig.js` - Your Firebase settings
- `src/components/Login.tsx` - Authentication page
- `src/components/Home.tsx` - Main dashboard
- `src/firebase/auth.ts` - Auth functions

## 🆘 Need Help?
- Run `./setup.sh` for setup assistance
- Check the main README.md for detailed instructions
- Review browser console for errors
- Ensure Firebase emulators are running

---

**That's it! You're ready to build amazing React apps! 🎉**
