import { useEffect, useReducer } from "react";
import { queryReducer } from "../reducers/queryReducer";
import { apiClient } from "../utils/apiClient";
import { useCallback } from "react";

const initialState = {
  data: {},
  isLoading: true,
  error: null,
};

export function useQuery(
  endPoint,
  method = "GET",
  initialParams = {},
  body = null
) {
  const [state, dispatch] = useReducer(queryReducer, initialState);

  const fetchData = useCallback(
    async (params = initialParams) => {
      dispatch({ type: "REQUEST_START" });

      try {
        let result;
        switch (method) {
          case "GET":
            result = await apiClient.get(endPoint, { params });
            break;
          case "POST":
            result = await apiClient.post(endPoint, body, params);
            break;
          case "PATCH":
            result = await apiClient.patch(endPoint, body, params);
            break;
          case "PUT":
            result = await apiClient.put(endPoint, body, params);
            break;
          case "DELETE":
            result = await apiClient.delete(endPoint, params);
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }

        dispatch({
          type: "REQUEST_SUCCESS",
          payload: { data: result.data },
        });
      } catch (error) {
        dispatch({
          type: "REQUEST_ERROR",
          payload: { error },
        });
      }
    },
    [endPoint, method, JSON.stringify(initialParams), JSON.stringify(body)]
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refetch = useCallback(
    (newParams = initialParams) => {
      fetchData(newParams);
    },
    [fetchData]
  );

  return { state, refetch, dispatch };
}
