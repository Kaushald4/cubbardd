import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Keyboard,
  Pressable,
  SafeAreaView,
  StyleSheet,
  View,
  TextInput,
  Alert,
} from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import Fontawesome from "react-native-vector-icons/FontAwesome";
import { Constants } from "react-native-unimodules";
import { useTheme } from "react-native-paper";

import {
  LoadingIndicator,
  MyAppbar,
  MyText,
  PopuptextField,
} from "../../components";
import { Props } from "./types";
import {
  createMultipleNeedItNotes,
  createMultipleGotitNotes,
  addItemToAsyncStorage,
  createGotitNotes,
  createNeedItNotes,
} from "../../services/index";
import {
  ScrollView,
  TouchableWithoutFeedback,
} from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import AsyncStorage from "@react-native-community/async-storage";
import { heightToDp, widthToDp } from "../../utils";
import Toast from "react-native-simple-toast";

const { width, height, scale, fontScale } = Dimensions.get("window");

const AddItemScreen = ({ navigation, route }: Props) => {
  const { screenName } = route.params;
  const theme = useTheme();
  const [newItem, setNewItem] = useState("");
  const [items, setItems] = useState([]);
  const [isTextFieldShown, setTextFieldShown] = useState(false);
  const [placeholder, setPlaceHolder] = useState("New item....");
  const [isLoading, setIsLoading] = useState(false);
  const [notes, setNotes] = useState([{ note: "" }]);

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, []);

  const addItem = async (note: string) => {
    try {
      //if user is not signed in
      const isSkippedData = await AsyncStorage.getItem("skippedAuth");
      if (isSkippedData && JSON.parse(isSkippedData)) {
        if (screenName === "Need It") {
          // await AsyncStorage.removeItem("userNotes");
          if (note.length >= 2) {
            await addItemToAsyncStorage({
              needIt: newItem,
              action: "needIt",
              navigation,
            });
            const userNotesData = await AsyncStorage.getItem("userNotes");
            const userNotes = await JSON.parse(userNotesData as string);
            setItems(userNotes.needIt);
            setPlaceHolder("");
            setTextFieldShown(false);
            setIsLoading(false);
          }
        } else {
          if (note.length >= 2) {
            await addItemToAsyncStorage({
              gotIt: newItem,
              action: "gotIt",
              navigation,
            });
            const userNotesData = await AsyncStorage.getItem("userNotes");
            const userNotes = await JSON.parse(userNotesData as string);
            setItems(userNotes.gotIt);
            setPlaceHolder("");
            setTextFieldShown(false);
            setIsLoading(false);
          }
        }
      } else {
        if (note) {
          const authData = await AsyncStorage.getItem("token");
          const { token, id } = JSON.parse(authData as string);
          if (items.length < 5) {
            if (note.length >= 2) {
              if (screenName === "Need It") {
                setIsLoading(true);
                const createdItem = await createNeedItNotes({
                  note,
                  userID: id,
                  token,
                });
                setItems([...items, createdItem]);
                setPlaceHolder("");
                setTextFieldShown(false);
                setIsLoading(false);
              } else {
                setIsLoading(true);
                const createdItem = await createGotitNotes({
                  note,
                  userID: id,
                  token,
                });
                setItems([...items, createdItem]);
                setPlaceHolder("");
                setTextFieldShown(false);
                setIsLoading(false);
              }
            }
          } else {
            Alert.alert(
              "You can not add more than five items at the same time.",
              "",
              [{ text: "OK", style: "cancel", onPress: () => {} }]
            );
          }
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  return (
    <SafeAreaView style={[styles.container]}>
      <KeyboardAwareScrollView
        nestedScrollEnabled
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="always"
        keyboardDismissMode="interactive"
      >
        <LoadingIndicator isVisible={isLoading} title="Adding...." />
        <TouchableWithoutFeedback
          onPress={() => Keyboard.dismiss()}
          style={{ height }}
        >
          <ImageBackground
            style={styles.backgroundOverlay}
            source={require("../../assets/homebg.png")}
            resizeMode="stretch"
          >
            <View style={styles.wrapper}>
              <View style={{ paddingHorizontal: 40 }}>
                <MyText
                  center
                  pb={20}
                  text={`Add an item to the ${screenName} list!`}
                  color="#FFFFFF"
                  size={widthToDp("8%")}
                  ff="Ubuntu-Medium"
                />
              </View>
              <View
                style={{ height: height * 0.6 + Constants.statusBarHeight }}
              >
                <ScrollView>
                  {items.length >= 0 && (
                    <View>
                      {items.map((item, i) => {
                        return (
                          <View
                            key={i}
                            style={{
                              backgroundColor: "#FFFFFF",
                              paddingHorizontal: 20,
                              paddingVertical: 20,
                              borderRadius: 5,
                              marginVertical: 4,
                            }}
                          >
                            <MyText
                              text={item.note}
                              numOfLines={2}
                              color={theme.colors.accent}
                              size={15}
                            />
                          </View>
                        );
                      })}
                      <>
                        {items.length <= 0 || isTextFieldShown ? (
                          <View style={{ position: "relative" }}>
                            <TextInput
                              placeholder="New item...."
                              style={{
                                backgroundColor: "#FFFFFF",
                                borderRadius: 5,
                                paddingHorizontal: 10,
                                paddingRight: 50,
                                paddingVertical: 18,
                              }}
                              onChangeText={setNewItem}
                            />
                            <Pressable
                              style={{
                                position: "absolute",
                                right: 20,
                                top: 14,
                              }}
                              onPress={() => addItem(newItem)}
                            >
                              <Fontawesome
                                name="check-circle"
                                color={
                                  newItem.length >= 2
                                    ? theme.colors.primary
                                    : theme.colors.disabled
                                }
                                size={28}
                              />
                            </Pressable>
                          </View>
                        ) : (
                          <View />
                        )}
                        {items.length >= 1 ? (
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              marginTop: 8,
                              marginBottom: 10,
                              paddingBottom: heightToDp("2%"),
                            }}
                          >
                            <Pressable
                              android_ripple={{
                                color: theme.colors.background,
                                radius: 200,
                              }}
                              onPress={() =>
                                setTextFieldShown(!isTextFieldShown)
                              }
                            >
                              <Entypo
                                name="circle-with-plus"
                                color={theme.colors.accent}
                                size={45}
                              />
                            </Pressable>
                            <Pressable
                              android_ripple={{ color: theme.colors.primary }}
                              onPress={async () => {
                                Toast.show("Saved", Toast.SHORT);
                                navigation.goBack();
                              }}
                              style={{
                                paddingHorizontal: 20,
                                backgroundColor: "#FFFFFF",
                                height: width * 0.1,
                                width: width * 0.24,
                                borderRadius: 5,
                                justifyContent: "center",
                              }}
                            >
                              <MyText
                                center
                                text="Done"
                                color={theme.colors.accent}
                                size={18}
                              />
                            </Pressable>
                          </View>
                        ) : (
                          <View />
                        )}
                      </>
                    </View>
                  )}
                </ScrollView>
              </View>
            </View>
          </ImageBackground>
        </TouchableWithoutFeedback>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
};

export default AddItemScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  backgroundOverlay: {
    width: "100%",
    height: "100%",
    position: "absolute",
    zIndex: -1,
    top: heightToDp("10%"),
  },
  wrapper: {
    marginTop: heightToDp("14%"),
    paddingHorizontal: 20,
  },
  textInput: {
    backgroundColor: "#FFFFFF",
    paddingRight: 28,
  },
});
