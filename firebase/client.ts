import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyCnc-7C_6NoH9-D-nbISG_AJeD4IgEmqfE",
  authDomain: "hirevueai.firebaseapp.com",
  projectId: "hirevueai",
  storageBucket: "hirevueai.firebasestorage.app",
  messagingSenderId: "297993308745",
  appId: "1:297993308745:web:efa5f02962c3319b490d98",
  measurementId: "G-NWZ7330RH3"
};

const app = !getApps.length ? initializeApp(firebaseConfig) :getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);