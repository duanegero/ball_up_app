import { Pressable, StyleSheet, Text } from "react-native";
import type { ThemedButtonProps } from "./types/ThemedButtonProps";

const ThemedButton: React.FC<ThemedButtonProps> = ({
  style,
  children,
  ...props
}) => {
  return (
    <Pressable
      style={({ pressed }) => [styles.btn, pressed && styles.pressed, style]}
      {...props}>
      <Text style={styles.text}>{children}</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#708999",
    padding: 15,
    borderRadius: 4,
    width: "80%",
    textAlign: "center",
    justifyContent: "center",
  },
  text: {
    color: "white",
    fontSize: 16,
    textAlign: "center",
    letterSpacing: 1,
  },
  pressed: {
    opacity: 0.8,
  },
});

export default ThemedButton;
