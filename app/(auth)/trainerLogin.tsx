import {
  StyleSheet,
  Text,
  View,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Link, useRouter } from "expo-router";
import ThemedContainer from "../../components/ThemedContainer";
import ThemedButton from "../../components/ThemedButton";
import ThemedTextInput from "../../components/ThemedTextInput";
import ThemedTitle from "../../components/ThemedTitle";
import ThemedLink from "../../components/ThemedLink";
import { useState } from "react";
import api from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spacer from "../../components/Spacer";

const TrainerLogin = () => {
  const router = useRouter();

  //state variables
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  //async function called on submit
  const handleSubmit = async (): Promise<void> => {
    try {
      //variable to handle api response
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
      //variables to handle data returned
      const {
        token,
        username: loggedInUsername,
        trainer_user_id,
      } = response.data;

      //storing token
      await AsyncStorage.setItem("trainerToken", token);

      await AsyncStorage.setItem("trainerId", trainer_user_id.toString());

      //alert user success
      Alert.alert("Login Successful", `Welcome ${loggedInUsername}!`);

      //take user to profile screen
      router.push({
        pathname: "/trainerProfile",
      });

      //set state variables
      setUsername("");
      setPassword("");
    } catch (error: any) {
      //catch log and alert any errors
      console.error("Login error:", error);
      const message =
        error.response?.data?.message || "An error occurred during login.";
      Alert.alert("Login Failed", message);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ThemedContainer>
        <ThemedTitle>Trainer Access Portal</ThemedTitle>

        <Spacer height={40} />

        <ThemedTextInput
          style={{ width: "80%", marginBottom: 20 }}
          placeholder="Username"
          onChangeText={setUsername}
          value={username}
          autoCapitalize="none"
        />

        <ThemedTextInput
          style={{ width: "80%", marginBottom: 20 }}
          placeholder="Password"
          onChangeText={setPassword}
          value={password}
          secureTextEntry
        />

        <ThemedButton onPress={handleSubmit}>
          <Text>Login</Text>
        </ThemedButton>
        <Spacer height={60} />
        <ThemedLink href={"/trainerSignUp"}>Sign Up</ThemedLink>
      </ThemedContainer>
    </TouchableWithoutFeedback>
  );
};

export default TrainerLogin;
const styles = StyleSheet.create({});
