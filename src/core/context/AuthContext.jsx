import { useEffect, useState, useContext, createContext } from "react";
import {
  apiClient,
  addTokenToLocalStorage,
  getTokenFromLocalStorage,
} from "../utils/apiClient";
import { Endpoints } from "../utils/endpoints";
import { encrypt } from "n-krypta";

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
    const publicKey = import.meta.env.VITE_AUTH_PUBLIC_KEY;
    const encryptedData = encrypt({ email, password }, publicKey);

    try {
      const response = await apiClient.post(Endpoints.login, {
        data: encryptedData,
      });
      setUser({ token: response.data._id, role: response.data.role });
      addTokenToLocalStorage(response.data.token);
    } catch (error) {
      throw error.response.data ?? error;
    }
  };
  const checkAuth = async () => {
    try {
      setIsLoading(true);
      const token = getTokenFromLocalStorage();

      if (!token) {
        setIsLoading(false);
        return;
      }
      const response = await apiClient.get(Endpoints.me, {
        withCredentials: true,
      });

      setUser({ _id: response.data.data._id, role: response.data.data.role });
    } catch (error) {
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    delete apiClient.defaults.headers.common["Authorization"];
  };
  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
