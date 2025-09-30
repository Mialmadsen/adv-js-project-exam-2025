// import { onMounted, ref } from 'vue'
import { initializeApp } from "firebase/app";
import { getFirestore, /* collection, onSnapshot , doc, addDoc, deleteDoc*/ } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBGTKywaNaagbx7iTxyZi95vSoHQEcVQi8",
  authDomain: "swim-run-event.firebaseapp.com",
  projectId: "swim-run-event",
  storageBucket: "swim-run-event.firebasestorage.app",
  messagingSenderId: "1090091528429",
  appId: "1:1090091528429:web:b9dd0645cd28d13fb89ce4",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db }