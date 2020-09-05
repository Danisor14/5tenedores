import React, { useEffect, useState } from "react";
//import { NavigationContainer } from "@react-navigation/native";
import { YellowBox } from "react-native";
import { firebaseApp } from "./app/utils/firebase";
import Navigation from "./app/navigations/Navigation";
import { decode, encode } from "base-64";

//import * as firebase from "firebase";
YellowBox.ignoreWarnings(["Setting a timer"]);

if (!global.btoa) global.btoa = encode;
if (!global.atob) global.atob = decode;

export default function App() {
  const [quePongo, setQuePongo] = useState(true);
  /* comprobar q haiga coneccion con firebase
  useEffect(() => {
    firebase.auth().onAuthStateChanged((user) => {
      console.log(user);
    });
  }, []);
*/
  return <Navigation />;
}
