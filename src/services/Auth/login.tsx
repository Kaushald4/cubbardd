import AsyncStorage from "@react-native-community/async-storage";
import { BASE_URI } from "./uri";

interface Props {
  email: string;
  password: string;
}

interface User {
  token: string;
  user: {};
  error?: {
    email: string;
    password: string;
  };
}

//TODO: Store only token and user id on async storage
const loginWithEmailAndPassword = async ({ email, password }: Props) => {
  const loginData = {
    email,
    password,
  };
  return new Promise<User>(async (resolve, reject) => {
    try {
      const response = await fetch(`${BASE_URI}/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginData),
      });
      const jsonRes = await response.json();
      console.log(jsonRes);
      if (jsonRes.token) {
        AsyncStorage.setItem(
          "token",
          JSON.stringify({ token: jsonRes.token, id: jsonRes.user._id })
        )
          .then(() => {
            resolve(jsonRes);
          })
          .catch((error) => {
            console.log("error on setting token to asyncStorage ", error);
          });
      } else {
        resolve(jsonRes);
      }
    } catch (error) {
      reject(error);
    }
  });
};

export { loginWithEmailAndPassword };
