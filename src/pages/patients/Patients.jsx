import { useEffect, useState, useRef } from "react";
import axios from "axios";
import PatientsList from "./PatientsList";
import PrimaryInput from "../../core/components/PrimaryInput";
import Pagination from "../../core/components/Pagination";
import { Link } from 'react-router'; // ✅ التعديل هنا
import PrimaryButton from "../../core/components/PrimaryButton";
import Sidebar from "../../core/components/layout/Sidebar";
import { FiMenu } from "react-icons/fi";

const Patients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  const searchRef = useRef(null);

  const fetchPatients = async (params = {}) => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/patients", {
        params: {
          page: params.page || 1,
          name: params.name || "",
        },
      });

      const { data, totalPages } = res.data;

      setPatients(data);
      setTotalPages(totalPages || 1);
    } catch (error) {
      console.error("Error fetching patients:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPatients({ page, name: search });
  }, [page, search]);

  const searchHandler = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const pageChangeHandler = ({ selected }) => {
    setPage(selected + 1);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />

      <div className="flex-1 p-4">
        <div className="flex items-center justify-between mb-4 md:hidden">
          <h2 className="text-xl font-bold">Patients</h2>
        </div>

        <header className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <PrimaryInput
            placeholder="Search by name..."
            onChange={searchHandler}
            ref={searchRef}
            className="flex-1"
          />
          <Link to="/patients/add" className="w-full sm:w-auto">
            <PrimaryButton className="w-full sm:w-auto">Add Patient</PrimaryButton>
          </Link>
        </header>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <>
            <PatientsList patients={patients} />
            <Pagination
              totalPages={totalPages}
              pageChangeHandler={pageChangeHandler}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Patients;
