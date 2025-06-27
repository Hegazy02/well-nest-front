import { apiClient } from "../utils/apiClient";
import { Endpoints } from "../utils/endpoints";

export const getDoctors = async () => {
  const response = await apiClient.get(Endpoints.doctors);
  return response.data;
};
