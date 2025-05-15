import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { ThemedContainerProps } from "./types/ThemedButtonProps";

const ThemedContainer: React.FC<ThemedContainerProps> = ({
  style,
  children,
}) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

export default ThemedContainer;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0F5",
    borderRadius: 4,
    padding: 5,
  },
});
