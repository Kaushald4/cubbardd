import AsyncStorage from "@react-native-community/async-storage";

export const signout = async (navigation: any) => {
  const data = await AsyncStorage.getItem("skippedAuth");
  const token = await AsyncStorage.getItem("token");

  const isSkipped = JSON.parse(data as any);
  if (isSkipped) {
    if (token) {
      await AsyncStorage.removeItem("token");
      navigation.replace("SignUpScreen");
    } else {
      navigation.replace("SignUpScreen");
    }
  } else {
    AsyncStorage.removeItem("token")
      .then(() => {
        navigation.replace("LoginScreen");
      })
      .catch((error) => {
        console.log("error in removing token from async storage ", error);
      });
  }
};
