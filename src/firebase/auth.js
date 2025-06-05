import { auth } from './index.js'
import { sendSignInLinkToEmail, createUserWithEmailAndPassword, signInWithEmailLink, isSignInWithEmailLink, onAuthStateChanged, signInWithEmailAndPassword, signInAnonymously } from "firebase/auth";


const actionCodeSettings = {
  "url": location.origin + '/sign-in/confirm',
  "handleCodeInApp": true,
};

const localStoreageId = 'emailForSignIn';

export const authAnonymously = async () => {
  try {
    const userCredential = await signInAnonymously(auth);
    return userCredential.user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}


export const signInEmailPassword = async ({email, password}) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const checkAuthentication = async () => await new Promise((resolve, reject) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    unsubscribe();

    if (user) {
      resolve({isAuthenticated: true, user})
    } else {
      resolve({isAuthenticated: false})
    }
  }, (error) => {
    reject(error)
  });
});

export const getCurrentUser = () => {
  const user = auth.currentUser;
  if (user) {
    return user
  }

  return new Error('no current user')
}

export const getIdToken = async () => {
  const token = await auth.currentUser.getIdToken(true);
  return token
};

export const signOut = () => auth.signOut();

export const sendSignInLink = async ({email}) => {
  try {
    await sendSignInLinkToEmail(auth, email, actionCodeSettings);
    window.localStorage.setItem(localStoreageId, email);
    return true
  } catch (err) {
    return new Error(err)
  }
}

export const isSignInLink = ({link}) => isSignInWithEmailLink(auth, link)

export const signInWithLink = async ({link, email = null}) => {
  try {
    if (isSignInWithEmailLink(auth, link)) {
      email = email ? email : window.localStorage.getItem(localStoreageId);
  
      if (!email) {
        throw 'no_email'
      }

      const result = await signInWithEmailLink(auth, email, link);

      if (result) {
        window.localStorage.removeItem(localStoreageId);
        return result.user;
      } else {
        throw 'login_failed'
      }

    } else {
      throw 'invalid_auth_link'
    }
  } catch (err) {
    return new Error(err)
  }
}

export const signUpEmailPassword = async ({email, password}) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.log(error);
    throw error;
  }
}