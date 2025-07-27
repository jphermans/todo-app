import { initializeApp } from 'firebase/app';
import { getDatabase, ref, set, get, onValue, off } from 'firebase/database';

// Firebase configuration from environment variables with fallback
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'demo-key',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'demo.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://demo.firebaseio.com',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'demo-project',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '123456789',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:123456789:web:demo',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-DEMO'
};

// Check if we're missing required Firebase credentials
const hasValidConfig = firebaseConfig.apiKey && firebaseConfig.apiKey !== 'demo-key';

let database;
try {
  if (hasValidConfig) {
    const app = initializeApp(firebaseConfig);
    database = getDatabase(app);
    console.log('✅ Firebase initialized successfully');
  } else {
    console.warn('⚠️ Using demo Firebase config - features may not work');
    database = null; // Will trigger localStorage fallback
  }
} catch (error) {
  console.error('❌ Firebase initialization failed:', error);
  database = null; // Fallback to localStorage
}

export { database, ref, set, get, onValue, off };