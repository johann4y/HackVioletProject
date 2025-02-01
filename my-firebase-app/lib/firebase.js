// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getAuth, GoogleAuthProvider } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAJX4eeynj2vxMQuOjFHKE1sQOb40_hD28",
  authDomain: "hackvioletapp.firebaseapp.com",
  projectId: "hackvioletapp",
  storageBucket: "hackvioletapp.firebasestorage.app",
  messagingSenderId: "885763287630",
  appId: "1:885763287630:web:06280db88011acaa21b11f",
  measurementId: "G-JTB245FHR8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();