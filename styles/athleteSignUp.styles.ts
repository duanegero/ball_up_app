import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  container: {
    flexGrow: 1,
    padding: 24,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "600",
    color: "#222",
    marginBottom: 30,
  },
  input: {
    width: "100%",
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#333",
  },
  button: {
    width: "100%",
    padding: 16,
    backgroundColor: "#0066cc",
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  buttonDisabled: {
    backgroundColor: "#94a3b8",
  },
});
