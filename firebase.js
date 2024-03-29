// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth'; 

const firebaseConfig = {
    apiKey: 'AIzaSyDSeQ693WbMrzaqDop6COw3ydFQE7d3Qck',
    authDomain: 'quarry365.firebaseapp.com',
    projectId: 'quarry365',
    storageBucket: 'quarry365.appspot.com',
    messagingSenderId: '1069474208952',
    appId: '1:1069474208952:android:572559495c8c30a2c4284d',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app); // Initialize authentication

export { app, db, auth };
