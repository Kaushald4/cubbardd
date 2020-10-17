import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { Platform, StatusBar, StyleSheet, Text, View } from "react-native";

import { DefaultTheme as NavigationTheme } from "@react-navigation/native";
import {
  DefaultTheme as PaperTheme,
  Provider as PaperProvider,
} from "react-native-paper";
import deepMerge from "deepmerge";

import Main from "./src/Main";
import LoadAssets from "./src/LoadAssets";

const myNavigationTheme = {
  ...NavigationTheme,
  colors: {
    ...NavigationTheme.colors,
    primary: "#B0DE4c",
    secondaryColor: "#CEF573",
    accent: "#6c8b23",
  },
};

const myPaperTheme = {
  ...PaperTheme,
  colors: {
    ...PaperTheme.colors,
    primary: "#B0DE4c",
    secondaryColor: "#CEF573",
    accent: "#6c8b23",
  },
};

const combinedTheme = deepMerge(myNavigationTheme, myPaperTheme);

const App = () => {
  return (
    <PaperProvider theme={combinedTheme}>
      <StatusBar translucent />
      <LoadAssets>
        <Main theme={combinedTheme} />
      </LoadAssets>
    </PaperProvider>
  );
};

export default App;

const styles = StyleSheet.create({});
