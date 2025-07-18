import React, { useEffect, useState } from "react";
import { fetchAppointmentsDashboardSummary } from "../../../core/api/appointmentsApi";
import { PiCalendarCheckDuotone } from "react-icons/pi";
import { MdOutlineUpcoming, MdOutlineCancel } from "react-icons/md";
import { IoCheckmarkDoneOutline } from "react-icons/io5";
import { HiArrowUpRight, HiArrowDownLeft } from "react-icons/hi2";
import Loader from "../../../core/components/Loader";
import Skeleton from "react-loading-skeleton";

const cardMeta = [
  {
    key: "allAppointments",
    label: "Appointments",
    icon: <PiCalendarCheckDuotone />,
  },
  {
    key: "upcomingAppointments",
    label: "Upcoming",
    icon: <MdOutlineUpcoming />,
  },
  { key: "doneAppointments", label: "Done", icon: <IoCheckmarkDoneOutline /> },
  {
    key: "cancelledAppointments",
    label: "Cancelled",
    icon: <MdOutlineCancel />,
  },
];

const Card = ({ icon, label, count, diff, diffPercent, subtext }) => (
  <div
    style={{
      borderRadius: 20,
      border: "1px solid #eee",
      padding: 24,
      minWidth: 220,
      background: "#fff",
    }}
  >
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{ fontSize: 24 }}>{icon}</span>
      <span style={{ fontWeight: 500, fontSize: 18 }}>
        {label || <Skeleton />}
      </span>
    </div>
    <div className="mt-4">
      {subtext ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <span style={{ fontSize: 36, fontWeight: 700 }}>{count}</span>
          <span
            style={{
              marginLeft: 12,
              background: diffPercent < 0 ? "#ffd6d6" : "#d6ffe0",
              color: diffPercent < 0 ? "#d32f2f" : "#388e3c",
              borderRadius: 12,
              padding: "2px 10px",
              fontWeight: 500,
              fontSize: 16,
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
          >
            <span style={{ fontSize: 18 }}>
              {diffPercent < 0 ? <HiArrowDownLeft /> : <HiArrowUpRight />}
            </span>
            {diffPercent}%
          </span>
        </div>
      ) : (
        <Skeleton height={40} />
      )}
    </div>
    <div style={{ color: "#888", marginTop: 8, fontSize: 16 }}>
      {subtext || <Skeleton />}
    </div>
  </div>
);

const AppointmentCardList = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAppointmentsDashboardSummary()
      .then((res) => {
        setData(res.data || res); // support both {data: ...} and direct
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  // if (loading) return <Loader />;
  if (error) return <div style={{ color: "red" }}>{error}</div>;
  // if (!data) return null;

  return (
    <div className="grid xl:grid-cols-4 gap-4 lg:grid-cols-3 md:grid-cols-2 xs:grid-cols-1">
      {cardMeta.map(({ key, label, icon }, index) => {
        let d;
        let diff;
        let diffPercent;
        let subtext;
        if (data) {
          d = data[key] || {};
          diff = d.yesterdayAppointmentsCount - d.appointmentCount;
          diffPercent = d.differentPercentage?.toFixed(2) || 0;
          subtext = `${Math.abs(diff)} ${
            diff >= 0 ? "less" : "more"
          } than yesterday`;
        }

        return (
          <Card
            key={index}
            icon={icon}
            label={label}
            count={d?.appointmentCount ?? 0}
            diff={diff}
            diffPercent={diffPercent}
            subtext={subtext}
          />
        );
      })}
    </div>
  );
};

export default AppointmentCardList;
