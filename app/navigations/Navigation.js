import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Icon } from "react-native-elements";
import { Drawer } from "react-native-paper";
import RestaurantsStack from "./RestaurantsStack";
import FavoritesStack from "./FavoritesStack";
import TopRestaurantStack from "./TopRestaurantStack";
import SearchStack from "./SearchStack";
import AcountStack from "./AcountStack";
import PruebaStack from "./PruebaStack";

const Tab = createBottomTabNavigator();

export default function Navigation() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName={"restaurants"}
        tabBarOptions={{
          // tiene un objeto con diversas propiedades
          inactiveTintColor: "#646464",
          activeTintColor: "#00a680",
        }}
        // en screenOptions se pasa un objeto con diferentes opciones que aplica a todos los screens en el Navigator, nos da una funcion con la ruta(route)
        screenOptions={({ route }) => ({
          // tabBarIcon es un prop de options en screens returna un ReactNode para ejecutarse en el tab bar en este caso se pasa <Icon> nos da una funcion con focused: boolean, color: string, size: number
          tabBarIcon: ({ color, focused }) =>
            screenOptions(route, color, focused),
        })}
      >
        <Tab.Screen
          name="restaurants"
          component={RestaurantsStack}
          options={{ title: "Restaurantes" }}
        />

        <Tab.Screen
          name="favorites"
          component={FavoritesStack}
          options={{ title: "Favorito" }}
        />

        <Tab.Screen
          name="top-restaurants"
          component={TopRestaurantStack}
          options={{ title: "Top 5" }}
        />

        <Tab.Screen
          name="search"
          component={SearchStack}
          options={{ title: "Buscador" }}
        />

        <Tab.Screen
          name="acount"
          component={AcountStack}
          options={{ title: "Cuenta" }}
        />

        <Tab.Screen
          name="prueba"
          component={PruebaStack}
          options={{ title: "prueba" }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function screenOptions(route, color, focosed) {
  let iconName;

  switch (route.name) {
    case "restaurants":
      iconName = "compass-outline";
      break;
    case "favorites":
      iconName = "heart-outline";
      break;
    case "top-restaurants":
      iconName = "star-outline";
      break;
    case "search":
      iconName = "magnify";
      break;
    case "acount":
      iconName = "home-outline";
      break;
    /*case "prueba":
      iconName = require("../../assets/img/boda.svg");
      break;*/
    default:
      break;
  }
  return (
    <Icon type="material-community" name={iconName} size={22} color={color} />
  );
}
