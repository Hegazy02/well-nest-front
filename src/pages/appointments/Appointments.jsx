import React, { useEffect, useRef, useState } from "react";
import Sidebar from "../../core/components/layout/Sidebar";
import PrimaryDropDown from "../../core/components/PrimaryDropDown";
import Pagination from "../../core/components/Pagination";
import PrimaryInput from "../../core/components/PrimaryInput";
import PrimaryButton from "../../core/components/PrimaryButton";
import AppointmentsList from "../appointments/components/AppoimentList";
import { useQuery } from "../../core/hooks/useQuery";
import { Endpoints } from "../../core/utils/endpoints";
import { Link } from "react-router-dom";
import { apiClient } from "../../core/utils/apiClient";

const Appointments = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [searchTimeout, setSearchTimeout] = useState(null);

  const { state, dispatch, refetch } = useQuery(Endpoints.appointments, "GET", {
    page: 1,
    limit: 10, 
    
  });

  

  const pageChangeHandler = ({ selected: index }) => {
    const page = index + 1;

    refetch({
      page,
      search: searchValue || undefined,
      status: selectedStatus !== "all" ? selectedStatus : undefined,
    });
  };

  const searchHandler = (e) => {
    const value = e.target.value;
    setSearchValue(value);

    if (searchTimeout) clearTimeout(searchTimeout);

    const timeout = setTimeout(() => {
      refetch({
        page: 1,
        search: value,
        status: selectedStatus !== "all" ? selectedStatus : undefined,
      });
    }, 500);

    setSearchTimeout(timeout);
  };

  const [statusCounts, setStatusCounts] = useState({
    upcoming: 0,
    cancelled: 0,
    done: 0,
  });

  const fetchStatusCounts = async () => {
    try {
      const response = await apiClient.get("/appointments/statuses");
      setStatusCounts(response.data.data || {});
    } catch (err) {
      console.error("Failed to fetch status counts", err);
    }
  };

  useEffect(() => {
    fetchStatusCounts();
  }, []);

  const handleStatusClick = (status) => {
    setSelectedStatus(status);
    refetch({
      page: 1,
      status: status !== "all" ? status : undefined,
      search: searchValue || undefined,
    });
  };

  const upcoming = statusCounts.upcoming || 0;
  const cancelled = statusCounts.cancelled || 0;
  const done = statusCounts.done || 0;

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <div className="flex-1 p-6 bg-white">
        <div className="flex justify-between items-center mb-6">
          {/* فلترة الحالة */}
          <div className="flex gap-4">
            {[
              { label: "All", key: "all", count: upcoming + cancelled + done },
              { label: "Upcoming", key: "upcoming", count: upcoming },
              { label: "Cancelled", key: "cancelled", count: cancelled },
              { label: "Done", key: "done", count: done },
            ].map(({ label, key, count }) => (
              <button
                key={key}
                onClick={() => handleStatusClick(key)}
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all
                  ${selectedStatus === key
                    ? "bg-blue-100 text-blue-700"
                    : key === "cancelled"
                    ? "bg-[#FFF4F4] text-[#FD4245]"
                    : key === "done"
                    ? "bg-[#E5F9ED] text-[#008000]"
                    : key === "upcoming"
                    ? "bg-[#DFF8F9] text-[#233955]"
                    : "bg-gray-100 text-gray-600"}`}
              >
                {label}: {count}
              </button>
            ))}
          </div>

          {/* السيرش و الإضافة */}
          <div className="flex gap-4 items-center">
            <PrimaryInput
              placeholder="Search by name"
              onChange={searchHandler}
            />

            <PrimaryDropDown
              text="Filter by Date"
              onSelect={(index) => {
                const now = new Date();
                const iso = (d) => d.toISOString().slice(0, 10);

                if (index === 0) {
                  const today = iso(now);
                  refetch({ from: today, to: today });
                }

                if (index === 1) {
                  const first = new Date(now);
                  const day = now.getDay();
                  first.setDate(now.getDate() - ((day + 1) % 7));
                  const last = new Date(first);
                  last.setDate(first.getDate() + 6);
                  refetch({ from: iso(first), to: iso(last) });
                }

                if (index === 2) {
                  const first = new Date(now.getFullYear(), now.getMonth(), 1);
                  const last = new Date(now.getFullYear(), now.getMonth() + 1, 0);
                  refetch({ from: iso(first), to: iso(last) });
                }
              }}
            >
              <p>Today</p>
              <p>This Week</p>
              <p>This Month</p>
            </PrimaryDropDown>

            <Link to="/appointments/add">
              <PrimaryButton>Add Appointment</PrimaryButton>
            </Link>
          </div>
        </div>

        {/* عرض الحجوزات */}
        <AppointmentsList
          appointments={state.data?.data || []}
          dispatch={dispatch}
          refetch={refetch}
          refreshCounts={fetchStatusCounts}
        />

        {/* الباجينيشن */}
       <Pagination
  totalPages={state.data?.meta?.totalPages}
  pageChangeHandler={pageChangeHandler}
/>
      </div>
    </div>
  );
};

export default Appointments;
