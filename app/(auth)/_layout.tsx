import Ionicons from "react-native-vector-icons/Ionicons";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Pressable, Text, View } from "react-native";
import { useRouter } from "expo-router";

export default function AuthLayout() {
  const router = useRouter();

  return (
    <>
      <StatusBar style="auto" />
      <Stack screenOptions={{ headerShown: false, animation: "none" }} />

      <View style={{ position: "absolute", top: 60, left: 30, zIndex: 15 }}>
        <Pressable onPress={() => router.push("/")}>
          <Ionicons name="home-outline" size={32} color="#708090" />
        </Pressable>
      </View>
    </>
  );
}
