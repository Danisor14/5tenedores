import React, { useRef } from "react";
import { StyleSheet, View, ScrollView, Text, Image } from "react-native";
import { Divider, SocialIcon } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import Toast from "react-native-easy-toast";
import LoginForm from "../../components/acount/LoginForm";

export default function Login() {
  const navigation = useNavigation();
  const toastReft = useRef();
  return (
    <ScrollView>
      <Image
        source={require("../../../assets/img/logo-login.png")}
        resizeMode="contain"
        style={styles.logo}
      />
      <View style={styles.viewContainer}>
        <LoginForm toastReft={toastReft} />
        <CreateAcount />
      </View>
      <Divider style={styles.divider} />
      <Text>Social login</Text>
      <SocialIcon
        style={styles.facebook}
        title="Registrate con Facebook"
        type="facebook"
        button
      />
      <Toast ref={toastReft} position="center" opacity={0.9} />
    </ScrollView>
  );
}

function CreateAcount() {
  const navigation = useNavigation();
  return (
    <Text style={styles.textRegister}>
      ¿Aun no tinenes una cuenta?{" "}
      <Text
        style={styles.btnRegister}
        onPress={() => navigation.navigate("register")}
      >
        Registrate
      </Text>
    </Text>
  );
}

const styles = StyleSheet.create({
  logo: {
    width: "100%",
    height: 150,
    marginTop: 20,
  },
  viewContainer: {
    marginRight: 40,
    marginLeft: 40,
  },
  textRegister: {
    marginTop: 15,
    marginLeft: 10,
    marginRight: 10,
  },
  btnRegister: {
    color: "#00a680",
    fontWeight: "bold",
  },
  divider: {
    backgroundColor: "#00a860",
    margin: 40,
  },
  facebook: {
    marginLeft: 40,
    marginRight: 40,
    borderRadius: 0,
  },
});
