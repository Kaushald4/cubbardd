import React, { useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Dimensions,
  Platform,
  TextInput,
  Pressable,
  StatusBar,
  Alert,
  Keyboard,
} from "react-native";
import { useTheme, Text, Button } from "react-native-paper";
import Svg, { G, Path, SvgXml } from "react-native-svg";
import { Constants } from "react-native-unimodules";
import { Formik, Field } from "formik";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { LoginButton, AccessToken } from "react-native-fbsdk";

import bglayer from "../../assets/bglayer.svg";
import {
  CustomButton,
  FacebookButton,
  Logo,
  MyText,
  LoadingIndicator,
} from "../../components";
import { Props } from "./types";
import {
  heightToDp,
  validateEmail,
  validatePassword,
  widthToDp,
} from "../../utils";
import {
  loginWithEmailAndPassword,
  logInWithFacebook,
  skipAuth,
} from "../../services";
import SimpleToast from "react-native-simple-toast";

const { width, height } = Dimensions.get("window");

const LoginScreen = ({ navigation }: Props) => {
  const theme = useTheme();
  const [isPasswordVisible, setPasswordVisible] = useState(true);
  const [passwordFeedbackVisible, setPasswordFeedbackVisible] = useState(false);
  const [isFromSubmitting, setFormSubmitting] = useState(false);
  const [isFbloading, setFbLoading] = useState(false);

  //facebook signin
  const facebookSignin = async () => {
    setFbLoading(true);
    const user = await logInWithFacebook();
    setFbLoading(false);
    if (user.error) {
      Alert.alert(
        JSON.stringify(user.error),
        "",
        [
          {
            text: "Sign up Now",
            onPress: () => navigation.replace("SignUpScreen"),
          },
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
        ],
        { cancelable: true }
      );
    } else if (user.cancel) {
      setFbLoading(false);
    } else if (user.token) {
      SimpleToast.show("Signed in successfully.");
      navigation.replace("Home");
      console.log(user);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.primary }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />
      <LoadingIndicator
        isVisible={isFromSubmitting || isFbloading}
        title={""}
      />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="interactive"
        showsVerticalScrollIndicator={false}
      >
        <SvgXml xml={bglayer} width={width} style={styles.bgLayer} />

        <View
          style={{
            height:
              Platform.OS === "android"
                ? heightToDp("102%") - Constants.statusBarHeight
                : heightToDp("97%"),
            width,
            justifyContent: "space-between",
          }}
        >
          <View />
          <View style={styles.wrapper}>
            <Logo />
            <MyText
              text="cubbard"
              size={30}
              pt={10}
              color="#FFFFFF"
              ff="Ubuntu-Bold"
            />
            <View style={{ height: heightToDp("4%") }} />

            <View style={styles.formContainer}>
              <Formik
                initialValues={{ email: "", password: "" }}
                validateOnBlur={false}
                validateOnChange={false}
                onSubmit={async (values, actions) => {
                  Keyboard.dismiss();
                  try {
                    actions.setSubmitting(true);
                    setFormSubmitting(true);
                    const user = await loginWithEmailAndPassword({
                      email: values.email.toLowerCase(),
                      password: values.password,
                    });
                    if (user.error) {
                      actions.setSubmitting(false);
                      setFormSubmitting(false);
                      actions.setErrors(user.error);
                    } else if (user.token) {
                      actions.setSubmitting(false);
                      setFormSubmitting(false);
                      SimpleToast.show("Signed in successfully.");
                      navigation.replace("Home");
                    }
                  } catch (error) {
                    console.log("error occured at signup process ", error);
                  }
                  console.log("submited");
                }}
              >
                {({
                  handleChange,
                  handleBlur,
                  handleSubmit,
                  values,
                  errors,
                  isSubmitting,
                }) => {
                  return (
                    <View style={{ position: "relative" }}>
                      {/* <AntDesign
                        name="mail"
                        size={20}
                        color="#494949"
                        style={{
                          top: 20,
                          position: "absolute",
                          zIndex: 1,
                          paddingLeft: 10,
                        }}
                      /> */}
                      <Field
                        name="email"
                        component={TextInput}
                        placeholder="Your Email"
                        onChangeText={handleChange("email")}
                        onBlur={handleBlur("email")}
                        value={values.email}
                        error={errors.email}
                        onFocus={() => (errors.email = undefined)}
                        placeholderTextColor="gray"
                        style={{
                          height: 58,
                          backgroundColor: "#FFFFFF",
                          borderRadius: 5,
                          paddingLeft: 10,
                          maxWidth: width * 0.9,
                          width: widthToDp("75%"),
                        }}
                        disabled={isSubmitting}
                        validate={validateEmail}
                        keyboardType="email-address"
                      />
                      {errors.email && (
                        <Text
                          style={[
                            styles.errorInfo,
                            {
                              color: theme.colors.error,
                              borderColor: theme.colors.error,
                              width: widthToDp("75%"),
                            },
                          ]}
                        >
                          {errors.email}
                        </Text>
                      )}
                      <View style={{ paddingVertical: 4 }} />

                      <View style={{ position: "relative", zIndex: 1 }}>
                        {/* <AntDesign
                          name="key"
                          size={20}
                          color="#494949"
                          style={{
                            top: 20,
                            position: "absolute",
                            zIndex: 1,
                            paddingLeft: 10,
                          }}
                        /> */}
                        <Field
                          name="password"
                          component={TextInput}
                          onChangeText={handleChange("password")}
                          onBlur={handleBlur("password")}
                          value={values.password}
                          placeholder="Password"
                          secureTextEntry={isPasswordVisible}
                          onFocus={() => (errors.password = undefined)}
                          disabled={isSubmitting}
                          error={errors.password}
                          validate={validatePassword}
                          placeholderTextColor="gray"
                          style={{
                            height: 58,
                            paddingRight: 70,
                            backgroundColor: "#FFFFFF",
                            borderRadius: 5,
                            paddingLeft: 10,
                            width: widthToDp("75%"),
                            maxWidth: width * 0.9,
                          }}
                        />
                        <MyText
                          text="Forgotten your password?"
                          color={theme.colors.placeholder}
                          pt={4}
                          ff="Ubuntu-Light"
                          size={12}
                        />
                        <View
                          style={{
                            position: "absolute",
                            right: 14,
                            top: 18,
                            alignItems: "flex-end",
                            zIndex: 1,
                            width: 80,
                          }}
                        >
                          <Pressable
                            style={{
                              position: "absolute",
                              right: 35,
                              zIndex: 889999,
                            }}
                            onPress={() => {
                              setPasswordVisible(!isPasswordVisible);
                            }}
                          >
                            <MaterialIcons
                              name={
                                isPasswordVisible
                                  ? "visibility-off"
                                  : "visibility"
                              }
                              size={24}
                              color={theme.colors.disabled}
                            />
                          </Pressable>
                          <Pressable
                            onPress={() =>
                              setPasswordFeedbackVisible(
                                !passwordFeedbackVisible
                              )
                            }
                          >
                            <AntDesign
                              name="questioncircle"
                              size={24}
                              color={theme.colors.disabled}
                            />
                          </Pressable>
                          {/* password feedback section */}
                          {passwordFeedbackVisible && (
                            <View
                              style={{
                                position: "absolute",
                                width: 250,
                                maxWidth: 250,
                                right: -14,
                                padding: 10,
                                zIndex: 4,
                                top: 50,
                                borderRadius: 8,
                                elevation: 20,
                                backgroundColor: "#FFFFFF",
                              }}
                            >
                              <View
                                style={{
                                  position: "absolute",
                                  zIndex: 4,
                                  right: 5,
                                  top: -20,
                                }}
                              >
                                <Svg
                                  width={40}
                                  height={20}
                                  viewBox="0 0 306 460"
                                >
                                  <G data-name="Polygon 1" fill="#FFFFFF">
                                    <Path d="M305.307 459.5H.693L153 1.584 305.307 459.5z" />
                                  </G>
                                </Svg>
                              </View>
                              <Text
                                style={{
                                  color: theme.colors.placeholder,
                                  lineHeight: 21,
                                }}
                              >
                                Password should contain at least 8 characters,
                                at least 1 uppercase letter, lowercase letter, a
                                number and a special character
                              </Text>
                            </View>
                          )}
                        </View>

                        {errors.password && (
                          <Text
                            style={[
                              styles.errorInfo,
                              {
                                color: theme.colors.error,
                                borderColor: theme.colors.error,
                                width: widthToDp("75%"),
                              },
                            ]}
                          >
                            {errors.password}
                          </Text>
                        )}

                        <CustomButton
                          onPress={handleSubmit}
                          title={isSubmitting ? "Loading...." : "Continue"}
                          loading={isSubmitting}
                          disabled={isSubmitting}
                        />
                        <MyText
                          text="Or..."
                          color={theme.colors.placeholder}
                          size={14}
                          pt={18}
                          pb={4}
                        />
                        <FacebookButton
                          title="Sign in with Facebook"
                          onPress={facebookSignin}
                          disabled={isSubmitting}
                          // loading={isFBsignup}
                        />

                        <MyText
                          text="We will never post anything without your permission"
                          size={13}
                          pt={10}
                          ff="Ubuntu-Light"
                          color={theme.colors.placeholder}
                        />
                      </View>
                    </View>
                  );
                }}
              </Formik>
            </View>
          </View>
          <View style={styles.bottomButton}>
            <Button
              uppercase={false}
              onPress={() => navigation.replace("SignUpScreen")}
            >
              <MyText
                text="Sign up"
                color="#FFFFFF"
                size={18}
                ff="Ubuntu-Bold"
              />
            </Button>
            <Button uppercase={false} onPress={() => skipAuth(navigation)}>
              <MyText text="Skip" color="#FFFFFF" size={18} ff="Ubuntu-Bold" />
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bgLayer: {
    position: "absolute",
    top:
      Platform.OS === "android"
        ? -width * 0.99 + Constants.statusBarHeight
        : -width * 0.95,
  },
  wrapper: {
    justifyContent: "center",
    alignItems: "center",
    flex: 5,
  },
  formContainer: {
    // marginTop: heightToDp("5%"),
    // marginBottom: heightToDp("9%"),
  },
  bottomButton: {
    flexDirection: "row",
    paddingBottom: Platform.OS === "android" ? 0 : 0,
    justifyContent: "space-between",
    // flex: 0.5,
  },
  errorInfo: {
    fontSize: 13,
    backgroundColor: "#f7b2b3",
    borderRadius: 3,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginTop: 2,
  },
});
