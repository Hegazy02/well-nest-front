// src/pages/appointments/components/AppointmentsList.jsx
import React from "react";
import PrimaryTable from "../../../core/components/PrimaryTable";
import PrimaryTableRow from "../../../core/components/PrimaryTableRow";
import PrimaryDropDown from "../../../core/components/PrimaryDropDown";
import PrimaryModal from "../../../core/components/PrimaryModal";
import { toast } from "react-toastify";
import { apiClient } from "../../../core/utils/apiClient";
import { Endpoints } from "../../../core/utils/endpoints";

const AppointmentsList = ({ appointments = [], dispatch, refetch, refreshCounts }) => {
  const columns = [
    { name: "Name", className: "flex-3" },
    { name: "Date", className: "flex-2" },
    { name: "Time", className: "flex-2" },
    { name: "Doctor", className: "flex-2" },
    { name: "Treatment", className: "flex-2" },
    { name: "Status", className: "flex-2" },
    { name: "Action", className: "flex-2" },
  ];

  const updateStatus = async (id, statusName) => {
    try {
      await apiClient.patch(`${Endpoints.appointments}/${id}`, {
        statusName,
      });
      toast.success("Status updated");

      await refetch();         // ✅ تحديث القائمة
      await refreshCounts();   // ✅ تحديث العدادات اللي فوق
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const cancelAppointment = async (id) => {
    try {
      await apiClient.patch(`${Endpoints.appointments}/${id}`, {
        statusName: "cancelled",
      });
      toast.success("Appointment cancelled");

      await refetch();         // ✅ تحديث القائمة
      await refreshCounts();   // ✅ تحديث العدادات اللي فوق
    } catch (error) {
      console.error("Error cancelling appointment:", error);
      toast.error("Failed to cancel appointment");
    }
  };

  if (!appointments?.length) {
    return <p className="p-4 text-center text-gray-500">No appointments found.</p>;
  }

  return (
    <PrimaryTable columns={columns}>
      {appointments.map((appointment) => (
        <PrimaryTableRow
          key={appointment._id}
          columns={columns.map((col) => col.className)}
        >
          <div className="font-medium text-gray-900">
            {appointment.patientId?.fullName || "N/A"}
          </div>
          <div className="text-gray-600">{appointment.date?.split("T")[0]}</div>
          <div className="text-gray-600">{appointment.date?.split("T")[1]?.slice(0, 5)}</div>
          <div className="text-gray-600">{appointment.doctorId?.name || "N/A"}</div>
          <div className="text-gray-600">{appointment.treatment}</div>

          <PrimaryDropDown
            text={appointment.statusId?.name || "N/A"}
            hasIcon={false}
            className="w-[80px] px-1"
            textClassName={
              appointment.statusId?.name === "upcoming"
                ? "bg-[#F0F7FF] text-[#2D68FE] px-3 py-1 rounded-lg text-sm font-medium"
                : appointment.statusId?.name === "done"
                ? "bg-[#ECFDF3] text-[#12B76A] px-3 py-1 rounded-lg text-sm font-medium"
                : "bg-[#FEF3F2] text-[#F04438] px-3 py-1 rounded-lg text-sm font-medium"
            }
            onSelect={(index) => {
              const statusOptions = ["upcoming", "done"];
              const selectedStatus = statusOptions[index];
              updateStatus(appointment._id, selectedStatus);
            }}
          >
            <p>upcoming</p>
            <p>done</p>
          </PrimaryDropDown>

          <div className="flex gap-2">
            <button className="text-sm px-3 py-1.5 bg-white border border-[#FEDF89] rounded-md shadow-sm text-[#B54708] hover:bg-[#FFFAEB]">
              Reschedule
            </button>
          <PrimaryModal
  title="Are you sure you want to cancel?"
  onConfirm={() => cancelAppointment(appointment._id)} // ✅ استدعاء الدالة هنا
>
  <button className="text-sm px-3 py-1.5 bg-white border border-[#FECDCA] rounded-md shadow-sm text-[#B42318] hover:bg-[#FEF3F2]">
    Cancel
  </button>
</PrimaryModal>
          </div>
        </PrimaryTableRow>
      ))}
    </PrimaryTable>
  );
};

export default AppointmentsList;




