import { auth } from './app'
import { sendSignInLinkToEmail, createUserWithEmailAndPassword, signInWithEmailLink, isSignInWithEmailLink, onAuthStateChanged, signInWithEmailAndPassword, signInAnonymously } from "firebase/auth";
import type { User, LoginFormData, SignUpFormData, AuthState } from '../types/firebase';

const actionCodeSettings = {
  "url": location.origin + '/sign-in/confirm',
  "handleCodeInApp": true,
};

const localStorageId = 'emailForSignIn';

export const authAnonymously = async (): Promise<User> => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const signInEmailPassword = async ({email, password}: SignUpFormData): Promise<User> => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const checkAuthentication = async (): Promise<AuthState> => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();

      if (user) {
        resolve({isAuthenticated: true, user, isLoading: false})
      } else {
        resolve({isAuthenticated: false, user: null, isLoading: false})
      }
    }, (error) => {
      reject(error)
    });
  });
};

export const getCurrentUser = (): User | null => {
  return auth.currentUser;
}

export const getIdToken = async (): Promise<string> => {
  const user = auth.currentUser;
  if (!user) {
    throw new Error('No current user');
  }
  const token = await user.getIdToken(true);
  return token;
};

export const signOut = (): Promise<void> => auth.signOut();

export const sendSignInLink = async ({email}: LoginFormData): Promise<boolean> => {
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem(localStorageId, email);
    return true;
  } catch (err) {
    throw new Error(err as string);
  }
}

export const isSignInLink = ({link}: {link: string}): boolean => isSignInWithEmailLink(auth, link);

export const signInWithLink = async ({link, email = null}: {link: string, email?: string | null}): Promise<User> => {
  try {
    if (isSignInWithEmailLink(auth, link)) {
      const emailToUse = email ? email : window.localStorage.getItem(localStorageId);
  
      if (!emailToUse) {
        throw new Error('no_email');
      }

      const result = await signInWithEmailLink(auth, emailToUse, link);

      if (result) {
        window.localStorage.removeItem(localStorageId);
        return result.user;
      } else {
        throw new Error('login_failed');
      }

    } else {
      throw new Error('invalid_auth_link');
    }
  } catch (err) {
    throw new Error(err as string);
  }
}

export const signUpEmailPassword = async ({email, password}: SignUpFormData): Promise<User> => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
