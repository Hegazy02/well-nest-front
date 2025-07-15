import { useEffect, useState, useContext, createContext } from "react";
import { apiClient } from "../utils/apiClient";
import { Endpoints } from "../utils/endpoints";

const AuthContext = createContext();
export const useAuth = () => {
  return useContext(AuthContext);
};
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    checkAuth();
  }, []);
  const login = async ({ email, password }) => {
    try {
      const response = await apiClient.post(Endpoints.login, {
        email,
        password,
      });

      setUser({ token: response.data._id, role: response.data.role });
      localStorage.setItem("token", response.data.token);
      
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${response.data.token}`;
    } catch (error) {
      console.log("error", error);
    }
  };
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");

      if (!token) {
        setIsLoading(false);
        return;
      }
      apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      const response = await apiClient.get(Endpoints.me);

      setUser({ _id: response.data.data._id, role: response.data.data.role });
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <AuthContext.Provider value={{ user, setUser, login, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
