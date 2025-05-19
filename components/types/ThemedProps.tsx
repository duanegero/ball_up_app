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

export type ThemedTextProps = {
  style?: TextStyle | TextStyle[];
  children?: React.ReactNode;
  numberOfLines?: number;
  ellipsizeMode?: "head" | "middle" | "tail" | "clip";
};

export type ThemedCircleProps = {
  value: string | number;
  style?: ViewStyle;
  textStyle?: TextStyle;
};

export type ThemedLableProps = {
  style?: TextStyle | TextStyle[];
  children?: React.ReactNode;
};
