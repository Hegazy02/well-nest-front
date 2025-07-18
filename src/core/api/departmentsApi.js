import { apiClient } from "../utils/apiClient";

export const getPatientDepartmentStatistics = async (from, to) => {
  const { data } = await apiClient.get("dashboard/getAppointmentsDepartmentsStatistics", {
    params: { from, to },
  });
  return data;
};
