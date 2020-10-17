import React from "react";
import { StyleSheet, Text, View, Image, Dimensions } from "react-native";
import { widthToDp } from "../../utils";

const { height, width } = Dimensions.get("screen");

const Logo = () => {
  return (
    <View
      style={{
        backgroundColor: "#FFFFFF",
        width: widthToDp("34%"),
        height: widthToDp("34%"),
        borderRadius: 500,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View style={{ width: 80, height: 68 }}>
        <Image
          source={require("../../assets/Logo.png")}
          style={{ height: "100%", width: "100%" }}
        />
      </View>
    </View>
  );
};

export default Logo;

const styles = StyleSheet.create({});
