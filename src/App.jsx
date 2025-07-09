import { Routes, Route } from "react-router";
import "./App.css";
import Dashboard from "./pages/dashboard/Dashboard";
import Doctors from "./pages/doctors/Doctors";
import AddDoctor from "./pages/doctors/AddDoctor";
import { ToastContainer } from "react-toastify";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./core/components/ProtectedRoute";
import { AuthProvider } from "./core/context/AuthContext";

function App() {
  return (
    <>
      <AuthProvider>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute role={"Admin"}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors"
            element={
              <ProtectedRoute role={"Admin"}>
                <Doctors />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors/add"
            element={
              <ProtectedRoute role={"Admin"}>
                <AddDoctor />
              </ProtectedRoute>
            }
          />
          <Route
            path="/doctors/:id/update"
            element={
              <ProtectedRoute role={"Admin"}>
                <AddDoctor />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
        <ToastContainer />
      </AuthProvider>
    </>
  );
}

export default App;
