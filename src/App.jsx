import { Routes, Route } from "react-router";
import "./App.css";
import Dashboard from "./pages/dashboard/Dashboard";
import Doctors from "./pages/doctors/Doctors";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/doctors" element={<Doctors />} />
      </Routes>
    </>
  );
}

export default App;
