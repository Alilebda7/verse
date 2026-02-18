import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyChxYh3jZe283Z_jbhkd4TehwM1VV7vU-Y",
  authDomain: "verse-islam.firebaseapp.com",
  databaseURL: "https://verse-islam-default-rtdb.firebaseio.com",
  projectId: "verse-islam",
  storageBucket: "verse-islam.firebasestorage.app",
  messagingSenderId: "608540826456",
  appId: "1:608540826456:web:f0419d8507ab4df5d0a32d",
  measurementId: "G-RKLGQQ22M0",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
