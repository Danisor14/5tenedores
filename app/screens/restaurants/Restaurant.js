//rnfs sniper
import React, { useState, useEffect, useCallback, useRef } from "react";
import { StyleSheet, Text, View, ScrollView, Dimensions } from "react-native";
import { Rating, ListItem, Icon } from "react-native-elements";
import Toast from "react-native-easy-toast";
import { useFocusEffect } from "@react-navigation/native";
import { map } from "lodash";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/firestore";
import Loading from "../../components/Loading";
import CarouselImage from "../../components/Carousel";
import Map from "../../components/Map";
import ListReview from "../../components/restaurants/ListReviews";

const db = firebase.firestore(firebaseApp);
const screenWidth = Dimensions.get("window").width;

export default function Restaurant(props) {
  const { navigation, route } = props;
  const { id, name } = route.params;
  const [restaurant, setRestaurant] = useState(null);
  const [raiting, setRaiting] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [userLogued, setUserLogued] = useState(false);
  const toastRef = useRef();

  firebase.auth().onAuthStateChanged((user) => {
    user ? setUserLogued(true) : setUserLogued(false);
  });

  useFocusEffect(
    useCallback(() => {
      db.collection("restaurants")
        .doc(id)
        .get()
        .then((response) => {
          const data = response.data();
          data.id = response.id;
          setRestaurant(data);
          setRaiting(data.rating);
        });
    }, [])
  );
  navigation.setOptions({ title: name });

  useEffect(() => {
    if (userLogued && restaurant) {
      db.collection("favorites")
        .where("idRestaurant", "==", restaurant.id)
        .where("idUser", "==", firebase.auth().currentUser.uid)
        .get()
        .then((response) => {
          if (response.docs.length === 1) {
            setIsFavorite(true);
            console.log(response.docs.length);
          }
        });
    }
  }, [userLogued, restaurant]);

  const addFavorite = () => {
    if (!userLogued) {
      toastRef.current.show(
        "para usar el sistema favoritos tiene que estar logeado"
      );
    } else {
      const payload = {
        idUser: firebase.auth().currentUser.uid,
        idRestaurant: restaurant.id,
      };
      db.collection("favorites")
        .add(payload)
        .then(() => {
          setIsFavorite(true);
          toastRef.current.show("Restaurante añadido a facoritos");
        })
        .catch(() => {
          toastRef.current.show("Error al añadir el restaurante a favoritos");
        });
    }
  };

  const removeFavorite = () => {
    db.collection("favorites")
      .where("idRestaurant", "==", restaurant.id)
      .where("idUser", "==", firebase.auth().currentUser.uid)
      .get()
      .then((response) => {
        response.forEach((doc) => {
          const idFavorite = doc.id;
          db.collection("favorites")
            .doc(idFavorite)
            .delete()
            .then(() => {
              setIsFavorite(false);
              toastRef.current.show("Restaurante eliminado de favoritos");
            })
            .catch(() => {
              toastRef.current.show("Error al elminar de favoritos");
            });
        });
      });
  };

  if (!restaurant) return <Loading visible={true} text="Cargando..." />;

  return (
    <ScrollView vertical style={styles.viewBody}>
      <View style={styles.viewFavorites}>
        <Icon
          type="material-community"
          name={isFavorite ? "heart" : "heart-outline"}
          onPress={isFavorite ? removeFavorite : addFavorite}
          color={isFavorite ? "#f00" : "#000"}
          size={35}
          underlayColor="transparent"
        />
      </View>
      <CarouselImage
        arrayImages={restaurant.image}
        height={250}
        width={screenWidth}
      />

      <TitleRestaurant
        name={restaurant.name}
        description={restaurant.description}
        raiting={raiting}
      />

      <RestaurantInfo
        name={restaurant.name}
        address={restaurant.address}
        location={restaurant.location}
      />

      <ListReview navigation={navigation} idRestaurant={restaurant.id} />
      <Toast ref={toastRef} position={"center"} opacity={0.9} />
    </ScrollView>
  );
}

function TitleRestaurant(props) {
  const { name, description, raiting } = props;
  return (
    <View style={styles.viewRestaurantTitle}>
      <View style={{ flexDirection: "row" }}>
        <Text style={styles.nameRestaurant}>{name}</Text>
        <Rating
          style={styles.rating}
          imageSize={20}
          readonly
          startingValue={parseFloat(raiting)}
        />
      </View>
      <View>
        <Text style={styles.descriptionRestaurant}>{description}</Text>
      </View>
    </View>
  );
}

function RestaurantInfo(props) {
  const { name, location, address } = props;

  const listInfo = [
    {
      text: address,
      iconName: "map-marker",
      iconType: "material-community",
      action: null,
    },
    {
      text: "3005121234",
      iconName: "phone",
      iconType: "material-community",
      action: null,
    },
    {
      text: "danisor1412@gmail.com",
      iconName: "at",
      iconType: "material-community",
      action: null,
    },
  ];

  return (
    <View style={styles.viewRestaurantInfo}>
      <Text style={styles.restauranInfoTitle}>
        Informacion sobre el restaurante
      </Text>
      <Map location={location} name={name} height={100} />
      {map(listInfo, (item, index) => (
        <ListItem
          key={index}
          title={item.text}
          leftIcon={{
            name: item.iconName,
            type: item.iconType,
            color: "#00a680",
          }}
          containerStyle={styles.containerListItem}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  viewBody: {
    flex: 1,
    backgroundColor: "#fff",
  },
  viewRestaurantTitle: {
    padding: 15,
  },
  nameRestaurant: {
    fontSize: 20,
    fontWeight: "bold",
  },
  descriptionRestaurant: {
    marginTop: 10,
    color: "grey",
  },
  rating: {
    position: "absolute",
    right: 0,
  },
  viewRestaurantInfo: {
    margin: 15,
    marginTop: 25,
  },
  restauranInfoTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  containerListItem: {
    borderBottomColor: "#d8d8d8",
    borderBottomWidth: 1,
  },
  viewFavorites: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 2,
    backgroundColor: "#fff",
    borderBottomLeftRadius: 100,
    paddingTop: 5,
    paddingLeft: 15,
  },
});
