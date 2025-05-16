import {
  StyleSheet,
  Text,
  View,
  Alert,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import { Link } from "expo-router";
import ThemedContainer from "../../components/ThemedContainer";
import ThemedButton from "../../components/ThemedButton";
import ThemedTextInput from "../../components/ThemedTextInput";
import ThemedTitle from "../../components/ThemedTitle";
import ThemedLink from "../../components/ThemedLink";
import { useState } from "react";
import api from "../../utils/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Spacer from "../../components/Spacer";

const AthleteLogin = () => {
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
          athlete_user_id: number;
        };
      } = await api.post("/athlete_login", {
        username,
        password,
      });
      //variables to handle data returned
      const {
        token,
        username: loggedInUsername,
        athlete_user_id,
      } = response.data;

      //storing token
      await AsyncStorage.setItem("athleteToken", token);

      //alert user success
      Alert.alert("Login Successful", `Welcome ${loggedInUsername}!`);

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
        <ThemedTitle>Athlete Access Point</ThemedTitle>

        <Spacer height={80} />

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
          <Text>Login</Text>
        </ThemedButton>

        <ThemedLink href={"/"}>Home</ThemedLink>

        {/* <Link href={"/signUp"} style={styles.link}>
          Sign Up Page
        </Link> */}
      </ThemedContainer>
    </TouchableWithoutFeedback>
  );
};

export default AthleteLogin;

const styles = StyleSheet.create({});
