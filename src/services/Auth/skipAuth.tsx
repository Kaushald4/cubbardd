import AsyncStorage from "@react-native-community/async-storage";
import { Alert } from "react-native";
import { create_id } from "../../utils/validation";
import { createGotitNotes } from "../Gotit/gotit";
import { createNeedItNotes } from "../NeedIt/needit";

const skipAuth = (navigation: any) => {
  AsyncStorage.setItem("skippedAuth", "true")
    .then(() => {
      navigation.replace("Home");
    })
    .catch((error) =>
      console.log("something went wrong on setting to async storage ", error)
    );
};

interface Props {
  needIt?: string;
  gotIt?: string;
  action: "needIt" | "gotIt";
  navigation: any;
}

export const addItemToAsyncStorage = async ({
  needIt,
  gotIt,
  action,
  navigation,
}: Props) => {
  try {
    const isSkippedData = await AsyncStorage.getItem("skippedAuth");
    if (isSkippedData && JSON.parse(isSkippedData)) {
      const userNotesData = await AsyncStorage.getItem("userNotes");
      if (userNotesData && JSON.parse(userNotesData)) {
        const userNotes = JSON.parse(userNotesData);
        if (action === "needIt") {
          if (userNotes.needIt.length >= 2) {
            return Alert.alert(
              "Please Sign up to continue saving.....",
              "",
              [
                {
                  text: "Cancel",
                  onPress: () => {},
                  style: "cancel",
                },
                {
                  text: "Sign up",
                  onPress: () => navigation.replace("SignUpScreen"),
                },
              ],
              { cancelable: true }
            );
          } else {
            const needItData = [
              ...userNotes.needIt,
              { _id: create_id(), note: needIt },
            ];
            const newData = {
              needIt: needItData,
              gotIt: userNotes.gotIt,
            };
            await AsyncStorage.setItem("userNotes", JSON.stringify(newData));
            return needItData;
          }
        } else if (userNotes.gotIt.length >= 2) {
          return Alert.alert(
            "Please Sign up to continue saving.....",
            "",
            [
              {
                text: "Cancel",
                onPress: () => {},
                style: "cancel",
              },
              {
                text: "Sign up",
                onPress: () => navigation.replace("SignUpScreen"),
              },
            ],
            { cancelable: true }
          );
        } else {
          const gotItData = [
            ...userNotes.gotIt,
            { _id: create_id(), note: gotIt },
          ];
          const newData = {
            needIt: userNotes.needIt,
            gotIt: gotItData,
          };
          await AsyncStorage.setItem("userNotes", JSON.stringify(newData));
          return gotItData;
        }
      } else {
        if (action === "needIt") {
          const needItData = [{ _id: create_id(), note: needIt }];
          const newData = {
            needIt: needItData,
            gotIt: [],
          };
          await AsyncStorage.setItem("userNotes", JSON.stringify(newData));
          return needItData;
        } else {
          const gotItData = [{ _id: create_id(), note: gotIt }];
          const newData = {
            needIt: [],
            gotIt: gotItData,
          };
          await AsyncStorage.setItem("userNotes", JSON.stringify(newData));
          return gotItData;
        }
      }
    }
  } catch (error) {
    console.log("error in adding usernotes to asyncstorage ", error);
  }
};

export const saveAsyncItemToDB = async ({
  token,
  userID,
}: {
  userID: string;
  token: string;
}) => {
  const userNotesData = await AsyncStorage.getItem("userNotes");
  if (userNotesData) {
    const userNotes = JSON.parse(userNotesData);

    if (userNotes.needIt.length > 0 && userNotes.gotIt.length > 0) {
      if (userNotes.gotIt.length <= 1) {
        await createGotitNotes({
          userID: userID,
          token: token,
          note: userNotes.gotIt[0].note,
        });
      } else {
        await createGotitNotes({
          userID: userID,
          token: token,
          note: userNotes.gotIt[0].note,
        });
        await createGotitNotes({
          userID: userID,
          token: token,
          note: userNotes.gotIt[1].note,
        });
      }
      if (userNotes.needIt.length <= 1) {
        await createNeedItNotes({
          userID: userID,
          token: token,
          note: userNotes.needIt[0].note,
        });
      } else {
        await createNeedItNotes({
          userID: userID,
          token: token,
          note: userNotes.needIt[0].note,
        });
        await createNeedItNotes({
          userID: userID,
          token: token,
          note: userNotes.needIt[1].note,
        });
      }
    } else if (userNotes.needIt) {
      if (userNotes.needIt.length <= 1) {
        await createNeedItNotes({
          userID: userID,
          token: token,
          note: userNotes.needIt[0].note,
        });
      } else {
        await createNeedItNotes({
          userID: userID,
          token: token,
          note: userNotes.needIt[0].note,
        });
        await createNeedItNotes({
          userID: userID,
          token: token,
          note: userNotes.needIt[1].note,
        });
      }
    } else if (userNotes.gotIt) {
      if (userNotes.gotIt.length <= 1) {
        await createGotitNotes({
          userID: userID,
          token: token,
          note: userNotes.gotIt[0].note,
        });
      } else {
        await createGotitNotes({
          userID: userID,
          token: token,
          note: userNotes.gotIt[0].note,
        });
        await createGotitNotes({
          userID: userID,
          token: token,
          note: userNotes.gotIt[1].note,
        });
      }
    }
  }
};

export default skipAuth;
