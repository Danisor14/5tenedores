import React, { useState, useEffect } from "react";
import { View, StyleSheet, Alert, Dimensions, ScrollView } from "react-native";
import { Icon, Avatar, Image, Input, Button } from "react-native-elements";
import { map, size, filter } from "lodash";
import * as Permissions from "expo-permissions";
import * as ImagePicker from "expo-image-picker";
import * as Location from "expo-location";
import MapView from "react-native-maps";
import uuid from "random-uuid-v4";
import Modal from "../Modal";
import { firebaseApp } from "../../utils/firebase";
import firebase from "firebase/app";
import "firebase/storage";
import "firebase/firestore";

const db = firebase.firestore(firebaseApp);

const widthScreen = Dimensions.get("window").width;

export default function AddRestaurantsForm(props) {
  const { toastRef, setIsLoading, navigation } = props;
  const [restaurantName, setRestaurantName] = useState("");
  const [restaurantAdress, setRestaurantAdress] = useState("");
  const [restaurantDescription, setRestaurantDescription] = useState("");
  const [imageSelected, setImageSelected] = useState([]);
  const [isVisibleMap, setIsVisibleMap] = useState(false);
  const [locationRestaurant, setLocationRestaurant] = useState(null);

  const addRestaurant = () => {
    if (!restaurantName || !restaurantAdress || !restaurantDescription) {
      toastRef.current.show("Todos los campos del formulario son obligatorios");
    } else if (size(imageSelected) === 0) {
      toastRef.current.show("El restaurante tiene que tener almenos una foto");
    } else if (!locationRestaurant) {
      toastRef.current.show("Tienes que localizar el restaurante en el mapa");
    } else {
      setIsLoading(true);
      uploadImageStore().then((response) => {
        db.collection("restaurants")
          .add({
            name: restaurantName,
            address: restaurantAdress,
            description: restaurantDescription,
            image: response,
            location: locationRestaurant,
            quantityVoting: 0,
            rating: 0,
            ratingTotal: 0,
            createAt: new Date(),
            createBy: firebase.auth().currentUser.uid,
          })
          .then(() => {
            setIsLoading(false);
            navigation.navigate("restaurants");
          })
          .catch(() => {
            setIsLoading(false);
            toastRef.current.show(
              "Error al subir el restaurante, itentelo mas tarde"
            );
          });
      });
    }
  };

  const uploadImageStore = async () => {
    const imageBlob = [];
    await Promise.all(
      map(imageSelected, async (image) => {
        const response = await fetch(image);
        const blop = await response.blob();
        const ref = firebase.storage().ref("restaurants").child(uuid());
        await ref.put(blop).then(async (result) => {
          await firebase
            .storage()
            .ref(`restaurants/${result.metadata.name}`)
            .getDownloadURL()
            .then((photoUrl) => imageBlob.push(photoUrl));
        });
      })
    );

    return imageBlob;
  };

  return (
    <ScrollView style={StyleSheet.scrollView}>
      <ImageRestaurant imageRestaurant={imageSelected[0]} />

      <FormAdd
        setRestaurantName={setRestaurantName}
        setRestaurantAdress={setRestaurantAdress}
        setRestaurantDescription={setRestaurantDescription}
        setIsVisibleMap={setIsVisibleMap}
        locationRestaurant={locationRestaurant}
      />

      <UploadImages
        toastRef={toastRef}
        imageSelected={imageSelected}
        setImageSelected={setImageSelected}
      />

      <Button
        title="Crear restaurante"
        onPress={addRestaurant}
        buttonStyle={styles.btnStyle}
        onPress={addRestaurant}
      />
      <Map
        isVisibleMap={isVisibleMap}
        setmap={setIsVisibleMap}
        setLocationRestaurant={setLocationRestaurant}
        toastRef={toastRef}
      />
    </ScrollView>
  );
}
function ImageRestaurant(props) {
  const { imageRestaurant } = props;
  return (
    <View style={styles.viewPhoto}>
      <Image
        source={
          imageRestaurant
            ? { uri: imageRestaurant }
            : require("../../../assets/img/photo.png")
        }
        style={{ width: widthScreen, height: 200 }}
      />
    </View>
  );
}

function FormAdd(props) {
  const {
    setRestaurantName,
    setRestaurantDescription,
    setRestaurantAdress,
    setIsVisibleMap,
    locationRestaurant,
  } = props;

  return (
    <View style={styles.viewForm}>
      <Input
        placeholder="Nombre del restaurante"
        containerStyle={styles.input}
        onChange={(e) => setRestaurantName(e.nativeEvent.text)}
      />
      <Input
        placeholder="Direccion"
        containerStyle={styles.input}
        onChange={(e) => setRestaurantAdress(e.nativeEvent.text)}
        rightIcon={{
          type: "material-community",
          name: "google-maps",
          color: locationRestaurant ? "#00a680" : "#c2c2c2",
          onPress: () => setIsVisibleMap(true),
        }}
      />

      <Input
        placeholder="Descripcion del restaurante"
        multiline={true}
        inputContainerStyle={styles.textArea}
        onChange={(e) => setRestaurantDescription(e.nativeEvent.text)}
      />
    </View>
  );
}

