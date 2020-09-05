import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Button, Input } from "react-native-elements";
import * as firebase from "firebase";
import { validateEmail } from "../../utils/validations";
import { reauthenticate } from "../../utils/api";

export default function ChangeEmailForm(props) {
  const { email, setShowModal, setReloadUserInfo, toastRef } = props;
  const [formData, setFormData] = useState(datosDefault());
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit = () => {
    setErrors({});
    if (!formData.email || email === formData.email) {
      setErrors({ email: "El email no ah cambiado" });
    } else if (!validateEmail(formData.email)) {
      setErrors({ email: "Email incorrecto" });
    } else if (!formData.password) {
      setErrors({ password: "La contraseña no puede estar vacia" });
    } else {
      setIsLoading(true);
      reauthenticate(formData.password)
        .then(() => {
          firebase
            .auth()
            .currentUser.updateEmail(formData.email)
            .then(() => {
              setIsLoading(false);
              setReloadUserInfo(true);
              toastRef.current.show("Email actualizado correctamente");
              setShowModal(false);
            })
            .catch((e) => {
              setErrors({ email: "Error al actualizar el email." });
              setIsLoading(false);
              console.log(e);
            });
        })
        .catch(() => {
          setErrors({ password: "la contraseña es incorrecta" });
          setIsLoading(false);
        });
    }
  };

  const onChange = (e, type) => {
    setFormData({ ...formData, [type]: e.nativeEvent.text });
  };

  return (
    <View style={style.view}>
      <Input
        placeholder="Correo electronico"
        containerStyle={style.input}
        defaultValue={email || ""}
        rightIcon={{
          type: "material-community",
          name: "at",
          color: "#c2c2c2",
        }}
        onChange={(e) => onChange(e, "email")}
        errorMessage={errors.email}
      />

      <Input
        placeholder="Contraseña"
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

      <Button
        title="Actualizar email"
        containerStyle={style.btnContainerStyle}
        buttonStyle={style.btn}
        onPress={() => onSubmit()}
        loading={isLoading}
      />
    </View>
  );
}

function datosDefault() {
  return { email: "", password: "" };
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
