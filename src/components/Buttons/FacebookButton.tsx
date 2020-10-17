import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, useTheme } from "react-native-paper";
import Icon from "react-native-vector-icons/Entypo";
import { widthToDp } from "../../utils";

interface Props {
  title: string;
  onPress: () => void;
  loading?: boolean;
  disabled?: boolean;
}

const FacebookButton = ({ onPress, title, loading, disabled }: Props) => {
  const theme = useTheme();

  return (
    <Button
      mode="contained"
      color={"#3c5998"}
      onPress={onPress}
      uppercase={false}
      contentStyle={styles.facebookButton}
      loading={loading}
      disabled={disabled}
      icon={() => (
        <Icon name="facebook-with-circle" size={24} color={"#FFFFFF"} />
      )}
      style={styles.facebookButton}
    >
      <Text style={{ color: "#FFFFFF" }}> {title} </Text>
    </Button>
  );
};

export default FacebookButton;

const styles = StyleSheet.create({
  facebookButton: {
    height: 55,
    width: widthToDp("75%"),
  },
});
