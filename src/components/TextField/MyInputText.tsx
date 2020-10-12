import React from "react";
import { StyleSheet, Text, View, TextInputProps } from "react-native";
import { TextInput } from "react-native-paper";

interface Props {
  placeholder: string;
  onChangeText: (e: string) => void;
  error: { email: string; password: any };
}

const MyInputText = ({ onChangeText, placeholder, error }: Props) => {
  return (
    <TextInput
      style={styles.input}
      placeholder={placeholder}
      onChangeText={onChangeText}
      mode="outlined"
    />
  );
};

export default MyInputText;

const styles = StyleSheet.create({
  input: {},
});
