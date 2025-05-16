import { TextInputProps, ViewStyle, TextStyle } from "react-native";

export type ThemedButtonProps = {
  style?: any;
  onPress?: () => void;
  children?: React.ReactNode;
};

export type ThemedTextInputProps = TextInputProps & {
  style?: object;
};

export type ThemedContainerProps = {
  style?: ViewStyle | ViewStyle[];
  children?: React.ReactNode;
};

export type ThemedTitleProps = {
  style?: TextStyle | TextStyle[];
  children?: React.ReactNode;
};

export type ThemedLinkProps = {
  href: string;
  style?: TextStyle | ViewStyle | (TextStyle | ViewStyle)[];
  children: React.ReactNode;
};
