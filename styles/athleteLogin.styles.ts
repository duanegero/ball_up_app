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
    fontSize: 40,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 40,
    paddingHorizontal: 16,
  },
  input: {
    width: "100%",
    backgroundColor: "#ffffff",
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    fontSize: 16,
    color: "#111827",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  buttonContainer: {
    width: "100%",
    gap: 20,
    marginBottom: 30,
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
  linkText: {
    color: "#6b7280",
    fontSize: 14,
  },
  link: {
    color: "#2563eb",
    fontWeight: "600",
  },
  errorText: {
    color: "#dc2626",
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
  },
  fullScreen: {
    flex: 1,
  },
});
