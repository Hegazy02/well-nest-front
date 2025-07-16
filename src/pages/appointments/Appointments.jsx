// import React, { useEffect, useState } from "react";
// import PrimaryTable from "../../core/components/PrimaryTable";
// import PrimaryTableRow from "../../core/components/PrimaryTableRow";
// import PrimaryInput from "../../core/components/PrimaryInput";
// import PrimaryButton from "../../core/components/PrimaryButton";
// import PrimaryDropDown from "../../core/components/PrimaryDropDown";
// import PrimaryModal from "../../core/components/PrimaryModal";
// import Pagination from "../../core/components/Pagination";
// import { toast } from "react-toastify";
// import { Link } from "react-router";

// const Appointments = () => {
//   const [appointments, setAppointments] = useState([]);
//   const [filteredAppointments, setFilteredAppointments] = useState([]);
//   const [statusFilter, setStatusFilter] = useState("All");
//   const [search, setSearch] = useState("");
//   const [currentPage, setCurrentPage] = useState(0);
//   const itemsPerPage = 5;

//   useEffect(() => {
//     const dummyAppointments = [
//       {
//         _id: "1",
//         patient: { name: "Aya Salah" },
//         doctor: { name: "Dr. Ahmed" },
//         treatment: "Skin Test",
//         date: "2025-07-15T10:30:00.000Z",
//         status: "upcoming",
//       },
//       {
//         _id: "2",
//         patient: { name: "Mohamed Gamal" },
//         doctor: { name: "Dr. Heba" },
//         treatment: "Eye Check",
//         date: "2025-07-16T12:00:00.000Z",
//         status: "done",
//       },
//       {
//         _id: "3",
//         patient: { name: "Laila Mostafa" },
//         doctor: { name: "Dr. Omar" },
//         treatment: "Dental Cleaning",
//         date: "2025-07-17T09:00:00.000Z",
//         status: "cancelled",
//       },
//     ];
//     setAppointments(dummyAppointments);
//   }, []);

//   useEffect(() => {
//     let data = [...appointments];
//     if (statusFilter !== "All") {
//       data = data.filter((a) => a.status === statusFilter.toLowerCase());
//     }
//     if (search.trim()) {
//       data = data.filter((a) =>
//         a.patient?.name?.toLowerCase().includes(search.toLowerCase())
//       );
//     }
//     setFilteredAppointments(data);
//     setCurrentPage(0);
//   }, [appointments, statusFilter, search]);

//   const pageChangeHandler = ({ selected }) => {
//     setCurrentPage(selected);
//   };

//   const pageData = filteredAppointments.slice(
//     currentPage * itemsPerPage,
//     (currentPage + 1) * itemsPerPage
//   );

//   const columns = [
//     { name: "Name", className: "flex-3" },
//     { name: "Date", className: "flex-2" },
//     { name: "Time", className: "flex-2" },
//     { name: "Doctor", className: "flex-2" },
//     { name: "Treatment", className: "flex-2" },
//     { name: "Status", className: "flex-2" },
//     { name: "Action", className: "flex-2" },
//   ];

//   return (
//     <div className="flex flex-col gap-6">
//       {/* الفلاتر والسيرش */}
//       <div className="flex justify-between items-center flex-wrap gap-4">
//         <div className="flex gap-4 items-center">
//           {["All", "upcoming", "done", "cancelled"].map((tab) => (
//             <button
//               key={tab}
//               onClick={() => setStatusFilter(tab)}
//               className={`px-3 py-1 rounded-md text-sm ${
//                 statusFilter === tab
//                   ? "bg-[#233955] text-white"
//                   : "bg-[#f3f3f3] text-gray-600"
//               }`}
//             >
//               {tab[0].toUpperCase() + tab.slice(1)}
//             </button>
//           ))}
//           <button className="text-sm px-3 py-1 bg-white border rounded-md shadow-sm">
//             Today
//           </button>
//         </div>
//         <div className="flex gap-4">
//           <PrimaryInput
//             placeholder="Search by name"
//             onChange={(e) => setSearch(e.target.value)}
//           />
//          <Link to="/appointments/add">
//   <PrimaryButton hasIcon>Add Appointment</PrimaryButton>
// </Link>

//         </div>
//       </div>

