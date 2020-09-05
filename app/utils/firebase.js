import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyDxN_5y3AOYFw48Db4au8vyA9exl9m5DsU",
  authDomain: "tenedores-c2a77.firebaseapp.com",
  databaseURL: "https://tenedores-c2a77.firebaseio.com",
  projectId: "tenedores-c2a77",
  storageBucket: "tenedores-c2a77.appspot.com",
  messagingSenderId: "77998150888",
  appId: "1:77998150888:web:84d748641d7b2a93cea55d",
};

export const firebaseApp = firebase.initializeApp(firebaseConfig);
