import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";

const Home = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ball Up</Text>

      <View>
        <Text>Where hoopers train, track, and thrive.</Text>
      </View>
      <Link href={"/trainerLogin"} style={styles.link}>
        Login Page
      </Link>
      <Link href={"/signUp"} style={styles.link}>
        Sign Up Page
      </Link>
      <Link href={"/about"} style={styles.link}>
        About Page
      </Link>
      <Link href={"/trainerslist"} style={styles.link}>
        Trainers Page
      </Link>
    </View>
  );
};

export default Home;
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
});
