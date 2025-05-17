import React from "react";
import { Text, TextStyle, StyleSheet } from "react-native";
import { ThemedTextProps } from "./types/ThemedProps";

const ThemedText: React.FC<ThemedTextProps> = ({
  style,
  children,
  numberOfLines,
  ellipsizeMode,
}) => {
  return (
    <Text
      style={[styles.text, style]}
      numberOfLines={numberOfLines}
      ellipsizeMode={ellipsizeMode}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: "#708090",
    fontFamily: "Avenir",
    letterSpacing: 1,
  },
});

export default ThemedText;
