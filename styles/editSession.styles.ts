import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#F9F9F9",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#111",
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 8,
  },
  drillItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 10,
    borderRadius: 6,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  drillText: {
    fontSize: 16,
  },
  removeButton: {
    backgroundColor: "#FF6B6B",
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  removeText: {
    color: "#fff",
    fontWeight: "600",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    elevation: 5,
    maxHeight: "80%",
  },
  modalButtons: {
    marginTop: 16,
    alignItems: "center",
  },
  drillButton: {
    padding: 12,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  drillButtonText: {
    fontSize: 16,
  },
  emptyText: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginTop: 20,
  },
});
