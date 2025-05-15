import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Alert,
  TextInput,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Link } from "expo-router";
import ThemedButton from "../../componts/ThemedButton";
import ThemedTextInput from "../../componts/ThemedTextInput";
import { useState } from "react";
import api from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TrainerLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (): Promise<void> => {
    try {
      const response: {
        data: {
          token: string;
          username: string;
          trainer_user_id: number;
        };
      } = await api.post("/trainer_login", {
        username,
        password,
      });
      const {
        token,
        username: loggedInUsername,
        trainer_user_id,
      } = response.data;

      await AsyncStorage.setItem("trainerToken", token);

      Alert.alert("Login Successful", `Welcome ${loggedInUsername}!`);

      setUsername("");
      setPassword("");
    } catch (error: any) {
      console.error("Login error:", error);
      const message =
        error.response?.data?.message || "An error occurred during login.";
      Alert.alert("Login Failed", message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.title}>Login</Text>

        <ThemedTextInput
          style={{ width: "80%", marginBottom: 20 }}
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
        />

        <ThemedTextInput
          style={{ width: "80%", marginBottom: 20 }}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />

        <ThemedButton onPress={handleSubmit}>
          <Text style={{ color: "white" }}>Login</Text>
        </ThemedButton>

        <Link href={"/signUp"} style={styles.link}>
          Sign Up Page
        </Link>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default TrainerLogin;
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
