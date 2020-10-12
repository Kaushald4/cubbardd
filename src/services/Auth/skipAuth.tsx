import AsyncStorage from "@react-native-community/async-storage";

const skipAuth = (navigation: any) => {
  AsyncStorage.setItem("skippedAuth", "true")
    .then(() => {
      navigation.replace("Home");
    })
    .catch((error) =>
      console.log("something went wrong on setting to async storage ", error)
    );
};

export const addItemToAsyncStorage = async () => {};

export default skipAuth;
