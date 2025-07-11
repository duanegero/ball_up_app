//imports to use in the app
import {
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { signUpTrainer } from "../../utils/apiServices";
import { styles } from "../../styles/trainerSignUp.styles";

const TrainerSignUp = () => {
  //instance of router
  const router = useRouter();

  //useState variables
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [years_experience, setYears_experience] = useState("");
  const [bio, setBio] = useState("");
  const [submitting, setSubmitting] = useState(false);

  //async function to handle submit pressable
  const handleSubmit = async (): Promise<void> => {
    if (submitting) return;

    //object to handle form data
    const formData = {
      email: email.trim(),
      username: username.trim(),
      password: password.trim(),
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      years_experience: parseInt(years_experience.trim(), 10),
      bio: bio.trim(),
    };

    //checks on the data
    if (
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.first_name ||
      !formData.last_name ||
      isNaN(formData.years_experience) ||
      !formData.bio
    ) {
      Alert.alert("All fields are required and must be valid.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert("Invalid email format.");
      return;
    }
    if (formData.years_experience < 0 || formData.years_experience > 80) {
      Alert.alert("Please enter a valid number of years (0–80).");
      return;
    }

    Keyboard.dismiss();
    setSubmitting(true);

    try {
      const response = await signUpTrainer(formData);

      const { message, username: signedUpUsername } = response;

      Alert.alert(`${message} Username: ${signedUpUsername}`, "", [
        {
          text: "OK",
          onPress: () => router.replace("/trainerLogin"),
        },
      ]);

      setEmail("");
      setUsername("");
      setPassword("");
      setFirst_name("");
      setLast_name("");
      setYears_experience("");
      setBio("");
    } catch (error: any) {
      const errorMsg =
        error?.message || "Something went wrong. Please try again.";
      Alert.alert("Sign Up Failed", errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1 }}
      accessibilityLabel="Trainer Sign Up screen"
      accessibilityHint="Fill out the form to create a trainer account">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled">
          <Text
            style={styles.title}
            accessibilityRole="header"
            accessibilityLabel="Trainer Sign Up">
            Trainer Sign Up
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(text) => setEmail(text.trim())}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#999"
            accessibilityLabel="Email input"
            accessibilityHint="Enter your email address"
            accessibilityRole="text"
          />

          <TextInput
            style={styles.input}
            placeholder="Username"
            onChangeText={(text) => setUsername(text.trim())}
            value={username}
            autoCapitalize="none"
            autoCorrect={false}
            placeholderTextColor="#999"
            accessibilityLabel="Username input"
            accessibilityHint="Enter your desired username"
            accessibilityRole="text"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={(text) => setPassword(text.trim())}
            value={password}
            secureTextEntry
            autoCorrect={false}
            placeholderTextColor="#999"
            accessibilityLabel="Password input"
            accessibilityHint="Enter a secure password"
            accessibilityRole="text"
          />

          <TextInput
            style={styles.input}
            placeholder="First Name"
            onChangeText={(text) => setFirst_name(text.trim())}
            value={first_name}
            autoCapitalize="words"
            placeholderTextColor="#999"
            accessibilityLabel="First Name input"
            accessibilityHint="Enter your first name"
            accessibilityRole="text"
          />

          <TextInput
            style={styles.input}
            placeholder="Last Name"
            onChangeText={(text) => setLast_name(text.trim())}
            value={last_name}
            autoCapitalize="words"
            placeholderTextColor="#999"
            accessibilityLabel="Last Name input"
            accessibilityHint="Enter your last name"
            accessibilityRole="text"
          />

          <TextInput
            style={styles.input}
            placeholder="Years Experience"
            onChangeText={(text) =>
              setYears_experience(text.replace(/[^0-9]/g, ""))
            }
            value={years_experience}
            keyboardType="numeric"
            placeholderTextColor="#999"
            accessibilityLabel="Years Experience input"
            accessibilityHint="Enter number of years of experience"
            accessibilityRole="text"
          />

          <TextInput
            style={[styles.input, styles.bioInput]}
            placeholder="Bio"
            onChangeText={setBio}
            value={bio}
            multiline
            numberOfLines={4}
            placeholderTextColor="#999"
            accessibilityLabel="Bio input"
            accessibilityHint="Enter a short biography"
            accessibilityRole="text"
          />

          <TouchableOpacity
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityLabel="Sign Up button"
            accessibilityHint="Submits the sign up form"
            accessible={true}>
            {submitting ? (
              <ActivityIndicator
                color="#fff"
                accessibilityLabel="Loading indicator"
              />
            ) : (
              <Text style={styles.buttonText}>Sign Up</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.push("/trainerLogin")}
            accessibilityRole="link"
            accessibilityLabel="Already have an account? Login link"
            accessibilityHint="Navigates to trainer login page"
            accessible={true}>
            <Text style={{ color: "#0066cc", marginTop: 20, marginBottom: 40 }}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default TrainerSignUp;
