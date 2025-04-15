import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = { 
    apiKey: "AIzaSyBzneED6xnLLmzkeac52Z4EjkKUJh-nVVo",
    authDomain: "cardiomind-950e7.firebaseapp.com",
    projectId: "cardiomind-950e7",
    storageBucket: "cardiomind-950e7.firebasestorage.app",
    messagingSenderId: "311102107184",
    appId: "1:311102107184:web:e622ffa016d8bdb74b47f5",
    measurementId: "G-ZNLND80HSD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };