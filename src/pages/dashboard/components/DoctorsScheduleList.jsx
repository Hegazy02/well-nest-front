import React, { useState, useEffect } from "react";
import { apiClient } from "../../../core/utils/apiClient";
import PrimaryDropDown from "../../../core/components/PrimaryDropDown";
import Skeleton from "react-loading-skeleton";

const ranges = [
  { label: "Today", value: 1 },
  { label: "Last 7 Days", value: 7 },
  { label: "Last 14 Days", value: 14 },
];

function getDateRange(days) {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - (days - 1));
  console.log("days",days);
  
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

const DoctorsScheduleList = ({ className }) => {
  const [range, setRange] = useState(ranges[0]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const { from, to } = getDateRange(range.value);
    setLoading(true);
    setError(null);
    apiClient
      .get("dashboard/topDoctorsToday", { params: { from, to } })
      .then((res) => {
        console.log("ressss", res.data.data);

        setData(res.data.data || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data");
        setLoading(false);
      });
  }, [range]);

  const DoctorListSkeleton = ({ count = 5 }) => {
    return (
      <>
        {Array.from({ length: count }).map((_, idx) => (
          <li
            key={idx}
            className={`flex items-center py-4 ${
              idx !== 0 ? "border-t border-[#eee]" : ""
            }`}
          >
            <div className="w-12 h-12 rounded-full bg-cyan-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
              <Skeleton circle width={48} height={48} />
            </div>
            <div className="ml-4 flex-1">
              <Skeleton width={120} height={18} />
              <Skeleton width={80} height={14} style={{ marginTop: 6 }} />
            </div>
            <div className="flex flex-col items-end">
              <Skeleton width={120} height={28} borderRadius={16} />
            </div>
          </li>
        ))}
      </>
    );
  };

  return (
    <div
      className={`bg-white rounded-2xl p-6 border border-[#eee] ${className}`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="font-bold text-xl">Doctors’ Schedule</div>
        <PrimaryDropDown
          text={range.label}
          onSelect={(i) => setRange(ranges[i])}
        >
          {ranges.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </PrimaryDropDown>
      </div>
      {loading ? (
        <DoctorListSkeleton />
      ) : error ? (
        <div className="h-[200px] flex items-center justify-center text-red-400">
          {error}
        </div>
      ) : (
        <ul>
          {data.map((doc, idx) => (
            <li
              key={doc.doctorId}
              className={`flex items-center py-4 ${
                idx !== 0 ? "border-t border-[#eee]" : ""
              }`}
            >
              <div className="w-12 h-12 rounded-full bg-cyan-100 flex-shrink-0 flex items-center justify-center overflow-hidden">
                {doc.image ? (
                  <img
                    src={doc.image}
                    alt={doc.name}
                    className="w-full h-full object-cover rounded-full"
                  />
                ) : null}
              </div>
              <div className="ml-4 flex-1">
                <div className="font-semibold text-base text-gray-900">
                  {doc.name}
                </div>
                <div className="text-gray-400 text-sm">{doc.department}</div>
              </div>
              <div className="flex flex-col items-end">
                <span
                  className={`px-4 py-1 rounded-full text-sm font-medium border ${
                    doc.todayAppointmentCount > 0
                      ? "bg-cyan-50 text-cyan-700 border-cyan-200"
                      : "bg-white text-red-400 border-red-300"
                  }`}
                >
                  Appointments {doc.todayAppointmentCount}
                </span>
                {/* <span className="text-gray-400 text-xs mt-1">09:00 AM - 12:00 PM</span> */}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DoctorsScheduleList;
