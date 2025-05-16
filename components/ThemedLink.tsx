import React from "react";
import { Link } from "expo-router";
import { ThemedLinkProps } from "./types/ThemedProps";
import { Text, StyleSheet } from "react-native";

const ThemedLink: React.FC<ThemedLinkProps> = ({ href, children, style }) => {
  return (
    <Link href={href} style={[styles.link, style]}>
      <Text style={[styles.linkText]}>{children}</Text>
    </Link>
  );
};

const styles = StyleSheet.create({
  link: {
    marginVertical: 10,
    borderBottomWidth: 1,
    paddingHorizontal: 10,
  },
  linkText: {
    fontSize: 20,
    fontWeight: "400",
    fontFamily: "Avenir",
    letterSpacing: 3,
    textTransform: "uppercase",
    textAlign: "center",
  },
});

export default ThemedLink;
