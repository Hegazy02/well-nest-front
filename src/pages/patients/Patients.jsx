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

  useEffect(() => {
    const fetchVisitTypes = async () => {
      try {
        const res = await apiClient.get(`${Endpoints.patients}/visit-type`);
        setVisitTypes(res.data.data);
      } catch (err) {
        toast.error(`Failed to load visit types: ${err.message}`);
      }
    };

    fetchVisitTypes();
  }, []);

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
      toast.error(`Failed to delete patient: ${err.message}`);
    }
  };

  const changeVisitType = async (id, newType) => {
    if (!id || !newType) {
      toast.error("Patient ID and visit type are required");
      return;
    }

    const toastId = toast.loading("Updating visit type...");

    try {
      await apiClient.patch(`${Endpoints.patients}/${id}/visit-type`, {
        visitType: newType,
      });

      await refetch(filters);

      toast.update(toastId, {
        render: "Visit type updated successfully!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: err.response?.data?.message || "Failed to update visit type",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-4 max-w-[1400px] mx-auto">
        <header className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <PrimaryInput
              placeholder="Search by name..."
              onChange={handleSearchChange}
              ref={searchRef}
              value={filters.fullName}
              className="flex-1 min-w-[200px]"
            />

            <PrimaryDropDown
              text={filters.visitType ? filters.visitType : "All Visit Types"}
              onSelect={handleVisitTypeFilter}
              className="min-w-[150px]"
            >
              <p>All</p>
              {visitTypes.map((type, index) => (
                <p key={index} className="whitespace-nowrap">
                  {type}
                </p>
              ))}
            </PrimaryDropDown>

            <Link to="/patients/add" className="sm:ml-auto">
              <PrimaryButton className="w-full sm:w-auto">
                Add Patient
              </PrimaryButton>
            </Link>
          </div>
        </header>

        {state.loading ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : (
          <>
            <PatientsList
              patients={state.data?.data || []}
              visitTypes={visitTypes}
              changeVisitType={changeVisitType}
              deletePatient={deletePatient}
            />
            <div className="flex justify-center mt-8">
              <Pagination
                totalPages={state.data?.totalPages || 1}
                pageChangeHandler={pageChangeHandler}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Patients;
