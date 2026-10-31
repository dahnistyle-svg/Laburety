import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, initializeFirestore, Firestore } from "firebase/firestore";
import firebaseConfig from "../../../firebase-applet-config.json";

export const firebaseApp = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(firebaseApp);

function initDb(): Firestore {
  try {
    return firebaseConfig.firestoreDatabaseId
      ? initializeFirestore(
          firebaseApp,
          { ignoreUndefinedProperties: true },
          firebaseConfig.firestoreDatabaseId
        )
      : initializeFirestore(firebaseApp, { ignoreUndefinedProperties: true });
  } catch {
    return firebaseConfig.firestoreDatabaseId
      ? getFirestore(firebaseApp, firebaseConfig.firestoreDatabaseId)
      : getFirestore(firebaseApp);
  }
}

export const db = initDb();
export const googleProvider = new GoogleAuthProvider();

export default firebaseApp;
