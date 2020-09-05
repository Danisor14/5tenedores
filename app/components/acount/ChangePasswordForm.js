import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Input } from "react-native-elements";
import { size } from "lodash";
import { reauthenticate } from "../../utils/api";
import * as firebase from "firebase";

export default function ChangePasswordForm(props) {
  const { password, setShowModal, toastRef } = props;
  const [showPassword, setShowPassword] = useState(false);
  //const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [formData, setFormData] = useState(defaultValue());
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = async () => {
    let isSetErrors = true;
    let errosTemp = {};
    setErrors({});
    if (
      !formData.password ||
      !formData.repeatPassword ||
      !formData.newPassword
    ) {
      errosTemp = {
        password: !formData.password
          ? "La contraseña no puede estar vacia"
          : "",
        repeatPassword: !formData.repeatPassword
          ? "La contraseña no puede estar vacia"
          : "",
        newPassword: !formData.newPassword
          ? "La contraseña no puede estar vacia"
          : "",
      };
      setErrors(errosTemp);
    } else if (formData.repeatPassword !== formData.newPassword) {
      errosTemp = {
        repeatPassword: "las contraseñas no son iguales",
        newPassword: "las contraseñas no son iguales",
      };
      setErrors(errosTemp);
    } else if (size(formData.newPassword) < 6) {
      errosTemp = {
        repeatPassword: "la contraseña tiene que ser mayor a 5 caracteres",
        newPassword: "la contraseña tiene que ser mayor a 5 caracteres",
      };
      setErrors(errosTemp);
    } else {
      setIsLoading(true);
      await reauthenticate(formData.password)
        .then(async () => {
          await firebase
            .auth()
            .currentUser.updatePassword(formData.newPassword)
            .then(() => {
              isSetErrors = false;
              setIsLoading(false);
              setShowModal(false);
              firebase.auth().signOut();
            })
            .catch(() => {
              errosTemp = {
                other: "Error al actualizar la contraseña",
              };
              setIsLoading(false);
            });
        })
        .catch(() => {
          setIsLoading(false);
          errosTemp = { password: "La contraseña no es correcta" };
        });
    }

    isSetErrors && setErrors(errosTemp);
  };

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  return (
    <View style={style.view}>
      <Input
        placeholder="Contraseña actual"
        containerStyle={style.input}
        secureTextEntry={showPassword ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setShowPassword(!showPassword),
        }}
        onChange={(e) => onChange(e, "password")}
        errorMessage={errors.password}
      />

      <Input
        placeholder="Nueva Contraseña"
        containerStyle={style.input}
        secureTextEntry={showPassword ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setShowPassword(!showPassword),
        }}
        onChange={(e) => onChange(e, "newPassword")}
        errorMessage={errors.newPassword}
      />

      <Input
        placeholder="Repetir Contraseña"
        containerStyle={style.input}
        secureTextEntry={showPassword ? false : true}
        rightIcon={{
          type: "material-community",
          name: showPassword ? "eye-outline" : "eye-off-outline",
          color: "#c2c2c2",
          onPress: () => setShowPassword(!showPassword),
        }}
        onChange={(e) => onChange(e, "repeatPassword")}
        errorMessage={errors.repeatPassword}
      />

      <Button
        title="Actualizar Contraseña"
        containerStyle={style.btnContainerStyle}
        buttonStyle={style.btn}
        onPress={() => onSubmit()}
        loading={isLoading}
      />
      <Text>{errors.other}</Text>
    </View>
  );
}

function defaultValue() {
  return { password: "", repeatPassword: "", newPassword: "" };
}

const style = StyleSheet.create({
  view: {
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
  },
  input: {
    marginBottom: 10,
  },
  btnContainerStyle: {
    marginTop: 20,
    width: "95%",
  },
  btn: {
    backgroundColor: "#00a680",
  },
});
