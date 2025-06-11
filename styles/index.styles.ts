import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
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
    fontSize: 44,
    fontWeight: "800",
    color: "#1f2937", // dark gray
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 18,
    lineHeight: 24,
    fontStyle: "italic",
    fontWeight: "500",
    color: "#6b7280", // gray-500
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  buttonContainer: {
    width: "100%",
    paddingHorizontal: 16,
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
    width: "100%",
    maxWidth: 300,
    alignSelf: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "600",
  },
  image: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
});
