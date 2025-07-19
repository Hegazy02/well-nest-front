// // src/pages/appointments/components/AppointmentsList.jsx
// import React from "react";
// import PrimaryTable from "../../../core/components/PrimaryTable";
// import PrimaryTableRow from "../../../core/components/PrimaryTableRow";
// import PrimaryDropDown from "../../../core/components/PrimaryDropDown";
// import PrimaryModal from "../../../core/components/PrimaryModal";
// import { toast } from "react-toastify";
// import { apiClient } from "../../../core/utils/apiClient";
// import { Endpoints } from "../../../core/utils/endpoints";

// const AppointmentsList = ({ appointments = [], dispatch, refetch, refreshCounts }) => {
//   const columns = [
//     { name: "Name", className: "flex-3" },
//     { name: "Date", className: "flex-2" },
//     { name: "Time", className: "flex-2" },
//     { name: "Doctor", className: "flex-2" },
//     { name: "Treatment", className: "flex-2" },
//     { name: "Status", className: "flex-2" },
//     { name: "Action", className: "flex-2" },
//   ];

//   const updateStatus = async (id, statusName) => {
//     try {
//       await apiClient.patch(`${Endpoints.appointments}/${id}`, {
//         statusName,
//       });
//       toast.success("Status updated");

//       await refetch();         // ✅ تحديث القائمة
//       await refreshCounts();   // ✅ تحديث العدادات اللي فوق
//     } catch (error) {
//       console.error("Error updating status:", error);
//       toast.error("Failed to update status");
//     }
//   };

//   const cancelAppointment = async (id) => {
//     try {
//       await apiClient.patch(`${Endpoints.appointments}/${id}`, {
//         statusName: "cancelled",
//       });
//       toast.success("Appointment cancelled");

//       await refetch();         // ✅ تحديث القائمة
//       await refreshCounts();   // ✅ تحديث العدادات اللي فوق
//     } catch (error) {
//       console.error("Error cancelling appointment:", error);
//       toast.error("Failed to cancel appointment");
//     }
//   };

//   if (!appointments?.length) {
//     return <p className="p-4 text-center text-gray-500">No appointments found.</p>;
//   }

//   return (
//     <PrimaryTable columns={columns}>
//       {appointments.map((appointment) => (
//         <PrimaryTableRow
//           key={appointment._id}
//           columns={columns.map((col) => col.className)}
//         >
//           <div className="font-medium text-gray-900">
//             {appointment.patientId?.fullName || "N/A"}
//           </div>
//           <div className="text-gray-600">{appointment.date?.split("T")[0]}</div>
//           <div className="text-gray-600">{appointment.date?.split("T")[1]?.slice(0, 5)}</div>
//           <div className="text-gray-600">{appointment.doctorId?.name || "N/A"}</div>
//           <div className="text-gray-600">{appointment.treatment}</div>

//           <PrimaryDropDown
//             text={appointment.statusId?.name || "N/A"}
//             hasIcon={false}
//             className="w-[80px] px-1"
//             textClassName={
//               appointment.statusId?.name === "upcoming"
//                 ? "bg-[#F0F7FF] text-[#2D68FE] px-3 py-1 rounded-lg text-sm font-medium"
//                 : appointment.statusId?.name === "done"
//                 ? "bg-[#ECFDF3] text-[#12B76A] px-3 py-1 rounded-lg text-sm font-medium"
//                 : "bg-[#FEF3F2] text-[#F04438] px-3 py-1 rounded-lg text-sm font-medium"
//             }
//             onSelect={(index) => {
//               const statusOptions = ["upcoming", "done"];
//               const selectedStatus = statusOptions[index];
//               updateStatus(appointment._id, selectedStatus);
//             }}
//           >
//             <p>upcoming</p>
//             <p>done</p>
//           </PrimaryDropDown>

//           <div className="flex gap-2">
//             <button className="text-sm px-3 py-1.5 bg-white border border-[#FEDF89] rounded-md shadow-sm text-[#B54708] hover:bg-[#FFFAEB]">
//               Reschedule
//             </button>
//           <PrimaryModal
//   title="Are you sure you want to cancel?"
//   onConfirm={() => cancelAppointment(appointment._id)} // ✅ استدعاء الدالة هنا
// >
//   <button className="text-sm px-3 py-1.5 bg-white border border-[#FECDCA] rounded-md shadow-sm text-[#B42318] hover:bg-[#FEF3F2]">
//     Cancel
//   </button>
// </PrimaryModal>
//           </div>
//         </PrimaryTableRow>
//       ))}
//     </PrimaryTable>
//   );
// };

