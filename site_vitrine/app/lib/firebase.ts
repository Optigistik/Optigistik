import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCdHc1GJbz0wJ26TC6Pc64WHy-8z9Rss_c",
    authDomain: "optigistik-vitrine.firebaseapp.com",
    projectId: "optigistik-vitrine",
    storageBucket: "optigistik-vitrine.firebasestorage.app",
    messagingSenderId: "511608057140",
    appId: "1:511608057140:web:68e5c7698f7d73d068c961"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
