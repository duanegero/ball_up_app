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
} from "react-native";
import { useRouter } from "expo-router";
import { useState } from "react";
import { ActivityIndicator } from "react-native";
import { signUpAthlete } from "../../utils/apiServices";
import { styles } from "../../styles/athleteSignUp.styles";

const AthleteSignUp: React.FC = () => {
  //instance of router
  const router = useRouter();

  //useState variables
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [first_name, setFirst_name] = useState("");
  const [last_name, setLast_name] = useState("");
  const [age, setAge] = useState("");
  const [level, setLevel] = useState("");
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
      age: parseInt(age.trim(), 10),
      level: parseInt(level.trim(), 10),
    };

    //checks on the data
    if (
      !formData.email ||
      !formData.username ||
      !formData.password ||
      !formData.first_name ||
      !formData.last_name ||
      isNaN(formData.age) ||
      isNaN(formData.level)
    ) {
      Alert.alert("All fields are required and must be valid.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      Alert.alert("Invalid email format.");
      return;
    }

    if (formData.age < 5 || formData.age > 100) {
      Alert.alert("Please enter a valid age between 5 and 100.");
      return;
    }
    if (formData.level < 1 || formData.level >= 5) {
      Alert.alert("Please enter a valid level between 1 and 5.");
      return;
    }

    Keyboard.dismiss();
    setSubmitting(true);

    try {
      const response = await signUpAthlete(formData);

      const { message, username: signedUpUsername } = response;

      Alert.alert(`${message} Username: ${signedUpUsername}`, "", [
        {
          text: "OK",
          onPress: () => router.replace("/athleteLogin"),
        },
      ]);

      setEmail("");
      setUsername("");
      setPassword("");
      setFirst_name("");
      setLast_name("");
      setAge("");
      setLevel("");
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
      style={styles.wrapper}
      accessibilityRole="summary"
      accessibilityLabel="Create Account screen"
      accessibilityHint="Fill in the form to create a new account">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          accessibilityLabel="Create account form"
          accessibilityHint="Enter your details to create a new account">
          <Text
            style={styles.title}
            accessibilityRole="header"
            accessibilityLabel="Create Account">
            Create Account
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Email"
            onChangeText={(text) => setEmail(text.trim())}
            value={email}
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="#999"
            autoCorrect={false}
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
            placeholderTextColor="#999"
            autoCorrect={false}
            accessibilityLabel="Username input"
            accessibilityHint="Enter your desired username"
            accessibilityRole="text"
          />

          <TextInput
            style={styles.input}
            placeholder="Password"
            onChangeText={(text) => setPassword(text.trim())}
            value={password}
            secureTextEntry={true}
            textContentType="password"
            autoComplete="password"
            placeholderTextColor="#999"
            autoCorrect={false}
            accessibilityLabel="Password input"
            accessibilityHint="Enter your password"
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
            placeholder="Age"
            onChangeText={(text) => setAge(text.replace(/[^0-9]/g, ""))}
            value={age}
            keyboardType="numeric"
            placeholderTextColor="#999"
            accessibilityLabel="Age input"
            accessibilityHint="Enter your age as a number"
            accessibilityRole="text"
          />

          <TextInput
            style={styles.input}
            placeholder="Level"
            onChangeText={setLevel}
            value={level}
            keyboardType="numeric"
            placeholderTextColor="#999"
            accessibilityLabel="Level input"
            accessibilityHint="Enter your level as a number"
            accessibilityRole="text"
          />

          <TouchableOpacity
            style={[styles.button, submitting && styles.buttonDisabled]}
            onPress={handleSubmit}
            disabled={submitting}
            accessibilityRole="button"
            accessibilityLabel="Sign Up"
            accessibilityHint="Submit the form to create your account">
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
            onPress={() => router.push("/athleteLogin")}
            accessibilityRole="link"
            accessibilityLabel="Already have an account? Login"
            accessibilityHint="Navigate to the login screen">
            <Text style={{ color: "#0066cc", marginTop: 20, marginBottom: 30 }}>
              Already have an account? Login
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

export default AthleteSignUp;
