import React from "react";
import { ThemedTitleProps } from "./types/ThemedProps";
import { Text, StyleSheet } from "react-native";

const ThemedTitle: React.FC<ThemedTitleProps> = ({ style, children }) => {
  return <Text style={[styles.title, style]}>{children}</Text>;
};

const styles = StyleSheet.create({
  title: {
    fontFamily: "Avenir",
    fontSize: 40,
    fontWeight: "900",
    letterSpacing: 4,
    color: "#708090",
    textAlign: "center",
    justifyContent: "center",
  },
});

export default ThemedTitle;
