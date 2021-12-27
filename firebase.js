import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useEffect, useState } from "react";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIRE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIRE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIRE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIRE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIRE_SENDER,
  appId: process.env.NEXT_PUBLIC_FIRE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

const auth = getAuth();

export const signup = (email, password) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const singinfirebase = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export { app, db, storage };
export const useAuth = () => {
  const [user, setUser] = useState();
  useEffect(() => onAuthStateChanged(auth, (user) => setUser(user)), []);
  return user;
};
