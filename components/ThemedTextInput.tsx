import { TextInput, StyleSheet } from "react-native";
import { ThemedTextInputProps } from "./types/ThemedProps";

const ThemedTextInput: React.FC<ThemedTextInputProps> = ({
  style,
  ...props
}) => {
  return (
    <TextInput
      style={[styles.input, style]}
      placeholderTextColor="gray"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: "white",
    color: "black",
    padding: 20,
    borderRadius: 6,
  },
});

export default ThemedTextInput;
