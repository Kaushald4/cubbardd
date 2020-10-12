import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ImageBackground,
  Platform,
  Pressable,
  StyleSheet,
  View,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Keyboard,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import MaterailIcons from "react-native-vector-icons/MaterialIcons";
import { Constants } from "react-native-unimodules";

import {
  LoadingIndicator,
  MyAppbar,
  MyListview,
  MyText,
  PopuptextField,
} from "../../components";
import { Props } from "./types";
import { Button, useTheme, Text } from "react-native-paper";
import AsyncStorage from "@react-native-community/async-storage";
import {
  deleteNeedItNotes,
  getAllNeedItNotes,
  updateNeedItNotes,
} from "../../services/NeedIt/needit";
import { useFocusEffect } from "@react-navigation/native";
import { heightToDp, widthToDp } from "../../utils/dimensions";

const { width, height, scale, fontScale } = Dimensions.get("window");

const NeedItScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const [items, setItems] = useState<any>([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoding, setIsLoading] = useState(false);
  const [isPopupTextFieldShown, setPopupTextFieldShown] = useState(false);
  const [updatedNote, setUpdatedNote] = useState({ id: "", note: "" });

  //TODO: remove navigation lisetner when component will unmount
  useEffect(() => {
    navigation.setOptions({ headerShown: false });

    navigation.addListener("focus", () => {
      getAllNotes();
    });
  }, []);

  const getAllNotes = async () => {
    try {
      const authData = await AsyncStorage.getItem("token");
      if (authData) {
        const { token, id } = JSON.parse(authData as string);
        const data = await getAllNeedItNotes({ token, userID: id });
        if (!data.error) {
          console.log(data);
          if (data.notes.length <= 0) {
            setItems([]);
          } else {
            setItems(data.notes.needIt);
          }
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  //swipe delete
  const singleSwipeDelete = async (id: string | undefined) => {
    const notesId = [id];
    try {
      setIsLoading(true);
      const authData = await AsyncStorage.getItem("token");
      const { token, id } = JSON.parse(authData as string);
      const data = await deleteNeedItNotes({ userID: id, notesId, token });
      console.log(data);
      if (data.success) {
        getAllNotes();
        setSelectedItems([]);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const deleteItem = async (id?: any) => {
    const notesId = selectedItems.map(function (item) {
      return item["_id"];
    });

    Alert.alert(
      "Are you sure want to delete it ?",
      "",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel",
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              setIsLoading(true);
              const authData = await AsyncStorage.getItem("token");
              const { token, id } = JSON.parse(authData as string);
              const data = await deleteNeedItNotes({
                userID: id,
                notesId,
                token,
              });
              console.log(data);
              if (data.success) {
                getAllNotes();
                setSelectedItems([]);
                setIsLoading(false);
              }
            } catch (error) {
              setIsLoading(false);
              console.log(error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleOnChange = async (
    prevNote: string | undefined,
    id: string | undefined
  ) => {
    setUpdatedNote({ id: id as string, note: prevNote as string });
    setPopupTextFieldShown(true);
    console.log(updatedNote);
  };

  //TODO: refactor this to updateNote
  const updateNode = async () => {
    Keyboard.dismiss();
    setPopupTextFieldShown(false);
    try {
      setIsLoading(true);
      const authData = await AsyncStorage.getItem("token");
      const { token, id } = JSON.parse(authData as string);
      const data = await updateNeedItNotes({
        userID: id,
        noteID: updatedNote.id,
        token,
        note: updatedNote.note,
      });
      if (data) {
        getAllNotes();
        setSelectedItems([]);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  if (!items) {
    return (
      <View style={{ backgroundColor: theme.colors.primary, flex: 1 }}>
        <LoadingIndicator isVisible={true} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <MyAppbar />
      <LoadingIndicator isVisible={isLoding} title="" />
      <PopuptextField
        visible={isPopupTextFieldShown}
        setVisible={setPopupTextFieldShown}
        note={updatedNote.note}
        onChangeText={(text) => setUpdatedNote({ ...updatedNote, note: text })}
        updateNote={updateNode}
      />
      <ImageBackground
        style={styles.backgroundOverlay}
        source={require("../../assets/bg.png")}
      >
        <View style={styles.wrapper}>
          <View style={styles.needItContainer}>
            <View
              style={[
                styles.needItGotItTextContainer,
                {
                  justifyContent: items.length < 1 ? "center" : "space-between",
                },
              ]}
            >
              <MyText
                text="Need It!"
                color="#FFFFFF"
                size={items.length < 1 ? widthToDp("9%") : widthToDp("10%")}
                pt={(height / fontScale) * 0.11}
                ff="Ubuntu-Bold"
                shadow
                center={items.length < 1}
              />

              {items.length > 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {selectedItems.length <= 1 && (
                    <MyText
                      text="Got it!"
                      color="#FFFFFF"
                      size={18}
                      pt={(height / fontScale) * 0.1}
                      ff="Ubuntu-Bold"
                    />
                  )}
                  {/* multiple select buttons section */}
                  {selectedItems.length > 1 && (
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        paddingTop: (height / fontScale) * 0.1,
                      }}
                    >
                      <Pressable
                        onPress={() => {}}
                        android_ripple={{ color: "#FFFFFF" }}
                        style={{
                          marginRight: 10,
                          backgroundColor: "#000000",
                          borderRadius: 4,
                          overflow: "hidden",
                          paddingHorizontal: 8,
                        }}
                      >
                        <Text style={{ textAlign: "center", color: "#FFFFFF" }}>
                          Low
                        </Text>
                      </Pressable>
                      <Pressable onPress={() => deleteItem()}>
                        <MaterailIcons name="delete" size={20} />
                      </Pressable>
                    </View>
                  )}
                  <TouchableOpacity
                    style={{
                      paddingTop: (height / fontScale) * 0.1,
                      paddingLeft: 14,
                    }}
                    onPress={() => navigation.navigate("GotItScreen")}
                  >
                    <FontAwesome name="share" color="#FFFFFF" size={18} />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {/* {plus button} */}
            {items.length < 1 && (
              <>
                <View style={{ maxWidth: width * 0.5, alignSelf: "center" }}>
                  <Entypo
                    name="emoji-sad"
                    size={24}
                    color="#FFFFFF"
                    style={{
                      textAlign: "center",
                      paddingTop: heightToDp("5%"),
                    }}
                  />
                  <MyText
                    text="You have nothing in this list"
                    size={widthToDp("5%")}
                    color="#FFFFFF"
                    pt={14}
                    ff="Ubuntu-Bold"
                    center
                  />
                </View>

                <View style={styles.addItemButtonWrapper}>
                  <TouchableOpacity
                    style={[
                      styles.addItemButton,
                      { position: "relative", zIndex: 99999 },
                    ]}
                    onPress={() =>
                      navigation.navigate("AddItemsScreen", {
                        screenName: "Need It",
                      })
                    }
                  >
                    <Entypo
                      color={theme.colors.primary}
                      name="plus"
                      size={70}
                    />
                  </TouchableOpacity>
                  <MyText
                    text="Add your first item"
                    color="#FFFFFF"
                    size={18}
                    pt={8}
                    ff="Ubuntu-Light"
                  />
                </View>
              </>
            )}

            {/* {list item section starts here} */}
            {items.length >= 1 ? (
              <View style={{ height: heightToDp("50%") }}>
                <MyListview
                  data={items}
                  selectedItems={selectedItems}
                  swipeDelete={singleSwipeDelete}
                  updateNote={handleOnChange}
                  setSelectedItems={setSelectedItems}
                  deleteItem={deleteItem}
                />
              </View>
            ) : (
              <View />
            )}
          </View>

          {items.length >= 1 && (
            <Pressable
              style={{ marginBottom: heightToDp("2%") }}
              onPress={() =>
                navigation.navigate("AddItemsScreen", { screenName: "Need It" })
              }
            >
              <View
                style={{
                  width: widthToDp("15%"),
                  height: widthToDp("15%"),
                  borderRadius: 500,
                  backgroundColor: "#FFFFFF",
                  alignSelf: "center",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Entypo name="plus" size={20} />
              </View>
            </Pressable>
          )}

          {/* {bottom section} */}
          {items.length < 1 && (
            <View style={styles.bottomText}>
              <MyText
                text="Got Something"
                color="#FFFFFF"
                size={17}
                pb={8}
                ff="Ubuntu-Bold"
              />
              <View style={styles.bottomTextButton}>
                <View style={{ flexBasis: width * 0.7 }}>
                  <MyText
                    text="Add it to the Need it list. Just swap left and right to move between lists!"
                    color="#FFFFFF"
                    size={15}
                    ff="Ubuntu-Regular"
                  />
                </View>
                <TouchableOpacity
                  onPress={() => navigation.navigate("GotItScreen")}
                >
                  <FontAwesome name="share" color="#FFFFFF" size={24} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
};

export default NeedItScreen;

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
    top: 100,
  },
  needItContainer: {
    justifyContent: "center",
  },
  needItGotItTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  addItemButtonWrapper: {
    alignSelf: "center",
    paddingTop: heightToDp("2%"),
    alignItems: "center",
  },
  addItemButton: {
    width: widthToDp("25%"),
    height: widthToDp("25%"),
    backgroundColor: "#FFFFFF",
    borderRadius: 500,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: {
    justifyContent: "space-between",
    height:
      Platform.OS === "android"
        ? heightToDp("80%")
        : (height / fontScale) * 0.8,
  },
  bottomText: {
    paddingHorizontal: 28,
  },
  bottomTextButton: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
