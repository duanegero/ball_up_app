import { StyleSheet, Text, View } from "react-native";
import { Link } from "expo-router";
import ThemedContainer from "../components/ThemedContainer";
import ThemedTitle from "../components/ThemedTitle";
import ThemedLink from "../components/ThemedLink";
import ThemedText from "../components/ThemedText";
import Spacer from "../components/Spacer";

const Home = () => {
  return (
    <ThemedContainer>
      <ThemedTitle>Ball Up</ThemedTitle>

      <View>
        <ThemedText>"Where hoopers train, track, and thrive."</ThemedText>
      </View>
      <Spacer height={50} />
      <ThemedLink href={"/trainerLogin"}>Trainers</ThemedLink>
      <ThemedLink href={"/athleteLogin"}>Athletes</ThemedLink>
      {/* <Link href={"/signUp"} style={styles.link}>
        Sign Up Page
      </Link>
      <Link href={"/about"} style={styles.link}>
        About Page
      </Link>
      <Link href={"/trainerslist"} style={styles.link}>
        Trainers Page */}
      {/* </Link> */}
    </ThemedContainer>
  );
};

export default Home;
const styles = StyleSheet.create({});
