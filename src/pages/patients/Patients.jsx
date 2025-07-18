import { useEffect, useRef, useState } from "react";
import PatientsList from "./components/PatientsList";
import PrimaryInput from "../../core/components/PrimaryInput";
import Pagination from "../../core/components/Pagination";
import { Link } from "react-router";
import { apiClient } from "../../core/utils/apiClient";
import PrimaryButton from "../../core/components/PrimaryButton";
import PrimaryDropDown from "../../core/components/PrimaryDropDown";
import { toast } from "react-toastify";
import { useQuery } from "../../core/hooks/useQuery";
import { Endpoints } from "../../core/utils/endpoints";

const Patients = () => {
  const searchRef = useRef(null);
  const [visitTypes, setVisitTypes] = useState([]);

  const [filters, setFilters] = useState({
    fullName: "",
    visitType: "",
    page: 1,
  });

  const { state, refetch } = useQuery(Endpoints.patients, "GET", filters);

  useEffect(() => {
    const timer = setTimeout(() => {
      refetch(filters);
    }, 300);
    return () => clearTimeout(timer);
  }, [filters]);

  // Fetch visit types
  useEffect(() => {
    const fetchVisitTypes = async () => {
      try {
        const res = await apiClient.get(`${Endpoints.patients}/visit-type`);
        setVisitTypes(res.data.data);
      } catch (err) {
        toast.error("Failed to load visit types", err);
      }
    };

    fetchVisitTypes();
  }, []);

  // Handlers

  const handleSearchChange = (e) => {
    setFilters((prev) => ({ ...prev, fullName: e.target.value, page: 1 }));
  };

  const handleVisitTypeFilter = (index) => {
    const selectedType = index === 0 ? "" : visitTypes[index - 1];
    
    setFilters((prev) => ({ ...prev, visitType: selectedType, page: 1 }));
  };

  const pageChangeHandler = ({ selected }) => {
    setFilters((prev) => ({ ...prev, page: selected + 1 }));
  };

  const deletePatient = async (id) => {
    try {
      await apiClient.delete(`${Endpoints.patients}/${id}`);
      refetch(filters);
      toast.success("Patient deleted successfully");
    } catch (err) {
      toast.error("Failed to delete patient", err);
    }
  };

  const changeVisitType = async (id, newType) => {
    try {
      await apiClient.patch(`${Endpoints.patients}/${id}/visit-type`, {
        visitType: { visitType: newType },
      });      
      refetch(filters);
      toast.success("Visit type updated successfully!");
    } catch (err) {
      toast.error("Failed to update visit type", err);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex-1 p-4">
        <header className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6 justify-between">
          <div className="flex gap-4 flex-wrap">
            <PrimaryInput
              placeholder="Search by name..."
              onChange={handleSearchChange}
              ref={searchRef}
              value={filters.fullName}
              className="flex-1 min-w-[200px]"
            />

            <PrimaryDropDown
              text={
                filters.visitType ? filters.visitType : "All Visit Types"
              }
              onSelect={handleVisitTypeFilter}
              className="min-w-[150px]"
            >
              <p>All</p>
              {visitTypes.map((type, index) => (
                <p key={index} className="whitespace-nowrap">{type}</p>
              ))}
            </PrimaryDropDown>

            <Link to="/patients/add">
              <PrimaryButton>Add Patient</PrimaryButton>
            </Link>
          </div>
        </header>

        {state.loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <>
            <PatientsList
              patients={state.data?.data || []}
              visitTypes={visitTypes}
              changeVisitType={changeVisitType}
              deletePatient={deletePatient}
            />
            <Pagination
              totalPages={state.data?.totalPages || 1}
              pageChangeHandler={pageChangeHandler}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default Patients;
