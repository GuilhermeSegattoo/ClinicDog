import { initializeApp } from 'firebase/app';
import { getAuth, initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { getFirestore } from 'firebase/firestore';

// ✅ Config oficial do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBdGnEsj11ZUMW8hMXzU2AZZtrF3p21htI",
  authDomain: "adoteme-ff88e.firebaseapp.com",
  projectId: "adoteme-ff88e",
  storageBucket: "adoteme-ff88e.appspot.com",
  messagingSenderId: "575955920972",
  appId: "1:575955920972:web:c6e35d5a1cb9ff1c7c6ce9",
};

const app = initializeApp(firebaseConfig);

let auth;

if (Platform.OS === 'web') {
  auth = getAuth(app);
} else {

  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// Initialize Firestore
const db = getFirestore(app);

// Exporte tanto auth quanto db
export { auth, db };