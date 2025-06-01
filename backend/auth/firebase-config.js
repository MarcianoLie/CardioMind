const { initializeApp } = require('firebase/app');
const { getAnalytics } = require('firebase/analytics');
const { getAuth } = require('firebase/auth');
const { getFirestore, collection, doc, setDoc, getDocs, getDoc, deleteDoc, updateDoc } = require('firebase/firestore');
const { getDatabase, ref, get } = require('firebase/database');

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
const db = getFirestore(app);
const realtimeDb = getDatabase(app); 

module.exports = { auth, db, realtimeDb, ref, get, collection, doc, setDoc, getDocs, getDoc, deleteDoc, updateDoc };