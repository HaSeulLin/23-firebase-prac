// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


// 인증을 위한 getAuth 가져옴
import { getAuth } from 'firebase/auth'
import { getFirestore } from 'firebase/firestore'


// Your web app's Firebase configuration
const firebaseConfig = {
    
    // 본인의 key값
  apiKey: process.env.REACT_APP_FIREBASE_APIKEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH,
  projectId: "ex-firebase-f436e",
  storageBucket: "ex-firebase-f436e.appspot.com",
  messagingSenderId: "121242899919",
  appId: "1:121242899919:web:bd4a01a52e1152d148eeba"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


// 사용하고자 하는 서비스를 들고 와서 사용
// 인증서비스에 관한 내용 들고와 사용
export const auth = getAuth(app);
export const db = getFirestore(app);