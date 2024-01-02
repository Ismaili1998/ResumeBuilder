// Import the functions you need from the SDKs you need
import { getApp, getApps, initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBxng24tDS03p3xp2Ddfa0qsK2SYAKXoEk",
    authDomain: "resumebuilder-135c3.firebaseapp.com",
    projectId: "resumebuilder-135c3",
    storageBucket: "resumebuilder-135c3.appspot.com",
    messagingSenderId: "505632094511",
    appId: "1:505632094511:web:156736a171a9ca2628c9da",
    measurementId: "G-ZDBYDFFK7W"
};

// Initialize Firebase
const app = getApps.length > 0 ? getApp() : initializeApp(firebaseConfig);
const auth = getAuth(app)
const db = getFirestore(app)
const storage = getStorage(app)
// const analytics = getAnalytics(app);
export { auth, db, storage };