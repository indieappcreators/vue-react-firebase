import { initializeApp } from "firebase/app"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getAuth, connectAuthEmulator} from 'firebase/auth'
import config from '../../fireabase_config.json';
import options  from '../../firebase.json'

if (import.meta.env.MODE === "development") {
  console.log('connecting to emulators')
  connectFirestoreEmulator(firestore, "localhost", options.firestore.port);
  connectAuthEmulator(auth, `http://localhost:${options.auth.port}/`)
}

export const app = initializeApp(config);
export const firestore = getFirestore();
export const auth = getAuth();