import axios from "axios";

const BASE_URL = "http://10.181.139.4:4000/api";
// const BASE_URL = "http://localhost:4000/api"

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