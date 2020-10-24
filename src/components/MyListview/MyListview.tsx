import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableHighlight,
  View,
  LayoutAnimation,
  Dimensions,
  Platform,
  Pressable,
  UIManager,
} from "react-native";
import { Constants } from "react-native-unimodules";
import MaterailIcons from "react-native-vector-icons/MaterialIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import {
  SwipeGestureEndedData,
  SwipeListView,
} from "react-native-swipe-list-view";
import { useTheme } from "react-native-paper";

const { width, height, fontScale } = Dimensions.get("window");

if (Platform.OS === "android") {
  if (UIManager.setLayoutAnimationEnabledExperimental) {
    UIManager.setLayoutAnimationEnabledExperimental(true);
  }
}

interface Props {
  data: [];
  selectedItems: any;
  setSelectedItems: any;
  deleteItem: () => void;
  swipeDelete: (id?: string) => Promise<void>;
  updateNote: (
    prevNote: string | undefined,
    id: string | undefined
  ) => Promise<void>;
  moveToGotItList?: (
    id: Array<any>,
    low: boolean,
    isTapped: boolean
  ) => Promise<void>;
  moveToNeedItList?: (
    id: Array<any>,
    low: boolean,
    isTapped: boolean
  ) => Promise<void>;
  markNoteAsLow: () => Promise<void>;
  islowSelect: boolean;
  screenName: "NeedIt" | "GotIt";
  setMenuItemVisibel: (b: boolean) => void;
  clearPrevDataOnSwipe: (id: string) => void;
  setLowSelect: (b: boolean) => void;
  setIsLow: (b: boolean) => void;
  isLow: boolean;
}

