import React from "react";
import { Text, TextStyle, StyleSheet, View } from "react-native";
import { ThemedCircleProps } from "./types/ThemedProps";

const ThemedCircle: React.FC<ThemedCircleProps> = ({
  value,
  style,
  textStyle,
}) => {
  return (
    <View style={[styles.circle]}>
      <Text style={[styles.text, textStyle]}>{value}</Text>
    </View>
  );
};

export default ThemedCircle;

const styles = StyleSheet.create({
  circle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#708090",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    borderWidth: 2,
    borderColor: "white",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
