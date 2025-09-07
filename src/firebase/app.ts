import { initializeApp } from "firebase/app"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getAuth, connectAuthEmulator} from 'firebase/auth'
import config from '../../firebaseConfig.js';
import options  from '../../firebase.json'

export const app = initializeApp(config);
export const firestore = getFirestore(app);
export const auth = getAuth(app);

if (import.meta.env.MODE === "development") {
  console.log('connecting to emulators')
  connectFirestoreEmulator(firestore, "localhost", options.emulators.firestore.port);
  connectAuthEmulator(auth, `http://localhost:${options.emulators.auth.port}/`)
}
