import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router"; 
import { useEffect, useState } from "react";

const ProtectedRoute = ({ children, role }) => {
  const { user, isLoading } = useAuth();
  const [isAuthorized, setIsAuthorized] = useState(null); 

  useEffect(() => {
    if (!isLoading) {
      if (!user) {
        setIsAuthorized(false);
      }
      else if (role && user.role !== role) {
        setIsAuthorized(false);
      }
      // Authorized case
      else {
        setIsAuthorized(true);
      }
    }
  }, [user, isLoading, role]);

  // Still loading auth state
  if (isLoading || isAuthorized === null) {
    return <div>Loading...</div>;
  }

  // Use replace to prevent navigation loops
  return isAuthorized ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
