import axios from "axios";
import { getToken } from "@/helpers/token.helper.js";

export const config = {
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
};

const token = getToken();
console.log(token);

if (token) config.headers["Authorization"] = `Bearer ${token}`;
console.log(import.meta.env.VITE_AXIOS_BASE_URL)
axios.defaults.baseURL = import.meta.env.VITE_AXIOS_BASE_URL
const axiosInstance = axios.create(config);

export default axiosInstance;
