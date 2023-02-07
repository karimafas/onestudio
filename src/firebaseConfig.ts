import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

// Initialize Firebase
const app = initializeApp({
  apiKey: "AIzaSyDkmZFdUtsAsGs-taErOSzSekuNJX55Kvg",
  authDomain: "onestudio-91c33.firebaseapp.com",
  projectId: "onestudio-91c33",
  storageBucket: "onestudio-91c33.appspot.com",
  messagingSenderId: "790599047718",
  appId: "1:790599047718:web:29eb5cbe40b138187ce4e7",
  measurementId: "G-12TJWFY2C0",
});

// Firebase storage reference
const storage = getStorage(app);
export default storage;
