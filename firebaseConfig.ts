// This config uses completely fake values - emulators work without real Firebase credentials!
// In development mode, the app connects to local emulators instead of these fake values

// firebaseConfig.ts
interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

const firebaseConfig: FirebaseConfig = {
  apiKey: "fake-api-key-for-development",
  authDomain: "fake-project.firebaseapp.com",
  projectId: "fake-project-id",
  storageBucket: "fake-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "fake-app-id"
};

export default firebaseConfig;