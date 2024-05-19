// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "enduan-max.firebaseapp.com",
  projectId: "enduan-max",
  storageBucket: "enduan-max.appspot.com",
  messagingSenderId: "872440783719",
  appId: "1:872440783719:web:7c466d609da270c49e85c2"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
