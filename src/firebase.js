// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyCKAAVnwCS5OTLcZ1rZPE22gpDZvnu1jrU",
    authDomain: "seedsync-8d924.firebaseapp.com",
    projectId: "seedsync-8d924",
    storageBucket: "seedsync-8d924.firebasestorage.app",
    messagingSenderId: "554850411224",
    appId: "1:554850411224:web:0f7fccf3ce58a1fc1badad",
    measurementId: "G-64X56M7VPL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const analytics = getAnalytics(app);
