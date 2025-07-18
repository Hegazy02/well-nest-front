import axios from "axios";
import { Endpoints } from "./endpoints";
export const apiClient = axios.create({
  baseURL: Endpoints.baseUrl,
  timeout: 3000,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});