import { Stack } from "expo-router";

const RootLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // ✅ Hides the top header and back button
      }}
    />
  );
};

export default RootLayout;
