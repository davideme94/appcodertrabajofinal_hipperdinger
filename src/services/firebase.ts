import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";

// Config tomada de tu consola + databaseURL que pasaste
const firebaseConfig = {
  apiKey: "AIzaSyBYJjCgk3RGce5C8UGUlFNaf687oPaGxHI",
  authDomain: "las-hermanas-e26ff.firebaseapp.com",
  projectId: "las-hermanas-e26ff",
  storageBucket: "las-hermanas-e26ff.firebasestorage.app",
  messagingSenderId: "909176117390",
  appId: "1:909176117390:web:7eff1a08a51355496a11df",
  databaseURL: "https://las-hermanas-e26ff-default-rtdb.firebaseio.com/",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

// Auth con persistencia en React Native (guarda sesión entre aperturas)
let _auth;
try {
  _auth = initializeAuth(app, { persistence: getReactNativePersistence(AsyncStorage) });
} catch {
  _auth = getAuth(app); // hot reload
}
export const auth = _auth;

// DB con URL explícita (evita errores de parseo)
export const db = getDatabase(app, firebaseConfig.databaseURL);
