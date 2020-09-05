import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Acount from "../screens/acount/Account";
import Login from "../screens/acount/Login";
import Register from "../screens/acount/Register";

const Stack = createStackNavigator();

export default function AcountStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="acount"
        component={Acount}
        options={{ title: "Cuenta" }}
      />
      <Stack.Screen
        name="login"
        component={Login}
        options={{ title: "Iniciar sesión" }}
      />
      <Stack.Screen
        name="register"
        component={Register}
        options={{ title: "Registro" }}
      />
    </Stack.Navigator>
  );
}
