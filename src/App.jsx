import { Routes, Route, useLocation } from "react-router";
import "./App.css";
import Dashboard from "./pages/dashboard/Dashboard";
import Doctors from "./pages/doctors/Doctors";
import AddDoctor from "./pages/doctors/AddDoctor";
import DoctorSchedule from "./pages/DoctorSchedule/DoctorSchedule";
import { ToastContainer } from "react-toastify";
import Login from "./pages/auth/Login";
import ProtectedRoute from "./core/components/ProtectedRoute";
import { AuthProvider } from "./core/context/AuthContext";
import Departments from "./pages/departments/Departments";
import DepartmentDetails from "./pages/departments/DepartmentDetails";
import DepartmentForm from "./pages/departments/DepartmentForm";
import Patients from "./pages/patients/Patients";
import PatientDetails from "./pages/patients/PatientDetails";
import "./index.css";
import AddPatient from "./pages/patients/AddPatient";
import Sidebar from "./core/components/layout/Sidebar";
import DoctorDetails from "./pages/doctors/Doctor-details/DoctorDetails";


import Header from "./core/components/layout/Header";
import { useState } from "react";
import 'react-loading-skeleton/dist/skeleton.css';

function App() {
  const location = useLocation();
  const hideSidebarPaths = ["/login"];
  const shouldHideSidebar = hideSidebarPaths.includes(location.pathname);
  const [title, setTitle] = useState("Dashboard");
  const isNested = location.pathname.split("/").length > 2;
  console.log("isNested", isNested);

  return (
    <>
      <AuthProvider>
        <div className="flex gap-4">
          {!shouldHideSidebar  && (
            <Sidebar onClick={(value) => setTitle(value)} />
          )}
          <div className="flex-grow mr-4 relative">
            {!shouldHideSidebar && !isNested && <Header title={title} />}

            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute role={"Admin"}>
                    <Dashboard />
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
                path="/patients/:id/update"
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
                <Route
            path="/doctors/:id"
            element={
              <ProtectedRoute role={"Admin"}>
                <DoctorDetails/>
              </ProtectedRoute>
            }
          />
          <Route
                path="/departments"
                element={
                  <ProtectedRoute role={"Admin"}>
                    <Departments />
                  </ProtectedRoute>
                }
              />{" "}
              <Route
                path="/departments/add"
                element={
                  <ProtectedRoute role={"Admin"}>
                    <DepartmentForm />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/departments/:id"
                element={
                  <ProtectedRoute role={"Admin"}>
                    <DepartmentDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/departments/:id/update"
                element={
                  <ProtectedRoute role={"Admin"}>
                    <DepartmentForm />
                  </ProtectedRoute>
                }
              />
                   <Route
                path="/calendar"
                element={
                  <ProtectedRoute role={"Admin"}>
                    <DoctorSchedule/>
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
        <ToastContainer />
      </AuthProvider>
    </>
  );
}

export default App;
