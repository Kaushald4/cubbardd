import AsyncStorage from "@react-native-community/async-storage";
import { useNavigation } from "@react-navigation/native";
import React from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import { useTheme } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { signout } from "../../services";

const { fontScale } = Dimensions.get("window");

const Appbar = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => {}} style={{ position: "relative" }}>
        <FontAwesome
          name="user-circle-o"
          size={24 / fontScale}
          style={{ paddingHorizontal: 20 }}
          color={theme.colors.accent}
        />
        <View style={{ position: "absolute" }}></View>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          signout(navigation);
        }}
      >
        <FontAwesome
          name="sign-in"
          size={24 / fontScale}
          color={theme.colors.accent}
        />
      </TouchableOpacity>
    </View>
  );
};

export default Appbar;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingTop: Platform.OS === "android" ? 30 : 20,
    paddingHorizontal: 30,
  },
});
