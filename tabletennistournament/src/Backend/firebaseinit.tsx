import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
    apiKey: "AIzaSyC0fqdkCB4Zpq1tkqJjbLdOPipaXZ6AdtE",
    authDomain: "firsttoeleven-b5ade.firebaseapp.com",
    projectId: "firsttoeleven-b5ade",
    storageBucket: "firsttoeleven-b5ade.appspot.com",
    messagingSenderId: "97616391413",
    appId: "1:97616391413:web:3f4750771aa72fa0cd29bc",
    measurementId: "G-LPMMJFBVR7",
    databaseURL: "https://firsttoeleven-b5ade-default-rtdb.europe-west1.firebasedatabase.app"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

export default db;
