import { initializeApp } from "firebase/app";
// import { cert } from "firebase-admin/app";
// import serviceAccount from "./serviceAccountKey.json";
// import firebase from "firebase/app";
// import "firebase/compat/storage";
// import 'firebase/compat/firestore';
// import { getAnalytics } from "firebase/analytics";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

export default async function initFirebase() {
    // const serviceAccount = require('./serviceAccountKey.json');
    const firebaseConfigs = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMNT_ID,
        // credential: {
        //     type: process.env.TYPE,
        //     project_id: PROJECT_ID,
        //     private_key_id: ,
        //     private_key: ,
        //     client_email
        //     client_id,
        //     auth
        // },
    }
    // console.log('firebaseConfig: \n', firebaseConfigs)
    initializeApp(firebaseConfigs);

    // const admin = require("firebase-admin");
    // const serviceAccount = require("./serviceAccountKey.json");
    // admin.initializeApp({
    //     credential: admin.credential.cert(serviceAccount)
    // });


    console.log("Firebase has been init successfully");
}
