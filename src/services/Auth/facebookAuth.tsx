import AsyncStorage from "@react-native-community/async-storage";
import { LoginManager, AccessToken } from "react-native-fbsdk";
import { saveAsyncItemToDB } from "./skipAuth";
import { BASE_URI } from "./uri";

interface User {
  token: string;
  user: {};
  error?: string;
  cancel: boolean;
}

export async function logInWithFacebook() {
  return new Promise<User>(async (resolve, reject) => {
    try {
      const res = await LoginManager.logInWithPermissions([
        "public_profile",
      ]).then(
        async function (result: any) {
          if (result.isCancelled) {
            resolve({
              cancel: true,
              token: "",
              user: "",
              error: undefined,
            });
          } else {
            //Success
            const token = await AccessToken.getCurrentAccessToken();
            if (token.accessToken) {
              const userData = await fetch(
                `https://graph.facebook.com/me?fields=name,email,id&access_token=${token.accessToken}`
              );
              const userDataJson = await userData.json();
              const { email, id, name } = userDataJson;
              const newUserData = {
                email,
                id,
                name,
              };

              //calling backend server to store this user
              const userDataServer = await fetch(`${BASE_URI}/signinfacebook`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUserData),
              });
              const savedUser = await userDataServer.json();
              if (savedUser.token) {
                await AsyncStorage.removeItem("skippedAuth");
                await saveAsyncItemToDB({
                  token: savedUser.token,
                  userID: savedUser._id,
                });
                AsyncStorage.setItem(
                  "token",
                  JSON.stringify({
                    token: savedUser.token,
                    id: savedUser.user._id,
                  })
                )
                  .then(() => {
                    resolve(savedUser);
                  })
                  .catch((error) => {
                    console.log(
                      "error on setting token to asyncStorage ",
                      error
                    );
                  });
              } else {
                resolve(savedUser);
              }
            }
          }
        },
        function (error: any) {
          console.log("Login fail with error: " + error.message);
          reject(error.message);
        }
      );
    } catch ({ message }) {
      reject(message);
    }
  });
}

export async function signupWithFacebook() {
  return new Promise<User>(async (resolve, reject) => {
    try {
      const res = await LoginManager.logInWithPermissions([
        "public_profile",
      ]).then(
        async function (result: any) {
          if (result.isCancelled) {
            resolve({
              cancel: true,
              token: "",
              user: "",
              error: undefined,
            });
          } else {
            //Success
            const token = await AccessToken.getCurrentAccessToken();
            if (token.accessToken) {
              const userData = await fetch(
                `https://graph.facebook.com/me?fields=name,email,id&access_token=${token.accessToken}`
              );
              const userDataJson = await userData.json();
              const { email, id, name } = userDataJson;
              const newUserData = {
                email,
                id,
                name,
              };
              //calling backend server to store this user
              const userDataServer = await fetch(`${BASE_URI}/signupfacebook`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newUserData),
              });
              const savedUser = await userDataServer.json();

              //TODO: store only token and userID in async storage
              if (savedUser.token) {
                await AsyncStorage.removeItem("skippedAuth");
                await saveAsyncItemToDB({
                  token: savedUser.token,
                  userID: savedUser.user._id,
                });
                AsyncStorage.setItem(
                  "token",
                  JSON.stringify({
                    token: savedUser.token,
                    id: savedUser.user._id,
                  })
                )
                  .then(() => {
                    resolve(savedUser);
                  })
                  .catch((error) => {
                    console.log(
                      "error on setting token to asyncStorage ",
                      error
                    );
                  });
              } else {
                resolve(savedUser);
              }
            }
          }
        },
        function (error: any) {
          console.log("Login fail with error: " + error.message);
          reject(error.message);
        }
      );
    } catch ({ message }) {
      reject(message);
    }
  });
}

// Object {
//     "email": "dibyajyotimishra14@gmail.com",
//     "id": "176986297321439",
//     "name": "Dibyajyoti Mishra",
//   }

//Rate limit Error
// Object {
//     "error": Object {
//       "code": 4,
//       "fbtrace_id": "ADXFhzblsYiwNg-PwG8FCQv",
//       "is_transient": true,
//       "message": "(#4) Application request limit reached",
//       "type": "OAuthException",
//     },
//   }
