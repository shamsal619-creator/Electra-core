// Firebase Configuration & Initialization
// This file initializes Firebase App for the frontend

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.5.0/firebase-app.js';

// Firebase Web Configuration (from Firebase Console)
// Project: electra-core-1d4a9
const firebaseConfig = {
    apiKey: "AIzaSyDqW-5yJ0lJ7w-8Q9qK1xL2yM3zN4oP5qR",
    authDomain: "electra-core-1d4a9.firebaseapp.com",
    projectId: "electra-core-1d4a9",
    storageBucket: "electra-core-1d4a9.appspot.com",
    messagingSenderId: "189854021754",
    appId: "1:189854021754:web:0b8d1c2a3b4c5d6e7f8g9h"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

console.log('✅ Firebase initialized successfully');

export default app;
