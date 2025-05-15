import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  Touchable,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { Link } from "expo-router";
import ThemedButton from "../../componts/ThemedButton";
import ThemedTextInput from "../../componts/ThemedTextInput";
import { useState } from "react";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const handleSubmit = () => {
    console.log("Sign Up Pressed", email, password, username);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Sign Up</Text>

        <ThemedTextInput
          style={{ width: "80%", marginBottom: 20 }}
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
        />

        <ThemedTextInput
          style={{ width: "80%", marginBottom: 20 }}
          placeholder="Email"
          onChangeText={setEmail}
          value={email}
        />

        <ThemedTextInput
          style={{ width: "80%", marginBottom: 20 }}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />

        <ThemedButton onPress={handleSubmit}>
          <Text style={{ color: "white" }}>Sign Up</Text>
        </ThemedButton>

        <Link href={"/login"} style={styles.link}>
          Login Page
        </Link>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default SignUp;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF0F5",
    borderRadius: 4,
    padding: 5,
  },
  title: {
    fontFamily: "Roboto",
    fontSize: 28,
    fontWeight: "bold",
    letterSpacing: 3,
    color: "#708090",
  },
  link: {
    marginVertical: 10,
    borderBottomWidth: 1,
  },
  btn: {
    backgroundColor: "#708999",
    padding: 15,
    borderRadius: 5,
  },
  pressed: {
    opacity: 0.8,
  },
});
