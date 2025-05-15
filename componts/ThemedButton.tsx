import { Pressable, StyleSheet } from "react-native";
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
      {children}
    </Pressable>
  );
};

const styles = StyleSheet.create({
  btn: {
    backgroundColor: "#708999",
    padding: 15,
    borderRadius: 5,
  },
  pressed: {
    opacity: 0.8,
  },
});

export default ThemedButton;
