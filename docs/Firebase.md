// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC_wtPFAZju7arEZ4V4qBFxv322T0diZgQ",
  authDomain: "rimbun-703b9.firebaseapp.com",
  projectId: "rimbun-703b9",
  storageBucket: "rimbun-703b9.firebasestorage.app",
  messagingSenderId: "1035756774659",
  appId: "1:1035756774659:web:d72f37bcec695ba50e3536",
  measurementId: "G-4Z2FZJ2L3F"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);