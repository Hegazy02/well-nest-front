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
  const [statusTypes, setStatusTypes] = useState([]);
  const [filters, setFilters] = useState({
    fullName: "",
    statusId: "",
    page: 1,
  });

  const { state, refetch } = useQuery(Endpoints.patients, "GET", filters);

  useEffect(() => {
    const timer = setTimeout(() => refetch(filters), 300);
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    const fetchStatusTypes = async () => {
      try {
        const res = await apiClient.get(`${Endpoints.patients}/statustypes`);
        setStatusTypes(res.data.data);
      } catch (err) {
        toast.error(`Failed to load Status Types: ${err.message}`);
      }
    };
    fetchStatusTypes();
  }, []);

  const handleSearchChange = (e) =>
    setFilters((prev) => ({ ...prev, fullName: e.target.value, page: 1 }));

  const handleStatusFilter = (selectedType) =>
    setFilters((prev) => ({
      ...prev,
      statusId: selectedType === "All" ? "" : selectedType._id,
      page: 1,
    }));

  const pageChangeHandler = ({ selected }) =>
    setFilters((prev) => ({ ...prev, page: selected + 1 }));

  const deletePatient = async (id) => {
    try {
      await apiClient.delete(`${Endpoints.patients}/${id}`);
      refetch(filters);
      toast.success("Patient deleted successfully");
    } catch (err) {
      toast.error(`Failed to delete patient: ${err.message}`);
    }
  };

  const changeStatus = async (id, statusId) => {
    if (!id || !statusId) {
      toast.error("Patient ID and status are required");
      return;
    }

    const toastId = toast.loading("Updating status...");
    try {
      await apiClient.patch(`${Endpoints.patients}/${id}/statustypes`, {
        statusId,
      });
      await refetch(filters);
      toast.update(toastId, {
        render: "Status updated!",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } catch (err) {
      toast.update(toastId, {
        render: err.response?.data?.message || "Failed to update status",
        type: "error",
        isLoading: false,
        autoClose: 5000,
      });
    }
  };

  return (
    <div className="">
      <div className="">
        <header className="flex mb-4 justify-between items-center">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <PrimaryInput
              placeholder="Search by name..."
              onChange={handleSearchChange}
              ref={searchRef}
              value={filters.fullName}
              className="flex-1 min-w-[200px]"
            />

            <PrimaryDropDown
              text={
                statusTypes.find((t) => t._id === filters.statusId)
                  ?.statusTypes || "All Status Types"
              }
              onSelect={(index) =>
                handleStatusFilter(index === 0 ? "All" : statusTypes[index - 1])
              }
              className="min-w-[150px]"
            >
              <p>All</p>
              {statusTypes.map((type) => (
                <p key={type._id} className="whitespace-nowrap">
                  {type.statusTypes}
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
              status={statusTypes}
              changestatus={changeStatus}
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
