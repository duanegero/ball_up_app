import axios from "axios";

const HOSTNAME = "TC54D.WPA.Dal.Ca";
const PORT = 3005;

const api = axios.create({
  baseURL: `http://${HOSTNAME}:${PORT}`,
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
