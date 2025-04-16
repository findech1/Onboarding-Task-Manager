// src/firebase.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCcptCLUp0eCNaLOBqddzL6K-fXm8r2-8A",
  authDomain: "task-manager-26c13.firebaseapp.com",
  projectId: "task-manager-26c13",
  storageBucket: "task-manager-26c13.firebasestorage.app",
  messagingSenderId: "989645164616",
  appId: "1:989645164616:web:331a08a68350be647e487d",
  measurementId: "G-Z7P4MGHHCY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const db = getFirestore(app);