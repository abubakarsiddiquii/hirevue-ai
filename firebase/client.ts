// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCnc-7C_6NoH9-D-nbISG_AJeD4IgEmqfE",
  authDomain: "hirevueai.firebaseapp.com",
  projectId: "hirevueai",
  storageBucket: "hirevueai.firebasestorage.app",
  messagingSenderId: "297993308745",
  appId: "1:297993308745:web:efa5f02962c3319b490d98",
  measurementId: "G-NWZ7330RH3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);