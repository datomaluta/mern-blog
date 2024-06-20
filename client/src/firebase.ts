// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-blog-96365.firebaseapp.com",
  projectId: "mern-blog-96365",
  storageBucket: "mern-blog-96365.appspot.com",
  messagingSenderId: "630991546194",
  appId: "1:630991546194:web:b6e907772ad7fbfebc3c8b",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
