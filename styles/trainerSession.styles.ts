import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  heading: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  actionButton: {
    flexDirection: "row",
    backgroundColor: "#FF4C4C",
    padding: 8,
    borderRadius: 8,
    marginTop: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
  value: {
    fontWeight: "normal",
  },
  addButton: {
    backgroundColor: "#007BFF",
    padding: 14,
    borderRadius: 10,
    marginTop: 10,
    alignItems: "center",
  },
  addText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  scrollContainer: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  noSessionsText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
    color: "#888",
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  actionButtonDisabled: {
    opacity: 0.6,
    backgroundColor: "#999",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    marginTop: 10,
    marginBottom: 10,
    fontSize: 14,
    paddingHorizontal: 16, // Add some padding
  },
});
