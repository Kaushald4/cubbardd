import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, useTheme } from "react-native-paper";

interface Props {
  title: string;
  loading?: boolean;
  onPress: () => void;
  disabled?: boolean;
}

const CustomButton = ({ onPress, title, loading, disabled }: Props) => {
  const theme = useTheme();

  return (
    <Button
      onPress={onPress}
      color={theme.colors.background}
      contentStyle={{ height: 55 }}
      uppercase={false}
      loading={loading}
      disabled={disabled}
      style={[styles.button, { backgroundColor: theme.colors.accent }]}
    >
      {title}
    </Button>
  );
};

export default CustomButton;

const styles = StyleSheet.create({
  button: {
    marginTop: 20,
  },
});
