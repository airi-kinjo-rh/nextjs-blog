import { initializeApp } from "firebase/app";
import { cert } from "firebase-admin/app";
// import firebase from "firebase/app";
// import "firebase/compat/storage";
// import 'firebase/compat/firestore';
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export default function initFirebase() {
    const serviceAccount = require('./serviceAccountKey.json');
    const firebaseConfigs = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
        measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMNT_ID,
        credential: cert(serviceAccount),
    }
    initializeApp(firebaseConfigs);

    // const admin = require("firebase-admin");
    // const serviceAccount = require("./serviceAccountKey.json");
    // admin.initializeApp({
    //     credential: admin.credential.cert(serviceAccount)
    // });


    console.log("Firebase has been init successfully");
}
