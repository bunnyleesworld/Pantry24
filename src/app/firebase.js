// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCoi6idge1DQuid0wXcWkz-DvbnWkWv6cw",
  authDomain: "pantry-app-8edb2.firebaseapp.com",
  projectId: "pantry-app-8edb2",
  storageBucket: "pantry-app-8edb2.appspot.com",
  messagingSenderId: "428595611165",
  appId: "1:428595611165:web:78c71c40096419b8dae8f4",
  measurementId: "G-9KCH67V9YL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);


export {firestore}