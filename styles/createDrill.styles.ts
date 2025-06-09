import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#111",
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginTop: 16,
    marginBottom: 6,
    color: "#333",
  },

  input: {
    backgroundColor: "#F1F1F1",
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 16,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
  modalSelector: {
    backgroundColor: "#F1F1F1",
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
    paddingHorizontal: 40,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 20,
    paddingHorizontal: 10,
  },
  modalOption: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  segmentContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  segmentButton: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  segmentSelected: {
    backgroundColor: "#3D7BF7",
  },
  segmentText: {
    color: "#333",
    fontWeight: "500",
  },
  segmentTextSelected: {
    color: "#fff",
  },
  button: {
    backgroundColor: "#3D7BF7",
    paddingVertical: 16,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 12,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    textTransform: "uppercase",
  },
  buttonDisabled: {
    backgroundColor: "#cbd5e1",
  },
  drillTypeText: { color: "#000" },
  placeholderText: { color: "#aaa" },
});
