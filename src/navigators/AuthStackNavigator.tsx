import React from "react";
import {
  CardStyleInterpolators,
  createStackNavigator,
  TransitionSpecs,
} from "@react-navigation/stack";
import {
  ForgotpassScreen,
  LoginScreen,
  SignupScreen,
  SplashScreen,
} from "../screens";
import AppStackNavigator from "./AppStackNavigator";

export type AuthStackParamList = {
  LoginScreen: undefined;
  SignUpScreen: undefined;
  SplashScreen: undefined;
  ForgotpassScreen: undefined;
  Home: undefined;
};

const AuthStack = createStackNavigator<AuthStackParamList>();

const AuthStackNavigator = () => {
  return (
    <AuthStack.Navigator
      headerMode="none"
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forScaleFromCenterAndroid,
        transitionSpec: {
          open: TransitionSpecs.ScaleFromCenterAndroidSpec,
          close: TransitionSpecs.ScaleFromCenterAndroidSpec,
        },
      }}
    >
      <AuthStack.Screen name="SplashScreen" component={SplashScreen} />
      <AuthStack.Screen name="LoginScreen" component={LoginScreen} />
      <AuthStack.Screen name="SignUpScreen" component={SignupScreen} />
      <AuthStack.Screen name="ForgotpassScreen" component={ForgotpassScreen} />
      <AuthStack.Screen name="Home" component={AppStackNavigator} />
    </AuthStack.Navigator>
  );
};

export default AuthStackNavigator;
