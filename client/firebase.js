// Import the functions you need from the SDKs you need
import { initializeApp, getApps } from "firebase/app";
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCjI0XUTU8BeKxdLMa_N9JFYP6nZZSCDfA",
  authDomain: "hfchoice-96de6.firebaseapp.com",
  projectId: "hfchoice-96de6",
  storageBucket: "hfchoice-96de6.firebasestorage.app",
  messagingSenderId: "854775329221",
  appId: "1:854775329221:web:7bff810199b4869ccedbac",
  measurementId: "G-R3GTSPPEZ6"
};

// Initialize Firebase

let app;
if (getApps().length === 0) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApps()[0];
}

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };