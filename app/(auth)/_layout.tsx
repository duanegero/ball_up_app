import Ionicons from "react-native-vector-icons/Ionicons";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, View, StyleSheet, Platform } from "react-native";
import { useRouter } from "expo-router";

export default function AuthLayout() {
  const router = useRouter();

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false, animation: "none" }} />

      <View style={styles.iconWrapper}>
        <Pressable
          onPress={() => router.push("/")}
          android_ripple={{ color: "#ccc", borderless: true }}
          style={({ pressed }) => [
            styles.iconContainer,
            pressed && { opacity: 0.7 },
          ]}>
          <Ionicons name="home-outline" size={26} color="#2c3e50" />
        </Pressable>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 15,
  },
  iconContainer: {
    backgroundColor: "#f4f6f8",
    borderRadius: 100,
    padding: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
      },
      android: {
        elevation: 3,
      },
    }),
  },
});
