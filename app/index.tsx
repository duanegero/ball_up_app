import {
  StyleSheet,
  Text,
  View,
  Pressable,
  SafeAreaView,
  Image,
} from "react-native";
import { Link } from "expo-router";

const Home = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <Text style={styles.title}>Ball Up</Text>
        <Image
          source={require("../assets/basketball.png")}
          style={{ width: 100, height: 100 }}
        />

        <Text style={styles.subtitle}>
          "Where hoopers train, track, and thrive."
        </Text>

        <View style={styles.buttonContainer}>
          <Link href="/trainerLogin" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Trainers</Text>
            </Pressable>
          </Link>

          <Link href="/athleteLogin" asChild>
            <Pressable style={styles.button}>
              <Text style={styles.buttonText}>Athletes</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#f2f4f7",
  },
  container: {
    flex: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 40,
    fontWeight: "800",
    color: "#1f2937", // dark gray
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6b7280", // gray-500
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    width: "100%",
    gap: 20,
  },
  button: {
    backgroundColor: "#2563eb", // blue-600
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
});
