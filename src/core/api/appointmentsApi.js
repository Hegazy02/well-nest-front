import { apiClient } from "../utils/apiClient";

export const fetchAppointmentsDashboardSummary = async () => {
  const { data } = await apiClient.get("dashboard/appointmentsStatus");
  return data;
};
