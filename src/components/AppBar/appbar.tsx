import AsyncStorage from "@react-native-community/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  Alert,
  Keyboard,
} from "react-native";
import { Menu, useTheme } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MyText from "../MyText/MyText";
import { signout } from "../../services";
import { heightToDp, widthToDp } from "../../utils";
import { Constants } from "react-native-unimodules";

const { fontScale } = Dimensions.get("window");

const Appbar = ({
  isMenuShown,
  setMenuVisible,
}: {
  isMenuShown: boolean;
  setMenuVisible: (b: boolean) => void;
}) => {
  const theme = useTheme();
  const navigation = useNavigation();
  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    const unsubscribe = navigation.addListener("state", () => {
      // setMenuVisible(false);
    });

    checkIsAuthenticated();

    return unsubscribe;
  }, [navigation]);

  const checkIsAuthenticated = async () => {
    try {
      const authData = await AsyncStorage.getItem("token");
      if (authData) {
        const { token, id } = JSON.parse(authData);
        if (id && token) {
          setIsUser(true);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          setMenuVisible(!isMenuShown);
        }}
        style={{ position: "relative" }}
      >
        <FontAwesome
          name="user-circle-o"
          size={24 / fontScale}
          style={{ paddingHorizontal: 20 }}
          color={theme.colors.accent}
        />
      </TouchableOpacity>
      {isMenuShown && (
        <View
          style={{
            position: "absolute",
            // height: heightToDp("10.8%"),
            width: widthToDp("40%"),
            backgroundColor: "#FFFFFF",
            top:
              Platform.OS === "android"
                ? heightToDp("4%") + Constants.statusBarHeight
                : heightToDp("5.8%"),
            right: 80,
            elevation: 20,
            shadowColor: "rgba(0,0,0,.4)",
            shadowOpacity: 1,
            shadowOffset: { height: 0, width: 0 },
            shadowRadius: 2,
            borderRadius: 5,
          }}
        >
          {!isUser && (
            <Menu.Item
              onPress={() => {
                navigation.navigate("SignUpScreen");
              }}
              title={
                <MyText
                  text="Create Profile"
                  size={widthToDp("3.4%")}
                  color="#000000"
                />
              }
            />
          )}
          <Menu.Item
            onPress={() => {
              Alert.alert("Updating Soon....");
            }}
            title={
              <MyText
                text="Terms & Conditions"
                size={widthToDp("3.4%")}
                color="#000000"
              />
            }
          />
        </View>
      )}
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
    position: "relative",
  },
});
