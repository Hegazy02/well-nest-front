import { useState } from "react";
import { useEffect } from "react";
import { getDoctors } from "../../core/api/doctorsApi";
import DoctorsList from "./components/DoctorsList";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  useEffect(() => {
    getDoctors().then((res) => setDoctors(res.data));
  }, []);

  return (
    <div>
      {/* <div>header</div> */}
      <DoctorsList doctors={doctors} setDoctors={setDoctors} />
    </div>
  );
};

export default Doctors;
