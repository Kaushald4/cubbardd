import React, { useEffect, useRef } from "react";
import {
  Pressable,
  StyleSheet,
  View,
  TextInput,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Button, useTheme } from "react-native-paper";
import Fontawesome from "react-native-vector-icons/FontAwesome";
import { Constants } from "react-native-unimodules";
import { useNavigation } from "@react-navigation/native";

interface Props {
  visible: Boolean;
  setVisible: any;
  onChangeText: (e: string) => void;
  note: string;
  updateNote: () => void;
}

const { width, height } = Dimensions.get("window");

const PopuptextField = ({
  setVisible,
  visible,
  onChangeText,
  note,
  updateNote,
}: Props) => {
  const theme = useTheme();
  const inputRef = useRef<any>();

  useEffect(() => {
    if (visible) {
      inputRef.current.focus();
    }
  }, [visible]);

  return (
    <>
      {visible && (
        <View
          style={{
            backgroundColor: "rgba(0,0,0,.9)",
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === "android" ? "height" : "padding"}
          >
            <View style={{ height, position: "relative" }}>
              <View
                style={{
                  width: width * 0.8,
                  height: width * 0.3,
                  backgroundColor: "#FFFFFF",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 10,
                  //   elevation: 40,
                  shadowColor: "rgba(0,0,0,.8)",
                  shadowOpacity: 0.2,
                  zIndex: 9999,
                  top:
                    Platform.OS === "android"
                      ? height / 2 - Constants.statusBarHeight
                      : height / 2,
                  shadowRadius: 10,
                  shadowOffset: { height: 0, width: 0 },
                }}
              >
                <View style={{ position: "relative" }}>
                  <TextInput
                    placeholder={note}
                    ref={inputRef}
                    style={{
                      backgroundColor: "#FFFFFF",
                      borderRadius: 5,
                      paddingHorizontal: 10,
                      paddingRight: 50,
                      paddingVertical: 18,
                      width: width * 0.78,
                    }}
                    onChangeText={onChangeText}
                    value={note}
                  />
                  <Pressable
                    style={{
                      position: "absolute",
                      right: 20,
                      top: 14,
                    }}
                    onPress={updateNote}
                  >
                    <Fontawesome
                      name="check-circle"
                      color={
                        note.length >= 4
                          ? theme.colors.primary
                          : theme.colors.disabled
                      }
                      size={28}
                    />
                  </Pressable>
                </View>

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "flex-end",
                  }}
                >
                  <Button
                    color={theme.colors.accent}
                    onPress={() => updateNote()}
                  >
                    Update
                  </Button>
                  <Button
                    color={theme.colors.accent}
                    onPress={() => setVisible(false)}
                  >
                    Cancel
                  </Button>
                </View>
              </View>
            </View>
          </KeyboardAvoidingView>
        </View>
      )}
    </>
  );
};

export default PopuptextField;

const styles = StyleSheet.create({});
