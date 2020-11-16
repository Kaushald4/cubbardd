import AsyncStorage from "@react-native-community/async-storage";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  Alert,
  Linking,
} from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { useTheme } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MyText from "../MyText/MyText";
import { signout } from "../../services";
import { heightToDp, widthToDp } from "../../utils";
import { Constants } from "react-native-unimodules";
import SimpleToast from "react-native-simple-toast";
import { WebView } from "react-native-webview";

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
      <Menu>
        <MenuTrigger>
          <FontAwesome
            name="user-circle-o"
            size={24 / fontScale}
            style={{ paddingHorizontal: 20 }}
            color={theme.colors.accent}
          />
        </MenuTrigger>
        <MenuOptions
          customStyles={{
            optionWrapper: { paddingVertical: 10, marginHorizontal: 10 },
          }}
        >
          {!isUser && (
            <MenuOption onSelect={() => navigation.navigate("SignUpScreen")}>
              <MyText
                text="Create Profile"
                color="#000000"
                size={widthToDp("3.4%")}
              />
            </MenuOption>
          )}
          <MenuOption
            onSelect={() => {
              Linking.openURL(
                "https://www.iubenda.com/privacy-policy/48350961"
              ).catch((e) => console.log(e));
            }}
          >
            <MyText
              text="Terms & Conditions"
              color="#000000"
              size={widthToDp("3.4%")}
            />
          </MenuOption>
        </MenuOptions>
      </Menu>
      <TouchableOpacity
        onPress={async () => {
          const authData = await AsyncStorage.getItem("token");
          if (authData && JSON.parse(authData)) {
            Alert.alert("Are you sure want to logout!", "", [
              {
                onPress: () => {
                  signout(navigation);
                  SimpleToast.show("Logged out successfully.");
                },
                text: "Logout",
              },
              { onPress: () => {}, text: "Cancel", style: "cancel" },
            ]);
          } else {
            navigation.replace("SignUpScreen");
          }
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
    paddingTop: Platform.OS === "android" ? heightToDp("7%") : 20,
    paddingHorizontal: 30,
    position: "relative",
  },
});
