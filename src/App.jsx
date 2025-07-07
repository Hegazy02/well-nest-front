import { Routes, Route } from "react-router";
import "./App.css";
import Dashboard from "./pages/dashboard/Dashboard";
import Doctors from "./pages/doctors/Doctors";
import AddDoctor from "./pages/doctors/AddDoctor";
import { ToastContainer } from "react-toastify";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/doctors" element={<Doctors />} />
        <Route path="/doctors/add" element={<AddDoctor />} />
        <Route path="/doctors/:id/update" element={<AddDoctor />} />
      </Routes>
      <ToastContainer />
    </>
  );
}

export default App;
