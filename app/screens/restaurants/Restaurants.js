import React, { useState, useEffect, useCallback } from "react";
import { StyleSheet, View, Text, Dimensions } from "react-native";
import { Icon } from "react-native-elements";
import { useFocusEffect } from "@react-navigation/native";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import ListRestaurants from "../../components/restaurants/ListRestaurants";

const db = firebase.firestore(firebaseApp);

const paraelbotnplus = Dimensions.get("window").height - 130;
//console.log(paraelbotnplus);

export default function Restaurants(props) {
  const { navigation } = props;
  const [user, setUser] = useState(null);
  const [restaurants, setRestaurants] = useState([]);
  const [totalRestaurants, settotalRestaurants] = useState(0);
  const [startRestaurants, setStartRestaurant] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const limitRestaurants = 10;

  //console.log(restaurants);

  useEffect(() => {
    firebase.auth().onAuthStateChanged((userInfo) => {
      setUser(userInfo);
    });
  }, []);

  useFocusEffect(
    // este hook hace que se vuelva a ejecutar el codigo adentro cuando se hace focus al componente que lo esta usando en este caso la screen restaurant
    useCallback(() => {
      db.collection("restaurants")
        .get()
        .then((snap) => {
          settotalRestaurants(snap.size);
        });

      const resultRestaurants = [];

      db.collection("restaurants")
        .orderBy("createAt", "desc")
        .limit(limitRestaurants)
        .get()
        .then((response) => {
          setStartRestaurant(response.docs[response.docs.length - 1]);

          response.forEach((doc) => {
            const restaurant = doc.data();
            restaurant.id = doc.id;
            //console.log(restaurant);
            resultRestaurants.push(restaurant);
          });

          setRestaurants(resultRestaurants);
        });
    }, [])
  );

  const handleLoadMore = () => {
    const resultRestaurants = [];
    restaurants.length < totalRestaurants && setIsLoading(true);
    db.collection("restaurants")
      .orderBy("createAt", "desc")
      .startAfter(startRestaurants.data().createAt)
      .limit(limitRestaurants)
      .get()
      .then((response) => {
        if (response.docs.length > 0) {
          setStartRestaurant(response.docs[response.docs.length - 1]);
        } else {
          setIsLoading(false);
        }

        response.forEach((doc) => {
          const restaurant = doc.data();
          restaurant.id = doc.id;
          resultRestaurants.push(restaurant);
        });

        setRestaurants([...restaurants, ...resultRestaurants]);
      });
  };

  return (
    <View style={StyleSheet.viewBody}>
      <ListRestaurants
        restaurants={restaurants}
        handleLoadMore={handleLoadMore}
        isLoading={isLoading}
      />
      {user && (
        <Icon
          reverse
          type="material-community"
          name="plus"
          color="#00a680"
          containerStyle={styles.btncontainer}
          onPress={() => navigation.navigate("add-restaurants")}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
  },
  btncontainer: {
    position: "absolute",
    top: paraelbotnplus,
    right: 10,
    shadowColor: "black",
    shadowOffset: { width: 2, height: 2 }, // en elwidth positco es para que la sombra salga  a la derecha negativo para la izquierda | en el height positivo abajo negativo arriba
    shadowOpacity: 0.5,
  },
});
