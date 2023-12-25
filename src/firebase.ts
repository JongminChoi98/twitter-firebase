import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDUou4EOyXRi2R1BCXnnNMGbGq6y8MbFJU",
  authDomain: "twitter-firebase-cfefe.firebaseapp.com",
  projectId: "twitter-firebase-cfefe",
  storageBucket: "twitter-firebase-cfefe.appspot.com",
  messagingSenderId: "502683019142",
  appId: "1:502683019142:web:dfe0775c848a93b121ee07",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const storage = getStorage(app);

export const db = getFirestore(app);
