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
import {
  copyNotesToNeedIt,
  deleteGotItNotes,
  getAllGotItNotes,
  markGotItNotesLow,
  moveToNeedIt,
  updateGotItNotes,
  markGotItNotesNotLow,
  handleLowGotItNote,
} from "../../services";
import AsyncStorage from "@react-native-community/async-storage";
import { heightToDp, widthToDp } from "../../utils";
import SimpleToast from "react-native-simple-toast";

const { width, height, scale, fontScale } = Dimensions.get("window");

const GotItScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const [items, setItems] = useState<any>([]);
  const [selectedItems, setSelectedItems] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isPopupTextFieldShown, setPopupTextFieldShown] = useState(false);
  const [updatedNote, setUpdatedNote] = useState({ id: "", note: "" });
  const [isLowSelect, setIsLowSelect] = useState(false);
  const [isLow, setIslow] = useState(false);
  const [isMenuItemShown, setIsMenuItemShown] = useState(false);
  const [showBtn, seBtnShow] = useState(false);

  //TODO: remove navigation lisetner when component will unmount
  useEffect(() => {
    navigation.setOptions({ headerShown: false });
    navigation.addListener("focus", () => {
      getAllNotes();
    });
    navigation.addListener("blur", () => {
      setSelectedItems([]);
      setIslow(false);
      setIsLowSelect(false);
    });
  }, []);

  useEffect(() => {
    const islow = selectedItems.map((e) => e.low);

    const low = islow.every((low) => low === true);
    const istrue = islow.some((e) => e === true);

    if (low) {
      seBtnShow(false);
    } else {
      seBtnShow(true);
    }

    if (istrue) {
      seBtnShow(false);
    }
  }, [selectedItems]);

  const getAllNotes = async () => {
    try {
      //user is not signed in
      const isSkippedData = await AsyncStorage.getItem("skippedAuth");
      if (isSkippedData && JSON.parse(isSkippedData)) {
        //user is not signed in
        const userNotesData = await AsyncStorage.getItem("userNotes");
        if (userNotesData) {
          const userNotes = JSON.parse(userNotesData as string);
          if (userNotes.gotIt) {
            setItems(userNotes.gotIt);
          } else {
            setItems([]);
          }
        }
      } else {
        //user is signed in
        setIsLoading(true);
        const authData = await AsyncStorage.getItem("token");
        if (authData) {
          const { token, id } = JSON.parse(authData as string);

          const data = await getAllGotItNotes({ token, userID: id });
          if (!data.error) {
            if (data.notes.length <= 0) {
              setItems([]);
              setIsLoading(false);
            } else {
              setItems(data.notes.gotIt);
              setIsLoading(false);
            }
            setIsLoading(false);
          }
        } else {
          setIsLoading(false);
        }
      }
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  //swipe delete
  const singleSwipeDelete = async (id: string | undefined) => {
    const notesId = [id];
    try {
      const isSkippedData = await AsyncStorage.getItem("skippedAuth");
      if (isSkippedData && JSON.parse(isSkippedData)) {
        const userNotesData = await AsyncStorage.getItem("userNotes");
        const userNotes = JSON.parse(userNotesData as string);

        const filteredUserNotes = userNotes.gotIt.filter(
          (el) => el._id !== notesId[0]
        );
        const newUserNotes = {
          needIt: userNotes.needIt,
          gotIt: filteredUserNotes,
        };
        await AsyncStorage.setItem("userNotes", JSON.stringify(newUserNotes));
      } else {
        setIsLoading(true);
        const authData = await AsyncStorage.getItem("token");
        const { token, id } = JSON.parse(authData as string);
        const data = await deleteGotItNotes({ userID: id, notesId, token });
        if (data.success) {
          getAllNotes();
          setSelectedItems([]);
          setIsLoading(false);
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const clearPrevDataOnSwipe = (id: string) => {
    const newData = items.filter((el) => el._id !== id);
    setItems(newData);
  };

  const deleteItem = async () => {
    const notesId = selectedItems.map(function (item) {
      return item["_id"];
    });

    const isSkippedData = await AsyncStorage.getItem("skippedAuth");
    if (isSkippedData && JSON.parse(isSkippedData)) {
      const userNotesData = await AsyncStorage.getItem("userNotes");
      if (notesId.length > 1) {
        // await AsyncStorage.removeItem("userNotes");
        if (userNotesData) {
          const userNotes = JSON.parse(userNotesData);
          const newData = {
            needIt: userNotes.needIt,
            gotIt: [],
          };
          await AsyncStorage.setItem("userNotes", JSON.stringify(newData));
        }
        await getAllNotes();
        setSelectedItems([]);
      } else {
        const userNotesData = await AsyncStorage.getItem("userNotes");
        const userNotes = JSON.parse(userNotesData as string);
        const filteredUserNotes = userNotes.gotIt.filter(
          (el) => el._id !== notesId[0]
        );
        const newUserDataNotes = {
          needIt: userNotes.needIt,
          gotIt: filteredUserNotes,
        };
        await AsyncStorage.setItem(
          "userNotes",
          JSON.stringify(newUserDataNotes)
        );
        getAllNotes();
        setSelectedItems([]);
      }
    } else {
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
                const data = await deleteGotItNotes({
                  userID: id,
                  notesId,
                  token,
                });
                if (data.success) {
                  getAllNotes();
                  setSelectedItems([]);
                  setIsLoading(false);
                  SimpleToast.show(
                    `${selectedItems.length} ${
                      selectedItems.length > 1 ? "items" : "item"
                    } deleted`,
                    SimpleToast.SHORT
                  );
                }
              } catch (error) {
                setIsLoading(false);
                console.log(error);
              }
            },
          },
        ],
        { cancelable: true }
      );
    }
  };

  const handleOnChange = async (
    prevNote: string | undefined,
    id: string | undefined
  ) => {
    setUpdatedNote({ id: id as string, note: prevNote as string });
    setPopupTextFieldShown(true);
  };
  const updateNode = async () => {
    Keyboard.dismiss();
    setPopupTextFieldShown(false);
    try {
      const isSkippedData = await AsyncStorage.getItem("skippedAuth");
      if (isSkippedData && JSON.parse(isSkippedData)) {
        const userNotesData = await AsyncStorage.getItem("userNotes");
        const userNotes = JSON.parse(userNotesData as string);
        const index = userNotes.gotIt
          .map((el: any) => el._id)
          .indexOf(updatedNote.id);
        const updatedData = userNotes.gotIt[index];
        const newData = (updatedData.note = updatedNote.note);
        const updatedUserataNote = { _id: updatedNote.id, note: newData };
        const filteredUserNotes = userNotes.gotIt.filter(
          (el: any) => el._id !== updatedNote.id
        );
        const newUserNote = {
          needIt: userNotes.needIt,
          gotIt: [updatedUserataNote, ...filteredUserNotes],
        };
        await AsyncStorage.setItem("userNotes", JSON.stringify(newUserNote));
        getAllNotes();
      } else {
        setIsLoading(true);
        const authData = await AsyncStorage.getItem("token");
        const { token, id } = JSON.parse(authData as string);
        const data = await updateGotItNotes({
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
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  const moveToNeedItList = async (
    notesID?: Array<string>,
    low: boolean,
    isTapped: boolean
  ) => {
    try {
      const isSkippedData = await AsyncStorage.getItem("skippedAuth");
      if (isSkippedData && JSON.parse(isSkippedData)) {
        const userNotesData = await AsyncStorage.getItem("userNotes");

        if (userNotesData) {
          const userNotes = JSON.parse(userNotesData);
          if (selectedItems.length <= 1) {
            const filteredList = userNotes.gotIt.filter(
              (el: any) => el._id === notesID[0]
            );
            const filteredGotItList = userNotes.gotIt.filter(
              (el: any) => el._id !== notesID[0]
            );
            const filteredNeedIttList = userNotes.needIt.filter(
              (el: any) => el._id !== notesID[0]
            );
            filteredList.low = false;
            if (!low) {
              setIsLoading(true);
              const newData = {
                needIt: [...userNotes.needIt, ...filteredList],
                gotIt: filteredGotItList,
              };
              if (userNotes.needIt.length > 1) {
                Alert.alert(
                  "Sign up to continue....",
                  "",
                  [
                    {
                      text: "Cancel",
                      onPress: async () => {
                        await getAllNotes();
                        setIsLowSelect(false);
                        setIslow(false);
                        setSelectedItems([]);
                        setIsLoading(false);
                      },
                      style: "cancel",
                    },
                    {
                      text: "Sign up",
                      onPress: () => navigation.navigate("SignUpScreen"),
                    },
                  ],
                  { cancelable: false }
                );
                setIsLoading(false);
              } else {
                await AsyncStorage.setItem(
                  "userNotes",
                  JSON.stringify(newData)
                );
                setIsLoading(false);
                setSelectedItems([]);
                await getAllNotes();
              }
            } else {
              setIsLoading(true);
              filteredList[0].low = false;
              const newData = {
                needIt: [...filteredNeedIttList, ...filteredList],
                gotIt: [...filteredGotItList],
              };
              if (userNotes.needIt.length > 1) {
                Alert.alert(
                  "Sign up to continue....",
                  "",
                  [
                    {
                      text: "Cancel",
                      onPress: async () => {
                        await getAllNotes();
                        setIsLowSelect(false);
                        setIslow(false);
                        setSelectedItems([]);
                        setIsLoading(false);
                      },
                      style: "cancel",
                    },
                    {
                      text: "Sign up",
                      onPress: () => navigation.navigate("SignUpScreen"),
                    },
                  ],
                  { cancelable: false }
                );
                await getAllNotes();
              } else {
                await AsyncStorage.setItem(
                  "userNotes",
                  JSON.stringify(newData)
                );
                setIsLowSelect(false);
                setIslow(false);
                setSelectedItems([]);
                setIsLoading(false);
                getAllNotes();
                SimpleToast.show(
                  "Moved to the Need it  list",
                  SimpleToast.SHORT
                );
              }
            }
          } else {
            //when more than one item selected
            if (userNotes.needIt.length > 1) {
              return Alert.alert(
                "Sign up to continue....",
                "",
                [
                  {
                    text: "Cancel",
                    onPress: async () => {
                      await getAllNotes();
                      setIsLowSelect(false);
                      setIslow(false);
                      setSelectedItems([]);
                    },
                    style: "cancel",
                  },
                  {
                    text: "Sign up",
                    onPress: () => navigation.navigate("SignUpScreen"),
                  },
                ],
                { cancelable: false }
              );
            } else {
              userNotes.gotIt[0].low = false;
              userNotes.gotIt[1].low = false;
              const newData = {
                needIt: userNotes.gotIt,
                gotIt: [],
              };
              await AsyncStorage.setItem("userNotes", JSON.stringify(newData));
              setIsLowSelect(false);
              setIslow(false);
              setSelectedItems([]);
              setIsLoading(false);
              getAllNotes();
            }
          }
        }
      } else {
        //when user is authenticated
        if (!isTapped) {
          setIsLoading(true);
          const notesId = selectedItems.map(function (item) {
            return item["_id"];
          });
          if (!isTapped) {
            setIsLoading(true);
            const notesId = selectedItems.map(function (item) {
              return item["_id"];
            });

            const userAuthData = await AsyncStorage.getItem("token");
            if (userAuthData) {
              const { token, id } = JSON.parse(userAuthData);
              if (low) {
                // await markGotItNotesNotLow({ notesID, token, userID: id });
                await handleLowGotItNote({
                  noteId: notesID[0],
                  token,
                  userId: id,
                });
                //TODO: set some toast messages
                setSelectedItems([]);
                getAllNotes();
                SimpleToast.show(
                  "Moved to the Need it  list",
                  SimpleToast.SHORT
                );
              } else {
                let newNotesId = [];
                if (selectedItems.length <= 1) {
                  newNotesId.push(...(notesID as Array<string>));
                } else {
                  const ids = selectedItems.map((el) => el["_id"]);
                  newNotesId.push(...ids);
                }
                await moveToNeedIt({ userID: id, token, notesID: newNotesId });
                setIsLoading(false);
                SimpleToast.show(
                  "Moved to the Need it  list",
                  SimpleToast.SHORT
                );
              }
            }
            // const authData = await AsyncStorage.getItem("token");
            // const { token, id } = JSON.parse(authData as string);
            // const data = await deleteGotItNotes({
            //   userID: id,
            //   notesId,
            //   token,
            // });
            // if (data.success) {
            //   getAllNotes();
            //   setSelectedItems([]);
            //   setIsLoading(false);
            //   navigation.navigate("NeedItScreen");
            //   SimpleToast.show("Moved to the need it list", SimpleToast.SHORT);
            // }
            // setIsLoading(false);
          } else {
            Alert.alert(
              "Would you like to move the item(s) to the Need It list?",
              "",
              [
                {
                  text: "Cancel",
                  onPress: () => {},
                  style: "cancel",
                },
                {
                  text: "Move",
                  onPress: async () => {
                    setIsLoading(true);
                    const notesId = selectedItems.map(function (item) {
                      return item["_id"];
                    });
                    // const userAuthData = await AsyncStorage.getItem("token");
                    // if (userAuthData) {
                    //   const { token, id } = JSON.parse(userAuthData);
                    //   let newNotesId = [];
                    //   if (selectedItems.length <= 1) {
                    //     newNotesId.push(...(notesID as Array<string>));
                    //   } else {
                    //     const ids = selectedItems.map((el) => el["_id"]);
                    //     newNotesId.push(...ids);
                    //   }
                    //   await moveToNeedIt({
                    //     userID: id,
                    //     token,
                    //     notesID: newNotesId,
                    //   });
                    //   setIsLoading(false);
                    //   setIslow(false);
                    //   setSelectedItems([]);
                    //   navigation.navigate("NeedItScreen");
                    // } else {
                    //   console.log("Sign in to continue....");
                    // }
                    const authData = await AsyncStorage.getItem("token");
                    const { token, id } = JSON.parse(authData as string);
                    const data = await deleteGotItNotes({
                      userID: id,
                      notesId,
                      token,
                    });
                    if (data.success) {
                      getAllNotes();
                      setSelectedItems([]);
                      setIsLoading(false);
                      navigation.navigate("NeedItScreen");
                      SimpleToast.show(
                        "moved to the need it list",
                        SimpleToast.SHORT
                      );
                    }
                    setIsLoading(false);
                  },
                },
              ],
              { cancelable: false }
            );
          }
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markNoteAsLow = async () => {
    selectedItems.forEach((el) => {
      if (el.low) {
        setIsLowSelect(true);
      }
    });
    try {
      const isSkippedData = await AsyncStorage.getItem("skippedAuth");
      if (isSkippedData && JSON.stringify(isSkippedData)) {
        const userNotesData = await AsyncStorage.getItem("userNotes");
        if (userNotesData) {
          const userNotes = JSON.parse(userNotesData);
          if (selectedItems.length <= 1) {
            setIsLowSelect(true);
            const filteredList = userNotes.gotIt.filter(
              (el: any) => el._id === selectedItems[0]._id
            );
            const preList = userNotes.gotIt.filter(
              (el: any) => el._id !== selectedItems[0]._id
            );
            filteredList[0].low = true;
            const newData = {
              needIt: [...userNotes.needIt, ...filteredList],
              gotIt: [...filteredList, ...preList],
            };
            await AsyncStorage.setItem("userNotes", JSON.stringify(newData));
            setIsLowSelect(false);
            setIsLoading(false);
            setIsLowSelect(true);
          } else {
            userNotes.gotIt.forEach((e: any) => (e.low = true));
            setIsLowSelect(true);
            const newData = {
              needIt: [...userNotes.gotIt],
              gotIt: [...userNotes.gotIt],
            };
            await AsyncStorage.setItem("userNotes", JSON.stringify(newData));
            selectedItems.forEach((e) => (e.low = true));
            selectedItems.length <= 1 ? setIslow(false) : setIslow(true);
            setIslow(false);
            setIsLowSelect(false);
            setSelectedItems([]);
            setIsLoading(false);
            SimpleToast.show("Marked as low", SimpleToast.SHORT);
          }
        }
      } else {
        const userAuthData = await AsyncStorage.getItem("token");
        if (userAuthData) {
          setIsLoading(true);
          setIsLowSelect(true);
          const { token, id } = JSON.parse(userAuthData);
          const newNotes = selectedItems.map((el) => el["_id"]);
          await markGotItNotesLow({
            userID: id,
            notesID: newNotes,
            token,
          });
          selectedItems.forEach((e) => (e.low = true));
          selectedItems.length <= 1 ? setIslow(false) : setIslow(true);
          const notesID = selectedItems.map((el) => el["_id"]);
          await copyNotesToNeedIt({
            notes: selectedItems,
            token,
            userID: id,
            notesID,
          });
          setIsLoading(false);
          setSelectedItems([]);
          setIsLowSelect(false);
          setIslow(false);
          SimpleToast.show("Marked as low...", SimpleToast.SHORT);
        } else {
          setIsLoading(false);
          console.log("sign in to continue.....");
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  const markNoteNotLow = async (notesID: Array<string>) => {
    try {
      const isSkippedData = await AsyncStorage.getItem("skippedAuth");
      if (isSkippedData && JSON.stringify(isSkippedData)) {
        // const userNotesData = await AsyncStorage.getItem("userNotes");
        // if (userNotesData) {
        //   const userNotes = JSON.parse(userNotesData);
        //   const filteredList = userNotes.needIt.filter(
        //     (el: any) => el._id === id[0]
        //   );
        //   const filteredNeedItList = userNotes.needIt.filter(
        //     (el: any) => el._id !== id[0]
        //   );
        //   filteredList[0].low = false;
        //   const newNote = {
        //     needIt: [...filteredList, ...filteredNeedItList],
        //     gotIt: [...userNotes.needIt],
        //   };
        //   await AsyncStorage.setItem("userNotes", JSON.stringify(newNote));
        //   setIsLowSelect(false);
        //   setIslow(false);
        //   setSelectedItems([]);
        //   setIsLoading(false);
        //   getAllNotes();
        // }
      } else {
        const userAuthData = await AsyncStorage.getItem("token");
        if (userAuthData) {
          setIsLoading(true);
          const { token, id } = JSON.parse(userAuthData);
          await markGotItNotesNotLow({
            notesID: [notesID],
            token,
            userID: id,
          });
          setIslow(false);
          setIsLowSelect(false);
          setSelectedItems([]);
          setIsLoading(false);
          getAllNotes();
        }
      }
    } catch (error) {
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
      <MyAppbar
        isMenuShown={isMenuItemShown}
        setMenuVisible={setIsMenuItemShown}
      />
      <LoadingIndicator isVisible={isLoading} title="" />
      <PopuptextField
        visible={isPopupTextFieldShown}
        setVisible={setPopupTextFieldShown}
        note={updatedNote.note}
        onChangeText={(text) => setUpdatedNote({ ...updatedNote, note: text })}
        updateNote={updateNode}
      />
      <ImageBackground
        style={styles.backgroundOverlay}
        source={require("../../assets/homebg.png")}
        resizeMode="stretch"
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
                text="Got It!"
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
                      text="Need it!"
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
                      {showBtn ? (
                        // <Pressable
                        //   onPress={() => moveToNeedItList([], true)}
                        //   android_ripple={{ color: "#FFFFFF" }}
                        //   style={{
                        //     marginRight: 10,
                        //     backgroundColor: "#000000",
                        //     borderRadius: 4,
                        //     overflow: "hidden",
                        //     paddingHorizontal: 8,
                        //   }}
                        // >
                        //   <Text
                        //     style={{ textAlign: "center", color: "#FFFFFF" }}
                        //   >
                        //     Need It
                        //   </Text>
                        // </Pressable>
                        <Pressable
                          onPress={() => markNoteAsLow()}
                          android_ripple={{ color: "#FFFFFF" }}
                          style={{
                            marginRight: 10,
                            backgroundColor: "#000000",
                            borderRadius: 4,
                            overflow: "hidden",
                            paddingHorizontal: 8,
                          }}
                        >
                          <Text
                            style={{ textAlign: "center", color: "#FFFFFF" }}
                          >
                            Low
                          </Text>
                        </Pressable>
                      ) : (
                        // <Pressable
                        //   onPress={() => markNoteAsLow()}
                        //   android_ripple={{ color: "#FFFFFF" }}
                        //   style={{
                        //     marginRight: 10,
                        //     backgroundColor: "#000000",
                        //     borderRadius: 4,
                        //     overflow: "hidden",
                        //     paddingHorizontal: 8,
                        //   }}
                        // >
                        //   <Text
                        //     style={{ textAlign: "center", color: "#FFFFFF" }}
                        //   >
                        //     Low
                        //   </Text>
                        // </Pressable>
                        <View />
                      )}
                      <Pressable onPress={deleteItem}>
                        <MaterailIcons name="delete" size={20} />
                      </Pressable>
                    </View>
                  )}
                  <TouchableOpacity
                    style={{
                      paddingTop: (height / fontScale) * 0.1,
                      paddingLeft: 14,
                    }}
                    onPress={() => navigation.navigate("NeedItScreen")}
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
                    style={{ textAlign: "center", paddingTop: height * 0.06 }}
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
                        screenName: "Got It",
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
              <View
                style={{
                  height: heightToDp("50%"),
                  paddingTop: heightToDp("0.8%"),
                }}
              >
                <MyListview
                  data={items}
                  selectedItems={selectedItems}
                  deleteItem={deleteItem}
                  updateNote={handleOnChange}
                  swipeDelete={singleSwipeDelete}
                  setSelectedItems={setSelectedItems}
                  markNoteAsLow={markNoteAsLow}
                  moveToNeedItList={moveToNeedItList}
                  markNoteNotLow={markNoteNotLow}
                  islowSelect={isLowSelect}
                  setLowSelect={setIsLowSelect}
                  moveToGotItList={moveToNeedItList}
                  screenName="GotIt"
                  setMenuItemVisibel={setIsMenuItemShown}
                  clearPrevDataOnSwipe={clearPrevDataOnSwipe}
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
                navigation.navigate("AddItemsScreen", { screenName: "Got It" })
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
                text="Need Something"
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
                  onPress={() => navigation.navigate("NeedItScreen")}
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

export default GotItScreen;

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
        ? heightToDp("75%")
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
