import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Restaurants from "../screens/restaurants/Restaurants";
import AddRestaurants from "../screens/restaurants/AddRestaurants";
import Restaurant from "../screens/restaurants/Restaurant";
import AddNewRestaurant from "../screens/restaurants/AddNewRestaurant";

const Stack = createStackNavigator();

export default function RestaurantsStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="restaurants"
        component={Restaurants}
        options={{ title: "Restaurantes" }}
      />

      <Stack.Screen
        name="add-restaurants"
        component={AddRestaurants}
        options={{ title: "Añadir nuevo restaurante" }}
      />

      <Stack.Screen name="restaurant" component={Restaurant} />

      <Stack.Screen
        name="add-review-restaurant"
        component={AddNewRestaurant}
        options={{ title: "Nuevo Comentario" }}
      />
    </Stack.Navigator>
  );
}
