import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyD6IhM6_LlrEb78KEimqi_AJx-BzXc9RT4",
  authDomain: "emote-website-ce46c.firebaseapp.com",
  databaseURL: "https://emote-website-ce46c-default-rtdb.firebaseio.com",
  projectId: "emote-website-ce46c",
  storageBucket: "emote-website-ce46c.firebasestorage.app",
  messagingSenderId: "817164342454",
  appId: "1:817164342454:web:34bac5b588153dd8250217",
  measurementId: "G-0E17GVSVBX"
};

const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);