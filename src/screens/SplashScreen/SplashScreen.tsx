import React, { useEffect } from "react";
import {
  StyleSheet,
  View,
  SafeAreaView,
  Dimensions,
  StatusBar,
} from "react-native";
import { useTheme, ActivityIndicator, Text } from "react-native-paper";
import Animated, {
  timing,
  Easing,
  interpolate,
  Extrapolate,
} from "react-native-reanimated";
import AntDesign from "react-native-vector-icons/AntDesign";

import { Props } from "./types";
import { Logo, MyText } from "../../components";
import AsyncStorage from "@react-native-community/async-storage";

const { width, height } = Dimensions.get("window");

//TODO: Use native splash screen
const MySplashScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const translateY = new Animated.Value(200);

  useEffect(() => {
    checkIsAuthenticated();
    timing(translateY, {
      duration: 600,
      easing: Easing.bounce,
      toValue: 0,
    }).start();
  }, []);

  const opacity = interpolate(translateY, {
    inputRange: [0, 100, 200],
    outputRange: [1, 0.5, 0],
    extrapolate: Extrapolate.CLAMP,
  });

  const checkIsAuthenticated = async () => {
    try {
      const isSkippedAuth = await AsyncStorage.getItem("skippedAuth");
      const token = await AsyncStorage.getItem("token");
      if (token || JSON.parse(isSkippedAuth)) {
        let clearInterval1 = setTimeout(() => {
          navigation.replace("Home");
        }, 2000);
      } else {
        let clearInterval2 = setTimeout(() => {
          navigation.replace("LoginScreen");
        }, 2000);
      }
    } catch (error) {
      console.log("error in SplashScreen ", error);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.primary }]}
    >
      <StatusBar
        translucent
        barStyle="dark-content"
        backgroundColor="transparent"
      />
      <View style={styles.brand}>
        <Logo />
        <Animated.View
          style={{ transform: [{ translateY: translateY }], opacity }}
        >
          <MyText
            pt={20}
            text="cubbard"
            color="#FFFFFF"
            ff="Ubuntu-Bold"
            size={40}
          />
        </Animated.View>
      </View>
      <ActivityIndicator
        style={{ justifyContent: "center", alignItems: "center", flex: 1 }}
        color={theme.colors.accent}
      />
      <View></View>
    </SafeAreaView>
  );
};

export default MySplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
  brand: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: height * 0.1,
  },
});
