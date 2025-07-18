import { apiClient } from "../utils/apiClient";

export const getAppointmenstPatientsAgeStatistics = async (fromDate, toDate) => {
  const { data } = await apiClient.get("dashboard/getAppointmenstPatientsAgeStatistics", {
    params: { fromDate, toDate },
  });
  return data;
};
