import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Dimensions,
  Platform,
  Pressable,
  StatusBar,
  Alert,
  Keyboard,
} from "react-native";
import { useTheme, Text, Button, TextInput } from "react-native-paper";
import Svg, { G, Path, SvgXml } from "react-native-svg";
import { Constants } from "react-native-unimodules";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import Toast from "react-native-simple-toast";

import bglayer from "../../assets/bglayer.svg";

import { Props } from "./types";
import { CustomButton, LoadingIndicator, MyText } from "../../components";
import { forgotPassword } from "../../services";
import SimpleToast from "react-native-simple-toast";
import { heightToDp, validateEmail, widthToDp } from "../../utils";

const { width, height } = Dimensions.get("window");

const ForgotPassword = ({ navigation }: Props) => {
  const theme = useTheme();
  const [emailInput, setEmail] = useState("");
  const [isLoading, setIsloading] = useState(false);

  const ForgotPassword = async () => {
    const error = validateEmail(emailInput);
    if (error) return SimpleToast.show(error);
    setIsloading(true);
    const response = await forgotPassword({ email: emailInput.toLowerCase() });
    console.log(response);
    if (response.error) {
      SimpleToast.show(response.error, SimpleToast.SHORT);
      setIsloading(false);
    }
    if (response.message) {
      SimpleToast.show(response.message, SimpleToast.SHORT);
      setIsloading(false);
    }
    setIsloading(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <StatusBar
        backgroundColor="transparent"
        translucent
        barStyle="dark-content"
      />
      <LoadingIndicator isVisible={isLoading} title={""} />
      <Pressable
        style={{
          paddingLeft: 20,
          position: "absolute",
          top: Platform.OS === "android" ? Constants.statusBarHeight + 20 : 10,
          zIndex: 9999999,
        }}
        onPress={() => navigation.goBack()}
      >
        <MaterialIcons name="arrow-back" size={28} />
      </Pressable>
      <SvgXml xml={bglayer} width={width} style={styles.bgLayer} />

      <View
        style={{ flex: 1, marginHorizontal: 52, marginTop: heightToDp("14%") }}
      >
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          onChangeText={(email) => setEmail(email)}
          value={emailInput}
        />
        <View style={{ alignItems: "center" }}>
          <CustomButton
            onPress={() => ForgotPassword()}
            title="Send"
            loading={false}
            disabled={false}
          />
        </View>
      </View>
    </View>
  );
};

export default ForgotPassword;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgLayer: {
    position: "absolute",
    top:
      Platform.OS === "android"
        ? -width * 0.99 + Constants.statusBarHeight
        : -width * 0.95,
  },
});
