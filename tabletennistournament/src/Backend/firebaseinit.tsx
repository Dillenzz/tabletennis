import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBpe3B-61BmMQjWDO47CB3PhU3DYzHd3cQ",
  authDomain: "ft11-cb5a6.firebaseapp.com",
  projectId: "ft11-cb5a6",
  storageBucket: "ft11-cb5a6.appspot.com",
  messagingSenderId: "394898517371",
  appId: "1:394898517371:web:f4382831514e678c3a61de",
  measurementId: "G-M3X2JJ11HQ",
  databaseURL:
    "https://ft11-cb5a6-default-rtdb.europe-west1.firebasedatabase.app/",
};

export const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
