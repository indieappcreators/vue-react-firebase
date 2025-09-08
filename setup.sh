#!/bin/bash

echo "🚀 React + Firebase Boilerplate Setup"
echo "====================================="
echo ""

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo "❌ Firebase CLI not found. Installing..."
    npm install -g firebase-tools
    echo "✅ Firebase CLI installed!"
else
    echo "✅ Firebase CLI already installed"
fi

echo ""
echo "📋 Next steps:"
echo "1. Update firebaseConfig.js with your Firebase project settings"
echo "2. Update .firebaserc with your project ID"
echo "3. Run 'npm run dev' to start development with Firebase exec"
echo ""
echo "🔗 Useful links:"
echo "- Firebase Console: https://console.firebase.google.com/"
echo "- Firebase Docs: https://firebase.google.com/docs"
echo "- React Docs: https://react.dev/"
echo ""
echo "🎉 Happy coding!"
