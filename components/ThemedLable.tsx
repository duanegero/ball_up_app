import React from "react";
import { Text, StyleSheet } from "react-native";
import { ThemedLableProps } from "./types/ThemedProps";

const ThemedLable: React.FC<ThemedLableProps> = ({ style, children }) => {
  return <Text style={[styles.lable, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  lable: {
    fontFamily: "Avenir",
    fontWeight: "bold",
    fontSize: 24,
    color: "#708090",
    letterSpacing: 2,
    marginVertical: 10,
    borderBottomWidth: 2,
    paddingHorizontal: 10,
    borderColor: "#708090",
  },
});

export default ThemedLable;