// export default AppointmentsList;



// import React from "react";
// import PrimaryTable from "../../../core/components/PrimaryTable";
// import PrimaryTableRow from "../../../core/components/PrimaryTableRow";
// import PrimaryDropDown from "../../../core/components/PrimaryDropDown";
// import PrimaryModal from "../../../core/components/PrimaryModal";
// import { toast } from "react-toastify";
// import { apiClient } from "../../../core/utils/apiClient";
// import { Endpoints } from "../../../core/utils/endpoints";
// import { FiEdit } from "react-icons/fi";
// import { AiOutlineDelete } from "react-icons/ai";
// import { Link } from "react-router-dom";

// const AppointmentsList = ({ appointments = [], dispatch, refetch, refreshCounts }) => {
//   const columns = [
//     { name: "Name", className: "flex-3" },
//     { name: "Date", className: "flex-2" },
//     { name: "Time", className: "flex-2" },
//     { name: "Doctor", className: "flex-2" },
//     { name: "Treatment", className: "flex-2" },
//     { name: "Status", className: "flex-2" },
//     { name: "Action", className: "flex-1" },
//   ];

//   const updateStatus = async (id, statusName) => {
//     try {
//       await apiClient.patch(`${Endpoints.appointments}/${id}`, {
//         statusName,
//       });
//       toast.success("Status updated");
//       await refetch();
//       await refreshCounts();
//     } catch (error) {
//       console.error("Error updating status:", error);
//       toast.error("Failed to update status");
//     }
//   };

//   const cancelAppointment = async (id) => {
//     try {
//       await apiClient.patch(`${Endpoints.appointments}/${id}`, {
//         statusName: "cancelled",
//       });
//       toast.success("Appointment cancelled");
//       await refetch();
//       await refreshCounts();
//     } catch (error) {
//       console.error("Error cancelling appointment:", error);
//       toast.error("Failed to cancel appointment");
//     }
//   };

//   const deleteAppointment = async (id) => {
//     try {
//       await apiClient.delete(`${Endpoints.appointments}/${id}`);
//       toast.success("Appointment deleted");
//       await refetch();
//       await refreshCounts();
//     } catch (error) {
//       console.error("Error deleting appointment:", error);
//       toast.error("Failed to delete appointment");
//     }
//   };

//   if (!appointments?.length) {
//     return <p className="p-4 text-center text-gray-500">No appointments found.</p>;
//   }

//   return (
//     <PrimaryTable columns={columns}>
//       {appointments.map((appointment) => (
//         <PrimaryTableRow
//           key={appointment._id}
//           columns={columns.map((col) => col.className)}
//         >
//           <div className="font-medium text-gray-900">
//             {appointment.patientId?.fullName || "N/A"}
//           </div>
//           <div className="text-gray-600">{appointment.date?.split("T")[0]}</div>
//           <div className="text-gray-600">{appointment.date?.split("T")[1]?.slice(0, 5)}</div>
//           <div className="text-gray-600">{appointment.doctorId?.name || "N/A"}</div>
//           <div className="text-gray-600">{appointment.treatment}</div>

//           <PrimaryDropDown
//             text={appointment.statusId?.name || "N/A"}
//             hasIcon={false}
//             className="w-[80px] px-1"
//             textClassName={
//               appointment.statusId?.name === "upcoming"
//                 ? "border bg-[#DFF8F9] text-[#233955] border-[#A2F2EE] px-2 p-1 rounded-lg"
//                 : appointment.statusId?.name === "done"
//                 ? "border bg-[#E5F9ED] text-[#008000] border-[#008000] px-2 p-1 rounded-lg"
//                 : "border bg-[#FFF4F4] text-[#FD4245] border-[#FD4245] px-2 p-1 rounded-lg"
//             }
//             onSelect={(index) => {
//               const statusOptions = ["upcoming", "done"];
//               const selectedStatus = statusOptions[index];
//               updateStatus(appointment._id, selectedStatus);
//             }}
//           >
//             <p>upcoming</p>
//             <p>done</p>
//           </PrimaryDropDown>

//           <div className="flex gap-4 text-lg text-[#4B4D4F]">
//             <Link to={`/appointments/${appointment._id}/edit`}>
//               <FiEdit className="cursor-pointer text-blue-600 hover:text-blue-800" />
//             </Link>
            
