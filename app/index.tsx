import { Text, View, Pressable, SafeAreaView, Image } from "react-native";
import { Link } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { styles } from "../styles/index.styles";

const Home = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="dark" />
      <View style={styles.container}>
        <Text style={styles.title}>Ball Up</Text>
        <Image
          source={require("../assets/basketball.png")}
          style={styles.image}
          resizeMode="contain"
          onError={() => console.warn("Image failed to load")}
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
