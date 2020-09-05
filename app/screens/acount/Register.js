import React, { useRef } from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-easy-toast";
import RegisterForm from "../../components/acount/RegisterForm";

export default function Register() {
  //se usa el hook useRef para crear una referencia
  const toastRef = useRef();
  return (
    // permite ver el formulario cuando sale el teclado del cel
    <KeyboardAwareScrollView>
      <Image
        source={require("../../../assets/img/logo-login.png")}
        resizeMode="contain"
        style={styles.image}
      />
      <Toast ref={toastRef} position="center" opacity={0.9} />
      <View style={styles.viewForm}>
        <RegisterForm toastRef={toastRef} />
      </View>
    </KeyboardAwareScrollView>
  );
}

const styles = StyleSheet.create({
  image: {
    width: "100%",
    height: 150,
    marginTop: 20,
  },
  viewForm: {
    marginRight: 40,
    marginLeft: 40,
  },
});
