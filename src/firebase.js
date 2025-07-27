import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, off } from 'firebase/database';

// Your Firebase configuration - replace with your actual config from Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyCQhA8Squ_Fq_iyiv3EEUQX_3uVkWDEsHw",
  authDomain: "todo-944c5.firebaseapp.com",
  databaseURL: "https://todo-944c5-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "todo-944c5",
  storageBucket: "todo-944c5.firebasestorage.app",
  messagingSenderId: "233006683224",
  appId: "1:233006683224:web:c80aaa59dbe77bab5c262d",
  measurementId: "G-7C4568C9HE"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, set, get, onValue, off };