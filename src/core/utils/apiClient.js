import axios from "axios";
import { Endpoints } from "./endpoints";
export const apiClient = axios.create({
  baseURL: Endpoints.baseUrl,
  timeout: 3000,
});
