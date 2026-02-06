import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyD5do7PbI3lWpwuT5KSmejah5TimQzK-ng",
//     authDomain: "deliveryfood-9c436.firebaseapp.com",
//     projectId: "deliveryfood-9c436",
//     storageBucket: "deliveryfood-9c436.appspot.com",
//     messagingSenderId: "682756485581",
//     appId: "1:682756485581:web:7bcb0b616d335b81285484",
//     measurementId: "G-0HQRH50TQ3",
// };

const firebaseConfig = {
  apiKey: "AIzaSyAylpn_KS0QugCUnoPu5195s-nWz1CbrKs",
  authDomain: "boxproduct-ba126.firebaseapp.com",
  projectId: "boxproduct-ba126",
  storageBucket: "boxproduct-ba126.appspot.com",
  messagingSenderId: "293660540157",
  appId: "1:293660540157:web:0dea29f634285c8736d294",
  measurementId: "G-G92P56SPTH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);