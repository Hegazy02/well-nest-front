import { Routes, Route } from "react-router";
import "./App.css";
import Dashboard from "./pages/dashboard/Dashboard";
import Doctors from "./pages/doctors/Doctors";
import AddDoctor from "./pages/doctors/AddDoctor";
import { ToastContainer } from "react-toastify";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./core/components/ProtectedRoute";
import { AuthProvider } from "./core/context/AuthContext";
import Patients from "./pages/patients/Patients";
import PatientDetails from "./pages/patients/PatientDetails";
import KeywordsInput from "./pages/patients/components/MultiTagInput"
import './index.css';
import AddPatient from "./pages/patients/AddPatient";
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
            path="/KeywordsInput"
            element={
              <ProtectedRoute role={"Admin"}>
                <KeywordsInput />
              </ProtectedRoute>
            }
          />
            <Route
              path="/patients"
              element={
                <ProtectedRoute role={"Admin"}>
                  <Patients />
                </ProtectedRoute>
              }
            />
            <Route
            path="/patients/add"
            element={
              <ProtectedRoute role={"Admin"}>
                <AddPatient />
              </ProtectedRoute>
            }
          />
          <Route
            path="/patients/:id"
            element={
              <ProtectedRoute role={"Admin"}>
                <PatientDetails />
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
