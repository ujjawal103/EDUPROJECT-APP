import axios from "axios";

const BASE_URL = "http://10.148.235.4:4000/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "x-client-type": "mobile",
  },
});

export const authAxios = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
    "x-client-type": "mobile",
  },
});