import React from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
  TransitionSpecs,
} from "@react-navigation/stack";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NeedItScreen, GotItScreen } from "../screens";
import AddItemScreen from "../screens/AddItemScreen/AddItemScreen";
import { Platform, View } from "react-native";

export type AppStackParamList = {
  NeedItScreen: undefined;
  GotItScreen: undefined;
  AddItemsScreen: { screenName: "Got It" | "Need It" };
};

const AppStack = createStackNavigator<AppStackParamList>();

const AppStackNavigator = () => {
  return (
    <AppStack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyleInterpolator:
          Platform.OS === "android"
            ? CardStyleInterpolators.forScaleFromCenterAndroid
            : CardStyleInterpolators.forHorizontalIOS,
        transitionSpec: {
          open:
            Platform.OS === "android"
              ? TransitionSpecs.ScaleFromCenterAndroidSpec
              : TransitionSpecs.TransitionIOSSpec,
          close:
            Platform.OS === "android"
              ? TransitionSpecs.ScaleFromCenterAndroidSpec
              : TransitionSpecs.TransitionIOSSpec,
        },
      }}
    >
      <AppStack.Screen name="NeedItScreen" component={NeedItScreen} />
      <AppStack.Screen name="GotItScreen" component={GotItScreen} />
      <AppStack.Screen name="AddItemsScreen" component={AddItemScreen} />
    </AppStack.Navigator>
  );
};

export default AppStackNavigator;
