import { Routes, Route } from "react-router";
import "./App.css";
import Dashboard from "./pages/dashboard/Dashboard";
import Doctors from "./pages/doctors/Doctors";
import {PatientForm} from "./pages/patients/PatientForm";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/PatientForm" element={<PatientForm />} />

      </Routes>
    </>
  );
}

export default App;
