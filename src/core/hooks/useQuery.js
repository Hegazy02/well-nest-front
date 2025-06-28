import { apiClient } from "../utils/apiClient";
import { useEffect, useState } from "react";

export function useQuery(endPoint) {
  const [response, setData] = useState({});
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await apiClient.get(endPoint);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        setError(error);
        setLoading(false);
      }
    };
    fetchData();
  }, [endPoint]);

  return { response, setData, isLoading, error };
}