export default function MyListView({
  data,
  selectedItems,
  setSelectedItems,
  deleteItem,
  swipeDelete,
  updateNote,
  moveToGotItList,
  markNoteAsLow,
  islowSelect,
  screenName,
  moveToNeedItList,
  setMenuItemVisibel,
  clearPrevDataOnSwipe,
  setLowSelect,
  setIsLow,
  isLow,
}: Props) {
  const theme = useTheme();
  const [listData, setListData] = useState(data);

  useEffect(() => {
    setListData(data);
  }, [data, islowSelect, selectedItems]);

  useEffect(() => {
    let low = false;
    selectedItems.forEach((e) => {
      if (e.low) {
        low = true;
      } else {
        low = false;
      }
    });
    if (low) {
      setLowSelect(true);
    }
  }, [selectedItems]);

  const closeRow = (
    rowMap: any,
    rowKey: any,
    action: "edit" | "remove" | "gotIt" | "needIt" | "close",
    data?: string
  ) => {
    if (action === "close") {
      if (rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
      }
    } else if (action === "edit") {
      updateNote(data, rowKey);
      rowMap[rowKey].closeRow(); //for closing row
    }
  };

  const deleteRow = async (rowMap: any, rowKey: any) => {
    await swipeDelete(rowKey);
    closeRow(rowMap, rowKey, "close");
    const newData = [...listData];
    const prevIndex = listData.findIndex((item) => item._id === rowKey);
    newData.splice(prevIndex, 1);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    setListData(newData);
  };

  // const onRowDidOpen = (rowKey: any) => {
  //   console.log("This row opened", rowKey);
  // };

  const onSelectHandle = (id: number) => {
    let renderData = [...listData];
    for (let data of renderData) {
      if (data._id == id) {
        data.selected = data.selected == null ? true : !data.selected;
        break;
      }
    }
    setListData(renderData);

    const selectedData = listData.filter((d) => d.selected);
    setSelectedItems(selectedData);
  };

  const renderItem = (data: any, rowMap: any) => {
    const opacity = selectedItems.length >= 1 && !data.item.selected ? 0.5 : 1;
    let backgroundColor;
    if (
      // islowSelect &&
      // selectedItems.length > 0 &&
      // data.item.selected &&
      data.item.low
    ) {
      backgroundColor = "rgb(204,235,255)";
    } else {
      backgroundColor = "#FFFFFF";
    }

    return (
      <Pressable
        android_ripple={{ color: theme.colors.primary }}
        onPress={() => onSelectHandle(data.item._id)}
        onLongPress={() => updateNote(data.item.note, data.item._id)}
        style={[
          styles.rowFront,
          { opacity },
          {
            backgroundColor,
            // display: swipedListID === data.item._id ? "none" : "flex",
          },
        ]}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                height: 20,
                width: 20,
                borderRadius: 100,
                borderWidth: 1,
                borderColor: "#cccccc",
                marginRight: 8,
                position: "relative",
              }}
            />
            {data.item.selected && (
              <MaterailIcons
                name="check-circle"
                size={20}
                style={{
                  position: "absolute",
                }}
              />
            )}
            <Text> {data.item.note.slice(0, 30)} </Text>
          </View>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {data.item.low ? (
              // <Pressable
              //   onPress={async () =>
              //     await moveToGotItList([data.item._id], true)
              //   }
              // >
              //   <Text
              //     style={{
              //       marginRight: 10,
              //       // backgroundColor: theme.colors.primary,
              //       paddingHorizontal: 8,
              //       color: "#FFFFFF",
              //       textAlign: "center",
              //       display:
              //         data.item.selected && selectedItems.length <= 1
              //           ? "flex"
              //           : "none",
              //     }}
              //   >
              //     <FontAwesome
              //       name="share"
              //       size={25}
              //       color={theme.colors.primary}
              //     />
              //   </Text>
              // </Pressable>
              <View />
            ) : (
              <Pressable
                onPress={async () => {
                  data.item.low = true;
                  await markNoteAsLow();
                }}
              >
                <Text
                  style={{
                    marginRight: 10,
                    backgroundColor: theme.colors.primary,
                    paddingHorizontal: 8,
                    color: "#FFFFFF",
                    textAlign: "center",
                    display:
                      data.item.selected && selectedItems.length <= 1
                        ? "flex"
                        : "none",
                  }}
                >
                  Low
                </Text>
              </Pressable>
            )}
            <Pressable
              onPress={deleteItem}
              style={{
                display:
                  data.item.selected && selectedItems.length <= 1
                    ? "flex"
                    : "none",
              }}
            >
              <MaterailIcons
                name="delete"
                size={25}
                color={theme.colors.primary}
              />
            </Pressable>
          </View>
        </View>
      </Pressable>
    );
  };

  const onSwipeEnd = async (id: string, Swipedata: SwipeGestureEndedData) => {
    const swipedItem = listData.filter((el) => el._id === id);
    if (Swipedata.translateX >= width * 0.2) {
      if (screenName === "NeedIt") {
        await moveToGotItList([id], swipedItem[0].low, false);
        clearPrevDataOnSwipe(id);
      } else if (screenName === "GotIt") {
        await moveToNeedItList([id], swipedItem[0].low, false);
        clearPrevDataOnSwipe(id);
      }
    } else if (Swipedata.translateX <= -width * 0.2) {
      if (screenName === "NeedIt") {
        await moveToGotItList([id], swipedItem[0].low, false);
        clearPrevDataOnSwipe(id);
      } else if (screenName === "GotIt") {
        await moveToNeedItList([id], swipedItem[0].low, false);
        clearPrevDataOnSwipe(id);
      }
    }
  };

  const renderHiddenItem = (data: any, rowMap: any) => (
    <View
      style={[
        styles.rowBack,
        { display: selectedItems.length > 0 ? "none" : "flex" },
      ]}
    >
      <View style={{ marginVertical: -8.7, flexDirection: "row" }}>
        <TouchableOpacity
          onPress={() => {
            setMenuItemVisibel(false);
            closeRow(rowMap, data.item._id, "edit", data.item.note);
          }}
          style={{ justifyContent: "center", alignItems: "center" }}
        >
          <MaterailIcons
            name="edit"
            size={18}
            color={theme.colors.notification}
            style={styles.backTextWhite}
          />
          <Text
            style={[
              { color: "#FFFFFF" },
              {
                fontSize:
                  (height - Constants.statusBarHeight / fontScale) * 0.015,
                paddingLeft: -4,
              },
            ]}
          >
            Edit
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => deleteRow(rowMap, data.item._id)}
          style={{
            marginLeft: 40,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <MaterailIcons
            name="delete"
            size={18}
            color={theme.colors.notification}
            style={styles.backTextWhite}
          />
          <Text
            style={[
              styles.backTextWhite,
              {
                fontSize:
                  (height - Constants.statusBarHeight / fontScale) * 0.015,
              },
            ]}
          >
            Remove
          </Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnLeft]}
        onPress={() => closeRow(rowMap, data.item._id, "close")}
      >
        <MaterailIcons
          name="cancel"
          size={18}
          color={theme.colors.notification}
          style={styles.backTextWhite}
        />
        <Text
          style={[
            styles.backTextWhite,
            {
              fontSize:
                (height - Constants.statusBarHeight / fontScale) * 0.015,
            },
          ]}
        >
          Close
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[styles.backRightBtn, styles.backRightBtnRight]}
        onPress={async () => {
          if (screenName === "GotIt") {
            await moveToNeedItList([data.item._id], false);
            deleteRow(rowMap, data.item._id);
          } else if (screenName === "NeedIt") {
            await moveToGotIt([data.item._id], false);
            deleteRow(rowMap, data.item._id);
          }
        }}
      >
        <FontAwesome
          name="share"
          size={18}
          color={theme.colors.notification}
          style={styles.backTextWhite}
        />
        <Text
          style={[
            styles.backTextWhite,
            {
              fontSize:
                (height - Constants.statusBarHeight / fontScale) * 0.015,
            },
          ]}
        >
          {screenName === "GotIt" ? "Need It" : "Got it"}
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <SwipeListView
        data={listData}
        renderItem={renderItem}
        renderHiddenItem={() => <View />}
        leftOpenValue={150}
        rightOpenValue={-150}
        nestedScrollEnabled
        previewRowKey={"0"}
        // previewOpenValue={-40}
        // previewOpenDelay={3000}
        // stopLeftSwipe={width * 0.4}
        // stopRightSwipe={-width * 0.4}
        // onRowDidOpen={onRowDidOpen}
        keyExtractor={(item, index) => `${item._id}`}
        disableLeftSwipe={selectedItems.length > 0 ? true : false}
        disableRightSwipe={selectedItems.length > 0 ? true : false}
        swipeGestureEnded={onSwipeEnd}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%",
  },
  backTextWhite: {
    color: "#FFF",
  },
  rowFront: {
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 20,
    paddingVertical: Platform.OS === "android" ? 19 : 18,
    marginVertical: 2,
    marginHorizontal: 20,
    borderRadius: 5,
    overflow: "hidden",
  },
  rowBack: {
    backgroundColor: "#6c8b23",
    paddingHorizontal: 20,
    paddingVertical: 20,
    marginVertical: 2,
    marginHorizontal: 20,
    borderRadius: 5,
    overflow: "hidden",
  },
  backRightBtn: {
    alignItems: "center",
    bottom: 0,
    justifyContent: "center",
    position: "absolute",
    top: 0,
    width: 75,
    borderRadius: 5,
  },
  backRightBtnLeft: {
    backgroundColor: "#6c8b23",
    right: 75,
    fontSize: 12,
  },
  backRightBtnRight: {
    backgroundColor: "#6c8b23",
    right: 0,
    fontSize: 14,
  },
});
