import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Firebase configuration
const firebaseConfig = { 
    apiKey: "AIzaSyBzneED6xnLLmzkeac52Z4EjkKUJh-nVVo",
    authDomain: "cardiomind-950e7.firebaseapp.com",
    projectId: "cardiomind-950e7",
    storageBucket: "cardiomind-950e7.firebasestorage.app",
    messagingSenderId: "311102107184",
    appId: "1:311102107184:web:e622ffa016d8bdb74b47f5",
    measurementId: "G-ZNLND80HSD"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);
console.log("Firebase App Initialized:", app);

// Initialize Firebase Authentication
const auth = getAuth(app);
console.log("Firebase Auth Initialized:", auth);

// Initialize Google Auth Provider
const googleProvider = new GoogleAuthProvider();
console.log("Google Auth Provider Initialized:", googleProvider);

export { auth, googleProvider };
