// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCf6j0iDxhykwdsGgigG90ogJHI4TdEOfk",
  authDomain: "vhgp-bf3e3.firebaseapp.com",
  projectId: "vhgp-bf3e3",
  storageBucket: "vhgp-bf3e3.firebasestorage.app",
  messagingSenderId: "1033937614588",
  appId: "1:1033937614588:web:da8269a33df1cab164c979",
  measurementId: "G-MBK5GXCHV5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
