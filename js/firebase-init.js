// js/firebase-init.js
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwgk81n4bq9PIRseZaFHasJU7udxEQnNs",
  authDomain: "naijabiz-pro.firebaseapp.com",
  projectId: "naijabiz-pro",
  storageBucket: "naijabiz-pro.firebasestorage.app",
  messagingSenderId: "156700555746",
  appId: "1:156700555746:web:371f7a5d9056f0814d61bb"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app); // The Database
const storage = getStorage(app); // The Image Storage

console.log("🔥 Firebase Connected Successfully!");

// Export the database so other pages can use it
export { db, storage };