function Map(props) {
  const { isVisibleMap, setmap, setLocationRestaurant, toastRef } = props;
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      const resultPermissions = await Permissions.askAsync(
        Permissions.LOCATION
      );
      const statusPermission = resultPermissions.permissions.location.status;

      if (statusPermission !== "granted") {
        toastRef.current.show(
          "Tienes que aceptar los permision de localizacion para crear un restaurante",
          3000
        );
      } else {
        const loc = await Location.getCurrentPositionAsync({});
        //console.log(loc);
        setLocation({
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
          latitudeDelta: 0.001,
          longitudeDelta: 0.001,
        });
      }
    })();
  }, []);

  const confirmLocation = () => {
    setLocationRestaurant(location);
    //console.log(location);
    toastRef.current.show("Localizacion guardada correctamente");
    setmap(false);
  };

  return (
    <Modal isVisible={isVisibleMap} setIsVisible={setmap}>
      <View>
        {location && (
          <MapView
            style={styles.mapStyle}
            initialRegion={location}
            showsUserLocation={true}
            onRegionChange={(region) => setLocation(region)}
          >
            <MapView.Marker
              coordinate={{
                latitude: location.latitude,
                longitude: location.longitude,
              }}
              draggable
            />
          </MapView>
        )}
        <View style={styles.viewMapBtn}>
          <Button
            title={"Guardar Ubicacion"}
            containerStyle={styles.btnSave}
            buttonStyle={styles.btnSaveB}
            onPress={confirmLocation}
          />
          <Button
            title="Cancelar Ubicacion"
            containerStyle={styles.btnCancel}
            buttonStyle={styles.btnCancelB}
            onPress={() => setmap(false)}
          />
        </View>
      </View>
    </Modal>
  );
}

function UploadImages(props) {
  const { toastRef, imageSelected, setImageSelected } = props;
  const imageSelect = async () => {
    const resultPermissions = await Permissions.askAsync(
      Permissions.CAMERA_ROLL // dentro de askAsync se piden los permisos
    );
    if (resultPermissions === "denied") {
      toastRef.current.show(
        "tienes que aceptar los permisos fulero: ve a configuraciones ",
        3000
      );
    } else {
      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
      });

      if (result.cancelled) {
        toastRef.current.show(
          "Has cerrado la galeria sin seleccionar ninguna imagen",
          2000
        );
      } else {
        setImageSelected([...imageSelected, result.uri]); // ...imageSelected con esto se tienen el contenido actual de use state y con la coma agregamos el nuevo elemento del array osea result.uri
      }
    }
  };

  const removeImage = (image) => {
    Alert.alert(
      "Elminar Imagen", //titulo
      "¿Estas seguro de que quieres eliminar la imagen", // subtitulo
      [
        {
          text: "Cancel", // el cancelar
          style: "cancel",
        },
        {
          text: "Eliminar", // cuando acepta eliminar
          onPress: () => {
            setImageSelected(
              filter(imageSelected, (imageUrl) => imageUrl !== image)
            );
          },
        },
      ],
      { cancelable: false } // si cancela se cierra
    );
  };

  return (
    <View style={styles.viewImage}>
      {size(imageSelected) < 4 && (
        <Icon
          type="material-community"
          name="camera"
          color="#7a7a7a"
          containerStyle={styles.containerIcon}
          onPress={imageSelect}
        />
      )}
      {map(imageSelected, (imageRestaurant, index) => (
        <Avatar
          key={index}
          style={styles.miniatureStyle}
          source={{ uri: imageRestaurant }}
          onPress={() => removeImage(imageRestaurant)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    height: "100%",
  },
  viewForm: {
    marginLeft: 10,
    marginRight: 10,
  },
  input: {
    marginBottom: 10,
  },
  textArea: {
    height: 100,
    width: "100%",
    padding: 0,
    margin: 0,
  },
  btnStyle: {
    backgroundColor: "#00a680",
    margin: 20,
  },
  viewImage: {
    flexDirection: "row",
    marginLeft: 20,
    marginRight: 20,
    marginTop: 30,
  },
  containerIcon: {
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    height: 70,
    width: 70,
    backgroundColor: "#e3e3e3",
  },
  miniatureStyle: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  viewPhoto: {
    alignItems: "center",
    height: 200,
    marginBottom: 20,
  },
  mapStyle: {
    width: "100%",
    height: 550,
  },
  viewMapBtn: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  btnCancel: {
    paddingLeft: 5,
  },
  btnCancelB: {
    backgroundColor: "#a60d0b",
  },
  btnSave: {
    paddingRight: 5,
  },
  btnSaveB: {
    backgroundColor: "#00a680",
  },
});
