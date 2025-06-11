import { Text, View, Pressable, SafeAreaView, Image } from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { styles } from "../styles/index.styles";

const Home = () => {
  return (
    <SafeAreaView
      style={styles.safeArea}
      accessibilityLabel="Welcome screen for Ball Up app">
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text
          style={styles.title}
          accessibilityRole="header"
          accessibilityLabel="Ball Up">
          Ball Up
        </Text>

        <Image
          source={require("../assets/basketball.png")}
          style={styles.image}
          resizeMode="contain"
          accessibilityRole="image"
          accessibilityLabel="Basketball logo"
          onError={() => console.warn("Image failed to load")}
        />

        <Text
          style={styles.subtitle}
          accessibilityLabel='App slogan: "Where hoopers train, track, and thrive."'>
          "Where hoopers train, track, and thrive."
        </Text>

        <View style={styles.buttonContainer}>
          <Link href="/trainerLogin" asChild>
            <Pressable
              style={styles.button}
              accessibilityRole="button"
              accessibilityLabel="Go to trainers login"
              accessibilityHint="Navigates to the trainers login screen">
              <Text style={styles.buttonText}>Trainers</Text>
            </Pressable>
          </Link>

          <Link href="/athleteLogin" asChild>
            <Pressable
              style={styles.button}
              accessibilityRole="button"
              accessibilityLabel="Go to athletes login"
              accessibilityHint="Navigates to the athletes login screen">
              <Text style={styles.buttonText}>Athletes</Text>
            </Pressable>
          </Link>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;