//       {/* جدول المواعيد داخل إطار */}
//       <div className="border border-gray-300 rounded-2xl overflow-hidden min-h-[85vh]">
//         <PrimaryTable columns={columns}>
//           {pageData.map((appointment) => (
//             <PrimaryTableRow
//               key={appointment._id}
//               columns={columns.map((c) => c.className)}
//             >
//               <div>{appointment.patient?.name}</div>
//               <div>{appointment.date?.split("T")[0]}</div>
//               <div>{appointment.date?.split("T")[1]?.slice(0, 5)}</div>
//               <div>{appointment.doctor?.name}</div>
//               <div>{appointment.treatment}</div>
//               <PrimaryDropDown
//                 text={appointment.status}
//                 onSelect={() => {}}
//                 hasIcon={false}
//                 className="w-full"
//                 textClassName={
//                   appointment.status === "upcoming"
//                     ? "bg-[#DFF8F9] text-[#233955] px-2 py-1 rounded-lg"
//                     : appointment.status === "done"
//                     ? "bg-[#E6F4EA] text-green-700 px-2 py-1 rounded-lg"
//                     : "bg-[#FFF4F4] text-[#FD4245] px-2 py-1 rounded-lg"
//                 }
//               >
//                 <p>upcoming</p>
//                 <p>done</p>
//                 <p>cancelled</p>
//               </PrimaryDropDown>
//               <div className="flex gap-2 text-sm">
//                 <button className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md">
//                   Reschedule
//                 </button>
//                 <PrimaryModal
//                   title="Are you sure you want to cancel?"
//                   onConfirm={() => toast("Cancelled")}
//                 >
//                   <button className="bg-red-100 text-red-600 px-2 py-1 rounded-md">
//                     Cancel
//                   </button>
//                 </PrimaryModal>
//               </div>
//             </PrimaryTableRow>
//           ))}
//         </PrimaryTable>
//       </div>

