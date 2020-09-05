import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Prueba from "../screens/Prueba";
import { Icon } from "react-native-elements";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Drawner from "./Drawner";

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();
export default function PruebaStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="prueba"
        component={Prueba}
        options={{
          title: "Prueba para aprender",
          headerLeft: () => (
            <Icon
              containerStyle={{ marginLeft: 18 }}
              name="at"
              type="material-community"
              onPress={() => {
                <Drawer.Navigator>
                  <Drawer.Screen name="hagale" component={Drawner} />
                </Drawer.Navigator>;
              }}
            />
          ),
        }}
      />
    </Stack.Navigator>
  );
}
