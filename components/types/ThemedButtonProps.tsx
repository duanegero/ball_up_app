import { TextInputProps } from "react-native";

export type ThemedButtonProps = {
  style?: any;
  onPress?: () => void;
  children?: React.ReactNode;
};

export type ThemedTextInputProps = TextInputProps & {
  style?: object;
};
