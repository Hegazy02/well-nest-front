import { useState, useEffect } from "react";
import { apiClient } from "../utils/apiClient";

export const usePatientData = (id) => {
  const [patientData, setPatientData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      apiClient.get(`/patients/${id}`).then((res) => {
        setPatientData(res.data);
        setIsLoading(false);
      });
    } else {
      setIsLoading(false);
    }
  }, [id]);

  const savePatient = async () => {
    if (id) {
      await apiClient.patch(`/patients/${id}`, patientData);
    } else {
      await apiClient.post(`/patients`, patientData);
    }
  };

  return { patientData, setPatientData, isLoading, savePatient };
};
