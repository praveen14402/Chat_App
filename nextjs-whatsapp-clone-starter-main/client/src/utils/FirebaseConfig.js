import { initializeApp } from "firebase/app";
import {getAuth} from "firebase/auth";

const firebaseConfig = {
    apiKey: "AIzaSyCKZxVYYWfjRob3Lfok77mytO_A0eUYs0E",
    authDomain: "whatsapp-clone-ac9e3.firebaseapp.com",
    projectId: "whatsapp-clone-ac9e3",
    storageBucket: "whatsapp-clone-ac9e3.appspot.com",
    messagingSenderId: "1042211100280",
    appId: "1:1042211100280:web:43cd4a46829ec63679bf8d",
    measurementId: "G-HH3MFXGE4D"
  };


  const app = initializeApp(firebaseConfig);
  export const firebaseAuth = getAuth(app);