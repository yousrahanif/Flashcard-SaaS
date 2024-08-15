// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
import {getAnalytics} from 'firebase/analytics'
import {getFirestore} from 'firebase/firestore'
const firebaseConfig = {
  apiKey: "AIzaSyCc8iS2NVPex4n0BNYobvaz1W4TK1pVRMc",
  authDomain: "fir-practice-project-89925.firebaseapp.com",
  projectId: "fir-practice-project-89925",
  storageBucket: "fir-practice-project-89925.appspot.com",
  messagingSenderId: "170620114237",
  appId: "1:170620114237:web:a46d3cc75449f403f32154"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db=getFirestore(app)
export{db}