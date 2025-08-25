import { useEffect, useState } from "react";
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
  const [statuses, setStatuses] = useState([]);
  const [filters, setFilters] = useState({
    statusId: "",
    page: 1,
  });

  const { state, refetch } = useQuery(Endpoints.patients, "GET", filters);

  useEffect(() => {
    const timer = setTimeout(() => refetch(filters), 300);
    return () => clearTimeout(timer);
  }, [filters]);

  useEffect(() => {
    const fetchStatuses = async () => {
      try {
        const res = await apiClient.get(`${Endpoints.patients}/visit-type`);
        setStatuses(res.data || []);
      } catch (err) {
        toast.error(`Failed to load statuses: ${err.message}`);
      }
    };
    fetchStatuses();
  }, []);

  const handleStatusFilter = (index) => {
    const selectedStatus = index === 0 ? "" : statuses[index - 1]?.value;
    setFilters((prev) => ({ ...prev, statusId: selectedStatus, page: 1 }));
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

  const changeStatus = async (id, newStatusId) => {
    if (!id || !newStatusId) {
      toast.error("Patient ID and status are required");
      return;
    }

    const toastId = toast.loading("Updating status...");
    try {
      await apiClient.patch(`${Endpoints.patients}/${id}/visit-type`, {
        statusId: newStatusId,
      });
      await refetch(filters);

      toast.update(toastId, {
        render: "Status updated successfully!",
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
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 p-4 max-w-[1400px] mx-auto">
        <header className="flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <PrimaryInput
              placeholder="Search by Name or Serial Number..."
              value={filters.search || ""}
              onChange={(e) =>
                setFilters((prev) => ({
                  ...prev,
                  search: e.target.value,
                  page: 1,
                }))
              }
            />

            <PrimaryDropDown
              text={
                statuses.find((s) => s.value === filters.statusId)?.label ||
                "All Statuses"
              }
              onSelect={handleStatusFilter}
              className="min-w-[150px]"
            >
              <p key="all">All</p>
              {statuses.map((status) => (
                <p key={status.value} className="whitespace-nowrap">
                  {status.label}
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

        {/* ✅ دايمًا نعرض PatientsList */}
        <PatientsList
          patients={state.data?.data || []}
          statuses={statuses}
          changeStatus={changeStatus}
          deletePatient={deletePatient}
          loading={state.loading}
        />

        {/* ✅ نخفي Pagination لو بيحمل */}
        {!state.loading && (
          <div className="flex justify-center mt-8">
            <Pagination
              totalPages={state.data?.totalPages || 1}
              pageChangeHandler={pageChangeHandler}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default Patients;