//       {/* الباجينيشن بره الجدول */}
//       <div className="mt-4">
//         <Pagination
//           totalPages={Math.ceil(filteredAppointments.length / itemsPerPage)}
//           pageChangeHandler={pageChangeHandler}
//         />
//       </div>
//     </div>
//   );
// };import React, { useEffect, useState } from "react";
import React, { useEffect, useState } from "react";
import PrimaryTable from "../../core/components/PrimaryTable";
import PrimaryTableRow from "../../core/components/PrimaryTableRow";
import PrimaryInput from "../../core/components/PrimaryInput";
import PrimaryButton from "../../core/components/PrimaryButton";
import PrimaryDropDown from "../../core/components/PrimaryDropDown";
import PrimaryModal from "../../core/components/PrimaryModal";
import Pagination from "../../core/components/Pagination";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { apiClient } from "../../core/utils/apiClient";
import { Endpoints } from "../../core/utils/endpoints";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 5;

  const fetchAppointments = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await apiClient.get(Endpoints.appointments, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = response.data.data;

      const formatted = data.map((a) => ({
        _id: a._id,
        patient: { name: a.patientId?.fullName || "N/A" },
        doctor: { name: a.doctorId?.name || "N/A" },
        treatment: a.treatment,
        date: a.date,
        status: a.statusId?.name || "upcoming",
      }));

      setAppointments(formatted);
    } catch (err) {
      toast.error("Failed to load appointments");
    }
  };

  const updateStatus = async (appointmentId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await apiClient.put(
        `${Endpoints.appointments}/${appointmentId}`,
        { statusName: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success("Status updated successfully");

      setAppointments((prev) =>
        prev.map((a) =>
          a._id === appointmentId ? { ...a, status: newStatus } : a
        )
      );
    } catch (err) {
      toast.error("Failed to update status");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    let data = [...appointments];
    if (statusFilter !== "All") {
      data = data.filter((a) => a.status === statusFilter.toLowerCase());
    }
    if (search.trim()) {
      data = data.filter((a) =>
        a.patient?.name?.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredAppointments(data);
    setCurrentPage(0);
  }, [appointments, statusFilter, search]);

  const pageChangeHandler = ({ selected }) => {
    setCurrentPage(selected);
  };

  const pageData = filteredAppointments.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const columns = [
    { name: "Name", className: "flex-3" },
    { name: "Date", className: "flex-2" },
    { name: "Time", className: "flex-2" },
    { name: "Doctor", className: "flex-2" },
    { name: "Treatment", className: "flex-2" },
    { name: "Status", className: "flex-2" },
    { name: "Action", className: "flex-2" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-xl">
      <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>

      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-2 items-center flex-wrap">
          {["All", "upcoming", "done", "cancelled"].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-2 rounded-lg text-sm ${
                statusFilter === tab
                  ? "bg-[#F0F7FF] text-[#2D68FE] font-medium"
                  : "text-[#6B7280] hover:bg-gray-100"
              }`}
            >
              {tab[0].toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className="flex gap-3 items-center flex-wrap">
          <PrimaryInput
            placeholder="Search by name"
            onChange={(e) => setSearch(e.target.value)}
            className="w-48 border-[#D1D5DB] focus:border-[#2D68FE]"
          />
          <button className="text-sm px-4 py-2 bg-white border border-[#D1D5DB] rounded-lg text-[#4B5563] hover:bg-[#F9FAFB]">
            Today
          </button>
          <Link to="/appointments/add">
            <PrimaryButton
              hasIcon
              className="bg-[#2D68FE] hover:bg-[#1D4ED8] text-white whitespace-nowrap"
            >
              Add Appointment
            </PrimaryButton>
          </Link>
        </div>
      </div>

      <PrimaryTable
        columns={columns}
        className="rounded-lg border border-[#E5E7EB]"
        headerClassName="bg-[#F9FAFB] text-[#6B7280] font-medium"
      >
        {pageData.map((appointment) => (
          <PrimaryTableRow
            key={appointment._id}
            columns={columns.map((c) => c.className)}
            className="hover:bg-[#F9FAFB] border-b border-[#E5E7EB] last:border-b-0"
          >
            <div className="font-medium text-gray-900">
              {appointment.patient?.name}
            </div>
            <div className="text-gray-600">
              {appointment.date?.split("T")[0]}
            </div>
            <div className="text-gray-600">
              {appointment.date?.split("T")[1]?.slice(0, 5)}
            </div>
            <div className="text-gray-600">{appointment.doctor?.name}</div>
            <div className="text-gray-600">{appointment.treatment}</div>

            <PrimaryDropDown
              text={appointment.status}
              hasIcon={false}
              className="w-[80px] px-1"
              textClassName={
                appointment.status === "upcoming"
                  ? "bg-[#F0F7FF] text-[#2D68FE] px-3 py-1 rounded-lg text-sm font-medium"
                  : appointment.status === "done"
                  ? "bg-[#ECFDF3] text-[#12B76A] px-3 py-1 rounded-lg text-sm font-medium"
                  : "bg-[#FEF3F2] text-[#F04438] px-3 py-1 rounded-lg text-sm font-medium"
              }
              dropdownClassName="min-w-[120px] text-sm"
            >
              <p
                className="px-3 py-2 hover:bg-gray-100"
                onClick={() => updateStatus(appointment._id, "upcoming")}
              >
                upcoming
              </p>
              <p
                className="px-3 py-2 hover:bg-gray-100"
                onClick={() => updateStatus(appointment._id, "done")}
              >
                done
              </p>
              <p
                className="px-3 py-2 hover:bg-gray-100"
                onClick={() => updateStatus(appointment._id, "cancelled")}
              >
                cancelled
              </p>
            </PrimaryDropDown>

            <div className="flex gap-2">
              <button className="text-sm px-3 py-1.5 bg-white border border-[#FEDF89] rounded-md shadow-sm text-[#B54708] hover:bg-[#FFFAEB]">
                Reschedule
              </button>
              <PrimaryModal
                title="Are you sure you want to cancel?"
                onConfirm={() => toast("Cancelled")}
              >
                <button className="text-sm px-3 py-1.5 bg-white border border-[#FECDCA] rounded-md shadow-sm text-[#B42318] hover:bg-[#FEF3F2]">
                  Cancel
                </button>
              </PrimaryModal>
            </div>
          </PrimaryTableRow>
        ))}
      </PrimaryTable>

      {filteredAppointments.length > 0 && (
        <div className="mt-4 flex justify-center">
          <Pagination
            totalPages={Math.ceil(filteredAppointments.length / itemsPerPage)}
            pageChangeHandler={pageChangeHandler}
          />
        </div>
      )}
    </div>
  );
};

export default Appointments;


