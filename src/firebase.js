// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCAbRdrUKQ-_gHZB8J_eki8hu5IWS1GXoc",
    authDomain: "itusupportpage.firebaseapp.com",
    projectId: "itusupportpage",
    storageBucket: "itusupportpage.appspot.com",
    messagingSenderId: "762460046141",
    appId: "1:762460046141:web:2174624d7bf49772ff7b54",
    measurementId: "G-GYZ9FZXZ57"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
const auth = getAuth(app);
const googleAuthProvider = new GoogleAuthProvider();

export { app, auth, googleAuthProvider };