//             <PrimaryModal
//               title="Are you sure you want to delete this appointment?"
//               onConfirm={() => deleteAppointment(appointment._id)}
//             >
//               <AiOutlineDelete className="cursor-pointer text-red-600 hover:text-red-800" />
//             </PrimaryModal>
//           </div>
//         </PrimaryTableRow>
//       ))}
//     </PrimaryTable>
//   );
// };

// export default AppointmentsList;




import React from "react";
import PrimaryTable from "../../../core/components/PrimaryTable";
import PrimaryTableRow from "../../../core/components/PrimaryTableRow";
import PrimaryDropDown from "../../../core/components/PrimaryDropDown";
import PrimaryModal from "../../../core/components/PrimaryModal";
import { toast } from "react-toastify";
import { apiClient } from "../../../core/utils/apiClient";
import { Endpoints } from "../../../core/utils/endpoints";
import { FiEdit } from "react-icons/fi";
import { AiOutlineDelete } from "react-icons/ai";
import { Link } from "react-router-dom";

const AppointmentsList = ({ appointments = [], dispatch, refetch, refreshCounts }) => {
  const columns = [
    { name: "Name", className: "flex-3" },
    { name: "Date", className: "flex-2" },
    { name: "Time", className: "flex-2" },
    { name: "Doctor", className: "flex-2" },
    { name: "Treatment", className: "flex-2" },
    { name: "Status", className: "flex-2" },
    { name: "Action", className: "flex-1" },
  ];

  // تحديث حالة الموعد
  const updateStatus = async (id, statusName) => {
    try {
      await apiClient.patch(`${Endpoints.appointments}/${id}`, {
        statusName,
      });
      toast.success("Status updated");
      await refetch();
      await refreshCounts();
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.response?.data?.message || "Failed to update status");
    }
  };

  // حذف الموعد (Soft Delete)
  const deleteAppointment = async (id) => {
    try {
      const response = await apiClient.delete(`${Endpoints.appointments}/${id}`, {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}` 
        }
      });
      
      toast.success(response.data?.message || "Appointment deleted successfully");
      await refetch();
      await refreshCounts();
    } catch (error) {
      console.error("Error deleting appointment:", error);
      toast.error(error.response?.data?.message || "Failed to delete appointment");
    }
  };

  // تصفية المواعيد غير المحذوفة
  const filteredAppointments = appointments?.filter(app => !app.isDeleted) || [];

  if (!filteredAppointments.length) {
    return <p className="p-4 text-center text-gray-500">No appointments found.</p>;
  }

  return (
    <PrimaryTable columns={columns}>
      {filteredAppointments.map((appointment) => (
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
            className="w-[100px] px-1" // زودنا العرض ليتسع للنص
            textClassName={
              appointment.statusId?.name === "upcoming"
                ? "border bg-[#DFF8F9] text-[#233955] border-[#A2F2EE] px-2 p-1 rounded-lg"
                : appointment.statusId?.name === "done"
                ? "border bg-[#E5F9ED] text-[#008000] border-[#008000] px-2 p-1 rounded-lg"
                : "border bg-[#FFF4F4] text-[#FD4245] border-[#FD4245] px-2 p-1 rounded-lg" // ستايل للإلغاء
            }
            onSelect={(index) => {
              const statusOptions = ["upcoming", "done", "cancelled"]; // أضفنا cancelled هنا
              const selectedStatus = statusOptions[index];
              updateStatus(appointment._id, selectedStatus);
            }}
          >
            <p>upcoming</p>
            <p>done</p>
            <p>cancelled</p> {/* أضفنا خيار الإلغاء */}
          </PrimaryDropDown>

          <div className="flex gap-4 text-lg text-[#4B4D4F]">
            <Link to={`/appointments/${appointment._id}/edit`}>
              <FiEdit className="cursor-pointer text-blue-600 hover:text-blue-800" />
            </Link>
            
            <PrimaryModal
              title="Are you sure you want to delete this appointment?"
              onConfirm={() => deleteAppointment(appointment._id)}
            >
              <AiOutlineDelete className="cursor-pointer text-red-600 hover:text-red-800" />
            </PrimaryModal>
          </div>
        </PrimaryTableRow>
      ))}
    </PrimaryTable>
  );
};

export default AppointmentsList;