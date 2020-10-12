import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import {
  BallIndicator,
  BarIndicator,
  DotIndicator,
  MaterialIndicator,
  PacmanIndicator,
  PulseIndicator,
  SkypeIndicator,
  UIActivityIndicator,
  WaveIndicator,
} from "react-native-indicators";

const { width, height } = Dimensions.get("window");

interface Props {
  title?: string;
  color?: string;
  isVisible: boolean;
}

const LoadingIndicator = ({ title, color = "#FFFFFF", isVisible }: Props) => {
  return (
    <>
      {isVisible && (
        <View
          style={{
            position: "absolute",
            height: height * 1.5,
            width,
            justifyContent: "center",
            alignItems: "center",
            zIndex: 99999999,
            backgroundColor: "rgba(0,0,0,.7)",
          }}
        >
          <PacmanIndicator
            color={color}
            style={{ position: "absolute", top: height / 2.14 }}
            size={80}
          />
          <Text
            style={{
              color: "#FFFFFF",
              fontSize: 17,
              position: "absolute",
              top: height / 2,
              paddingTop: 40,
            }}
          >
            {" "}
            {title}{" "}
          </Text>
        </View>
      )}
    </>
  );
};

export default LoadingIndicator;

const styles = StyleSheet.create({});
