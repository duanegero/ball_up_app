import {
  StyleSheet,
  Text,
  Alert,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Link, useRouter } from "expo-router";
import ThemedContainer from "../../components/ThemedContainer";
import ThemedTitle from "../../components/ThemedTitle";
import ThemedButton from "../../components/ThemedButton";
import ThemedTextInput from "../../components/ThemedTextInput";
import ThemedLink from "../../components/ThemedLink";
import { useState } from "react";
import Spacer from "../../components/Spacer";
import api from "../../utils/api";

const AthleteSignUp = () => {
  const router = useRouter();

  //state variables
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [age, setAge] = useState("");
  const [level, setLevel] = useState("");

  //helper to handle submit button
  const handleSubmit = async (): Promise<void> => {
    //make strings a number
    const age_number = parseInt(age, 10);
    const level_number = parseInt(level, 10);

    try {
      //variable to handle response from api with expected data
      const response: {
        data: {
          message: string;
          username: string;
        };
      } = await api.post("/athletes", {
        email,
        username,
        password,
        first_name,
        last_name,
        age: age_number,
        level: level_number,
      });

      //variables from response
      const { message, username: signedUpUsername } = response.data;

      //alert user and navigate to login
      Alert.alert(`${message} Username: ${signedUpUsername}`, "", [
        {
          text: "OK",
          onPress: () => router.replace("/athleteLogin"),
        },
      ]);

      //clear the inputs
      setEmail("");
      setUsername("");
      setPassword("");
      setFirst_name("");
      setLast_name("");
      setAge("");
      setLevel("");
    } catch (error: any) {
      //catch log and alert any errors
      console.error("Sign up error:", error);
      const message =
        error.response?.data?.message || "An error occurred during sign up.";
      Alert.alert("Sign Up Failed", message);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled">
          <ThemedContainer>
            <ThemedTitle>Sign Up</ThemedTitle>

            <Spacer height={20} />

            <ThemedTextInput
              style={{ width: "80%", marginBottom: 20 }}
              placeholder="Email"
              onChangeText={setEmail}
              value={email}
              keyboardType="email-address"
              autoCapitalize="none"
            />

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

            <ThemedTextInput
              style={{ width: "80%", marginBottom: 20 }}
              placeholder="Firstname"
              onChangeText={setFirst_name}
              value={first_name}
              autoCapitalize="words"
            />

            <ThemedTextInput
              style={{ width: "80%", marginBottom: 20 }}
              placeholder="Lastname"
              onChangeText={setLast_name}
              value={last_name}
              autoCapitalize="words"
            />

            <ThemedTextInput
              style={{ width: "80%", marginBottom: 20 }}
              placeholder="Age"
              onChangeText={setAge}
              value={age}
              keyboardType="numeric"
            />

            <ThemedTextInput
              style={{ width: "80%", marginBottom: 20 }}
              placeholder="Level"
              onChangeText={setLevel}
              value={level}
              keyboardType="numeric"
            />

            <ThemedButton onPress={handleSubmit}>
              <Text style={{ color: "white" }}>Sign Up</Text>
            </ThemedButton>

            {/* <Link href={"/login"} style={styles.link}>
          Login Page
        </Link> */}
          </ThemedContainer>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AthleteSignUp;
const styles = StyleSheet.create({});
