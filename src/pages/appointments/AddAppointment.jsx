// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
// import { apiClient } from "../../core/utils/apiClient";
// import { Endpoints } from "../../core/utils/endpoints";
// import PrimaryButton from "../../core/components/PrimaryButton";
// import { useNavigate } from "react-router-dom";

// const AddAppointment = () => {
//   const navigate = useNavigate();

//   const {
//     register,
//     handleSubmit,
//     setValue,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm({
//     defaultValues: {
//       doctorId: "",
//       patientId: "",
//       date: "",
//       treatment: "",
//       status: "upcoming",
//     },
//   });

//   const [doctorSearch, setDoctorSearch] = useState("");
//   const [patientSearch, setPatientSearch] = useState("");
//   const [doctorResults, setDoctorResults] = useState([]);
//   const [patientResults, setPatientResults] = useState([]);

//   // 🔍 فلترة الدكاترة من الفرونت
//  useEffect(() => {
//   const fetchDoctors = async () => {
//     if (doctorSearch.trim().length < 2) return setDoctorResults([]);
//     try {
//       const res = await apiClient.get(`/doctors`, {
//         params: {
//           name: doctorSearch
//         }
//       });
//       const filtered = res.data.data;
//       setDoctorResults(filtered);
//     } catch (err) {
//       setDoctorResults([]);
//     }
//   };

//   const delay = setTimeout(fetchDoctors, 400); // debounce
//   return () => clearTimeout(delay);
// }, [doctorSearch]);


//   // 🔍 فلترة البيشنت من الفرونت
//   useEffect(() => {
//     console.log("oo");
    
//     const fetchPatients = async () => {
//       if (patientSearch.trim().length < 2) return setPatientResults([]);
//       try {
//         const res = await apiClient.get(`/patients`,{
//           params:{
//             name:patientSearch
//           }
//         });
//         console.log("dat",res);
        
//         const filtered = res.data.data;
//         setPatientResults(filtered);
//       } catch (err) {
//         setPatientResults([]);
//       }
//     };

//     const delay = setTimeout(fetchPatients, 400); // debounce
//     return () => clearTimeout(delay);
//   }, [patientSearch]);

//   const handleSelectDoctor = (e) => {
//     setValue("doctorId", e.target.value);
//   };

//   const handleSelectPatient = (e) => {
//     setValue("patientId", e.target.value);
//   };

//   const onSubmit = async (data) => {
//     try {
//       await apiClient.post(Endpoints.appointments, data);
//       toast("Appointment added successfully", { type: "success" });
//       reset();
//       navigate("/appointments");
//     } catch (error) {
//       toast(`Error adding appointment: ${error.response?.data?.message ?? error.message}`, {
//         type: "error",
//       });
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-8 rounded-xl">
//       <div className="bg-white rounded-xl shadow p-8 w-full max-w-3xl mx-auto">
//         <h1 className="text-2xl font-bold text-[#233955] mb-6">
//           Add New Appointment
//         </h1>
//         <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

//           {/* 🔍 Doctor input */}
//           <div>
//             <label className="block text-sm font-medium text-[#233955] mb-2">
//               Doctor *
//             </label>
//             <input
//               type="text"
//               value={doctorSearch}
//               onChange={(e) => setDoctorSearch(e.target.value)}
//               placeholder="Search doctor by name"
//               className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-[#a2f2ee] focus:border-[#a2f2ee]"
//             />
//             {doctorResults.length > 0 && (
//               <select onChange={handleSelectDoctor} className="mt-2 w-full px-4 py-2 rounded-xl border-2 border-gray-300">
//                 <option value="">Select doctor</option>
//                 {doctorResults.map((doc) => (
//                   <option key={doc._id} value={doc._id}>
//                     {doc.name}
//                   </option>
//                 ))}
//               </select>
//             )}
//             {errors.doctorId && (
//               <p className="text-sm text-red-600 mt-1">{errors.doctorId.message}</p>
//             )}
//           </div>

//           {/* 🔍 Patient input */}
//           <div>
//             <label className="block text-sm font-medium text-[#233955] mb-2">
//               Patient *
//             </label>
//             <input
//               type="text"
//               value={patientSearch}
//               onChange={(e) => setPatientSearch(e.target.value)}
//               placeholder="Search patient by name"
//               className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:ring-[#a2f2ee] focus:border-[#a2f2ee]"
//             />
//             {patientResults.length > 0 && (
//               <select onChange={handleSelectPatient} className="mt-2 w-full px-4 py-2 rounded-xl border-2 border-gray-300">
//                 <option value="">Select patient</option>
//                 {patientResults.map((pat) => (
//                   <option key={pat._id} value={pat._id}>
//                     {pat.fullName}
//                   </option>
//                 ))}
//               </select>
//             )}
//             {errors.patientId && (
//               <p className="text-sm text-red-600 mt-1">{errors.patientId.message}</p>
//             )}
//           </div>

//           {/* Date */}
//           <div>
//             <label className="block text-sm font-medium text-[#233955] mb-2">
//               Appointment Date *
//             </label>
//             <input
//               type="datetime-local"
//               {...register("date", { required: "Date is required" })}
//               className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] ${
//                 errors.date ? "border-red-300" : "border-gray-200"
//               }`}
//             />
//             {errors.date && (
//               <p className="text-sm text-red-600 mt-1">
//                 {errors.date.message}
//               </p>
//             )}
//           </div>

//           {/* Treatment */}
//           <div>
//             <label className="block text-sm font-medium text-[#233955] mb-2">
//               Treatment *
//             </label>
//             <input
//               type="text"
//               {...register("treatment", { required: "Treatment is required" })}
//               placeholder="Ex: Skin Allergy Test"
//               className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] ${
//                 errors.treatment ? "border-red-300" : "border-gray-200"
//               }`}
//             />
//             {errors.treatment && (
//               <p className="text-sm text-red-600 mt-1">
//                 {errors.treatment.message}
//               </p>
//             )}
//           </div>

//           {/* Status */}
//           <div>
//             <label className="block text-sm font-medium text-[#233955] mb-2">
//               Status *
//             </label>
//             <select
//               {...register("status", { required: true })}
//               className="w-full px-4 py-3 rounded-xl border-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] border-gray-200"
//             >
//               <option value="upcoming">Upcoming</option>
//               <option value="done">Done</option>
//               <option value="cancelled">Cancelled</option>
//             </select>
//           </div>

//           <PrimaryButton type="submit" className="w-full" disabled={isSubmitting}>
//             {isSubmitting ? "Saving..." : "Add Appointment"}
//           </PrimaryButton>
//         </form>
//       </div>
//     </div>
//   );
// };




// import { useState, useEffect } from "react";
// import { useForm } from "react-hook-form";
// import { toast } from "react-toastify";
// import { apiClient } from "../../core/utils/apiClient";
// import { Endpoints } from "../../core/utils/endpoints";
// import PrimaryButton from "../../core/components/PrimaryButton";
// import { useNavigate, Link } from "react-router-dom";
// import { IoIosArrowBack } from "react-icons/io";
// import {
//   CiUser,
//   CiPhone,
//   CiCalendar,
//   CiClock2,
//   CiMedicalCase,
//   CiSearch
// } from "react-icons/ci";

// const AddAppointment = () => {
//   const navigate = useNavigate();
//   const {
//     register,
//     handleSubmit,
//     setValue,
//     watch,
//     formState: { errors, isSubmitting },
//     reset,
//   } = useForm({
//     defaultValues: {
//       doctorId: "",
//       patientId: "",
//       date: "",
//       timeSlot: "",
//       treatment: "",
//       status: "upcoming",
//     },
//   });

//   const [doctors, setDoctors] = useState([]);
//   const [patients, setPatients] = useState([]);
//   const [availableSlots, setAvailableSlots] = useState([]);
//   const [loadingSlots, setLoadingSlots] = useState(false);
//   const [selectedDate, setSelectedDate] = useState("");
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [selectedPatient, setSelectedPatient] = useState(null);
  
//   // للبحث التفاعلي
//   const [doctorSearch, setDoctorSearch] = useState("");
//   const [patientSearch, setPatientSearch] = useState("");
//   const [filteredDoctors, setFilteredDoctors] = useState([]);
//   const [filteredPatients, setFilteredPatients] = useState([]);
//   const [showDoctorResults, setShowDoctorResults] = useState(false);
//   const [showPatientResults, setShowPatientResults] = useState(false);

//   // Fetch all doctors and patients
//   useEffect(() => {
//     const fetchDoctors = async () => {
//       try {
//         const res = await apiClient.get(Endpoints.doctors);
//         setDoctors(res.data.data);
//       } catch (err) {
//         console.error("Error fetching doctors:", err);
//         toast.error("Failed to load doctors");
//       }
//     };

//     const fetchPatients = async () => {
//       try {
//         const res = await apiClient.get(Endpoints.patients);
//         setPatients(res.data.data);
//       } catch (err) {
//         console.error("Error fetching patients:", err);
//         toast.error("Failed to load patients");
//       }
//     };

//     fetchDoctors();
//     fetchPatients();
//   }, []);

//   // تصفية الأطباء عند الكتابة
//   useEffect(() => {
//     if (doctorSearch.trim() === "") {
//       setFilteredDoctors([]);
//       return;
//     }
    
//     const filtered = doctors.filter(doctor =>
//       doctor.name.toLowerCase().includes(doctorSearch.toLowerCase()) ||
//       doctor.specialization.toLowerCase().includes(doctorSearch.toLowerCase())
//     );
//     setFilteredDoctors(filtered);
//   }, [doctorSearch, doctors]);

//   // تصفية المرضى عند الكتابة
//   useEffect(() => {
//     if (patientSearch.trim() === "") {
//       setFilteredPatients([]);
//       return;
//     }
    
//     const filtered = patients.filter(patient =>
//       patient.fullName.toLowerCase().includes(patientSearch.toLowerCase()) ||
//       patient.phone.includes(patientSearch)
//     );
//     setFilteredPatients(filtered);
//   }, [patientSearch, patients]);

//   // Fetch available slots when date or doctor changes
//   useEffect(() => {
//     if (!selectedDate || !watch("doctorId")) return;

//     const fetchAvailableSlots = async () => {
//       setLoadingSlots(true);
//       try {
//         const res = await apiClient.get(Endpoints.getDoctorAvailableSlots, {
//           params: {
//             doctorId: watch("doctorId"),
//             date: selectedDate
//           }
//         });
        
//         setAvailableSlots(res.data.data);
//         setValue("timeSlot", ""); // Reset selected time slot
//       } catch (error) {
//         toast.error("Failed to load available slots");
//         console.error(error);
//         setAvailableSlots([]);
//       } finally {
//         setLoadingSlots(false);
//       }
//     };

//     fetchAvailableSlots();
//   }, [selectedDate, watch("doctorId")]);

//   const handleDoctorSelect = (doctor) => {
//     setSelectedDoctor(doctor);
//     setValue("doctorId", doctor._id);
//     setDoctorSearch(doctor.name);
//     setFilteredDoctors([]);
//     setShowDoctorResults(false);
//     setSelectedDate("");
//     setAvailableSlots([]);
//   };

//   const handlePatientSelect = (patient) => {
//     setSelectedPatient(patient);
//     setValue("patientId", patient._id);
//     setPatientSearch(patient.fullName);
//     setFilteredPatients([]);
//     setShowPatientResults(false);
//   };

//   const onSubmit = async (data) => {
//     try {
//       // Combine date and time
//       const appointmentDateTime = `${data.date}T${data.timeSlot}:00`;
//       const appointmentData = {
//         ...data,
//         date: appointmentDateTime
//       };

//       await apiClient.post(Endpoints.appointments, appointmentData);
//       toast.success("Appointment booked successfully");
      
//       // Refresh available slots
//       const res = await apiClient.get(Endpoints.getDoctorAvailableSlots, {
//         params: {
//           doctorId: data.doctorId,
//           date: data.date
//         }
//       });
//       setAvailableSlots(res.data.data);
      
//       reset();
//       setDoctorSearch("");
//       setPatientSearch("");
//       setSelectedDoctor(null);
//       setSelectedPatient(null);
//     } catch (error) {
//       toast.error(
//         `Error booking appointment: ${error.response?.data?.message ?? error.message}`
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 rounded-[8px]">
//       <div className="">
//         <div className="bg-white overflow-hidden rounded-[8px]">
//           {/* Header */}
//           <div className="flex items-center gap-4 bg-[#f3f4f6] px-8 py-6 border-b border-gray-200">
//             <Link to="/appointments">
//               <IoIosArrowBack className="h-5 w-5 text-[#233955]" />
//             </Link>
//             <div className="flex items-center space-x-3">
//               <div className="p-3 bg-white rounded-xl shadow-sm">
//                 <CiCalendar className="h-8 w-8 text-[#233955]" />
//               </div>
//               <div>
//                 <h1 className="text-3xl font-bold text-[#233955]">
//                   Add New Appointment
//                 </h1>
//                 <p className="text-gray-600 mt-1">
//                   Book a new appointment for a patient
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Form */}
//           <form
//             onSubmit={handleSubmit(onSubmit)}
//             className="p-8 space-y-8 md:w-9/10 mx-auto"
//           >
//             {/* Doctor Selection Section */}
//             <div className="space-y-6">
//               <div className="flex items-center space-x-2 mb-6">
//                 <CiUser className="h-5 w-5 text-[#233955]" />
//                 <h2 className="text-xl font-semibold text-[#233955]">
//                   Doctor Information
//                 </h2>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-[#233955] mb-2">
//                   Doctor *
//                 </label>
//                 <div className="relative">
//                   <CiSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                   <input
//                     type="text"
//                     value={doctorSearch}
//                     onChange={(e) => {
//                       setDoctorSearch(e.target.value);
//                       setShowDoctorResults(true);
//                     }}
//                     onFocus={() => setShowDoctorResults(true)}
//                     placeholder="Search for a doctor by name or specialization"
//                     className="w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] border-gray-200"
//                   />
//                   <input
//                     type="hidden"
//                     {...register("doctorId", { required: "Doctor is required" })}
//                   />
//                 </div>
                
//                 {showDoctorResults && filteredDoctors.length > 0 && (
//                   <div className="mt-1 border border-gray-200 rounded-xl max-h-60 overflow-y-auto shadow-lg z-10 bg-white">
//                     {filteredDoctors.map((doctor) => (
//                       <div
//                         key={doctor._id}
//                         className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
//                         onClick={() => handleDoctorSelect(doctor)}
//                       >
//                         <p className="font-medium">{doctor.name}</p>
//                         <p className="text-sm text-gray-500">{doctor.specialization}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
                
//                 {errors.doctorId && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.doctorId.message}
//                   </p>
//                 )}
//               </div>

//               {selectedDoctor && (
//                 <div className="bg-gray-50 p-4 rounded-lg">
//                   <h3 className="font-medium text-[#233955]">Doctor Details</h3>
//                   <p className="text-sm text-gray-600 mt-1">
//                     <span className="font-medium">Specialization:</span> {selectedDoctor.specialization}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     <span className="font-medium">Session Duration:</span> {selectedDoctor.appointmentDuration} minutes
//                   </p>
//                 </div>
//               )}
//             </div>

//             {/* Patient Selection Section */}
//             <div className="space-y-6">
//               <div className="flex items-center space-x-2 mb-6">
//                 <CiUser className="h-5 w-5 text-[#233955]" />
//                 <h2 className="text-xl font-semibold text-[#233955]">
//                   Patient Information
//                 </h2>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-[#233955] mb-2">
//                   Patient *
//                 </label>
//                 <div className="relative">
//                   <CiSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                   <input
//                     type="text"
//                     value={patientSearch}
//                     onChange={(e) => {
//                       setPatientSearch(e.target.value);
//                       setShowPatientResults(true);
//                     }}
//                     onFocus={() => setShowPatientResults(true)}
//                     placeholder="Search for a patient by name or phone"
//                     className="w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] border-gray-200"
//                   />
//                   <input
//                     type="hidden"
//                     {...register("patientId", { required: "Patient is required" })}
//                   />
//                 </div>
                
//                 {showPatientResults && filteredPatients.length > 0 && (
//                   <div className="mt-1 border border-gray-200 rounded-xl max-h-60 overflow-y-auto shadow-lg z-10 bg-white">
//                     {filteredPatients.map((patient) => (
//                       <div
//                         key={patient._id}
//                         className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
//                         onClick={() => handlePatientSelect(patient)}
//                       >
//                         <p className="font-medium">{patient.fullName}</p>
//                         <p className="text-sm text-gray-500">{patient.phone}</p>
//                       </div>
//                     ))}
//                   </div>
//                 )}
                
//                 {errors.patientId && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.patientId.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Appointment Details Section */}
//             <div className="space-y-6">
//               <div className="flex items-center space-x-2 mb-6">
//                 <CiCalendar className="h-5 w-5 text-[#233955]" />
//                 <h2 className="text-xl font-semibold text-[#233955]">
//                   Appointment Details
//                 </h2>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <div>
//                   <label className="block text-sm font-medium text-[#233955] mb-2">
//                     Appointment Date *
//                   </label>
//                   <div className="relative">
//                     <CiCalendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                     <input
//                       type="date"
//                       {...register("date", { required: "Date is required" })}
//                       onChange={(e) => setSelectedDate(e.target.value)}
//                       min={new Date().toISOString().split('T')[0]}
//                       disabled={!watch("doctorId")}
//                       className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
//                         errors.date ? "border-red-300" : "border-gray-200"
//                       }`}
//                     />
//                   </div>
//                   {errors.date && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {errors.date.message}
//                     </p>
//                   )}
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium text-[#233955] mb-2">
//                     Time Slot *
//                   </label>
//                   <div className="relative">
//                     <CiClock2 className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                     <select
//                       {...register("timeSlot", { required: "Time slot is required" })}
//                       disabled={!selectedDate || loadingSlots}
//                       className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
//                         errors.timeSlot ? "border-red-300" : "border-gray-200"
//                       } ${loadingSlots ? "opacity-50" : ""}`}
//                     >
//                       <option value="">Select a time slot</option>
//                       {availableSlots.map((slot) => (
//                         <option 
//                           key={slot.start} 
//                           value={slot.start}
//                           disabled={slot.isBooked}
//                           className={slot.isBooked ? "text-gray-400" : ""}
//                         >
//                           {slot.start} {slot.isBooked && "(Booked)"}
//                         </option>
//                       ))}
//                     </select>
//                     {loadingSlots && (
//                       <div className="absolute right-3 top-3">
//                         <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#233955]"></div>
//                       </div>
//                     )}
//                   </div>
//                   {errors.timeSlot && (
//                     <p className="mt-1 text-sm text-red-600">
//                       {errors.timeSlot.message}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>

//             {/* Treatment Section */}
//             <div className="space-y-6">
//               <div className="flex items-center space-x-2 mb-6">
//                 <CiMedicalCase className="h-5 w-5 text-[#233955]" />
//                 <h2 className="text-xl font-semibold text-[#233955]">
//                   Treatment Details
//                 </h2>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-[#233955] mb-2">
//                   Treatment *
//                 </label>
//                 <div className="relative">
//                   <CiMedicalCase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//                   <input
//                     type="text"
//                     {...register("treatment", { required: "Treatment is required" })}
//                     placeholder="Describe the treatment or reason for appointment"
//                     className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
//                       errors.treatment ? "border-red-300" : "border-gray-200"
//                     }`}
//                   />
//                 </div>
//                 {errors.treatment && (
//                   <p className="mt-1 text-sm text-red-600">
//                     {errors.treatment.message}
//                   </p>
//                 )}
//               </div>
//             </div>

//             {/* Submit Button */}
//             <div className="pt-6 w-xs mx-auto md:w-xl">
//               <PrimaryButton
//                 type="submit"
//                 className="w-full"
//                 disabled={isSubmitting}
//               >
//                 {isSubmitting ? (
//                   <div className="flex items-center justify-center space-x-2">
//                     <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                     <span>{"Booking..."}</span>
//                   </div>
//                 ) : (
//                   <span>{"Book Appointment"}</span>
//                 )}
//               </PrimaryButton>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddAppointment;
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { apiClient } from "../../core/utils/apiClient";
import { Endpoints } from "../../core/utils/endpoints";
import PrimaryButton from "../../core/components/PrimaryButton";
import { useNavigate, Link } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import {
  CiUser,
  CiCalendar,
  CiClock2,
  CiMedicalCase,
  CiSearch
} from "react-icons/ci";

const AddAppointment = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      doctorId: "",
      patientId: "",
      date: "",
      timeSlot: "",
      treatment: "",
      status: "upcoming",
    },
  });

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [weekDays, setWeekDays] = useState([]);
  
  const [doctorSearch, setDoctorSearch] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showDoctorResults, setShowDoctorResults] = useState(false);
  const [showPatientResults, setShowPatientResults] = useState(false);

  // Generate week days
  useEffect(() => {
    const days = [];
    const today = new Date();
    
    for (let i = 0; i < 7; i++) {
      const day = new Date(today);
      day.setDate(today.getDate() + i);
      days.push(day);
    }
    
    setWeekDays(days);
  }, []);

  // Fetch all doctors and patients
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        // Fetch doctors
        const doctorsRes = await apiClient.get(Endpoints.doctors, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setDoctors(doctorsRes.data.data || []);

        // Fetch patients
        const patientsRes = await apiClient.get(Endpoints.patients, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setPatients(patientsRes.data.data || []);

      } catch (err) {
        console.error("Error fetching data:", err);
        if (err.response?.status === 401) {
          toast.error("Session expired. Please login again.");
          navigate('/login');
        } else {
          toast.error("Failed to load data");
        }
      }
    };

    fetchData();
  }, [navigate]);

  // Filter doctors when typing
  useEffect(() => {
    if (doctorSearch.trim() === "") {
      setFilteredDoctors([]);
      return;
    }
    
    const filtered = doctors.filter(doctor => {
      const name = doctor.name || '';
      const specialization = doctor.specialization || '';
      const searchTerm = doctorSearch.toLowerCase();
      
      return (
        name.toLowerCase().includes(searchTerm) ||
        specialization.toLowerCase().includes(searchTerm)
      );
    });
    setFilteredDoctors(filtered);
  }, [doctorSearch, doctors]);

  // Filter patients when typing
  useEffect(() => {
    if (patientSearch.trim() === "") {
      setFilteredPatients([]);
      return;
    }
    
    const filtered = patients.filter(patient => {
      const fullName = patient.fullName || '';
      const phone = patient.phone || '';
      const searchTerm = patientSearch.toLowerCase();
      
      return (
        fullName.toLowerCase().includes(searchTerm) ||
        phone.includes(patientSearch)
      );
    });
    setFilteredPatients(filtered);
  }, [patientSearch, patients]);

  // Generate mock available slots when doctor is selected
  const generateMockSlots = () => {
    if (!watch("doctorId")) return [];
    
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    const duration = 30; // minutes
    
    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += duration) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        slots.push({
          date: selectedDate?.toISOString().split('T')[0] || new Date().toISOString().split('T')[0],
          time,
          isBooked: Math.random() < 0.3 // 30% chance of being booked
        });
      }
    }
    
    return slots;
  };

  // Handle doctor selection
  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setValue("doctorId", doctor._id);
    setDoctorSearch(`${doctor.name} `);

    setFilteredDoctors([]);
    setShowDoctorResults(false);
    
    // Generate mock slots
    setAvailableSlots(generateMockSlots());
  };

  // Handle patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setValue("patientId", patient._id);
    setPatientSearch(patient.fullName);
    setFilteredPatients([]);
    setShowPatientResults(false);
  };

  // Handle day selection
  const handleDaySelect = (day) => {
    setSelectedDate(day);
    setValue("date", day.toISOString().split('T')[0]);
    
    // Regenerate slots for selected day
    if (selectedDoctor) {
      setAvailableSlots(generateMockSlots());
    }
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (time) => {
    setValue("timeSlot", time);
  };

  // Format date
  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    });
  };

  // Submit appointment
  const onSubmit = async (data) => {
    try {
      const appointmentData = {
        doctorId: data.doctorId,
        patientId: data.patientId,
        date: `${data.date}T${data.timeSlot}:00`,
        time: data.timeSlot,
        treatment: data.treatment,
        status: "upcoming"
      };

      const res = await apiClient.post(
        Endpoints.appointments,
        appointmentData,
        {
          headers: { 
            Authorization: `Bearer ${localStorage.getItem('token')}` 
          }
        }
      );

      toast.success("Appointment booked successfully!");
      reset();
      setDoctorSearch("");
      setPatientSearch("");
      setSelectedDoctor(null);
      setSelectedPatient(null);
      navigate("/appointments");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to book appointment"
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 rounded-[8px]">
      <div className="">
        <div className="bg-white overflow-hidden rounded-[8px]">
          {/* Header */}
          <div className="flex items-center gap-4 bg-[#f3f4f6] px-8 py-6 border-b border-gray-200">
            <Link to="/appointments">
              <IoIosArrowBack className="h-5 w-5 text-[#233955]" />
            </Link>
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-white rounded-xl shadow-sm">
                <CiCalendar className="h-8 w-8 text-[#233955]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#233955]">
                  Book New Appointment
                </h1>
                <p className="text-gray-600 mt-1">
                  Schedule a new appointment for a patient
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="p-8 space-y-8 md:w-9/10 mx-auto"
          >
            {/* Doctor Selection Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <CiUser className="h-5 w-5 text-[#233955]" />
                <h2 className="text-xl font-semibold text-[#233955]">
                  Doctor Information
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#233955] mb-2">
                  Doctor *
                </label>
                <div className="relative">
                  <CiSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={doctorSearch}
                    onChange={(e) => {
                      setDoctorSearch(e.target.value);
                      setShowDoctorResults(true);
                    }}
                    onFocus={() => setShowDoctorResults(true)}
                    placeholder="Search doctor by name or specialization"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] border-gray-200"
                  />
                  <input
                    type="hidden"
                    {...register("doctorId", { required: "Doctor is required" })}
                  />
                </div>
                
                {showDoctorResults && filteredDoctors.length > 0 && (
                  <div className="mt-1 border border-gray-200 rounded-xl max-h-60 overflow-y-auto shadow-lg z-10 bg-white">
                    {filteredDoctors.map((doctor) => (
                      <div
                        key={doctor._id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                        onClick={() => handleDoctorSelect(doctor)}
                      >
                        <p className="font-medium">{doctor.name}</p>
                        <p className="text-sm text-gray-500">{doctor.specialization}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {errors.doctorId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.doctorId.message}
                  </p>
                )}
              </div>
            </div>

            {/* Patient Selection Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <CiUser className="h-5 w-5 text-[#233955]" />
                <h2 className="text-xl font-semibold text-[#233955]">
                  Patient Information
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#233955] mb-2">
                  Patient *
                </label>
                <div className="relative">
                  <CiSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    value={patientSearch}
                    onChange={(e) => {
                      setPatientSearch(e.target.value);
                      setShowPatientResults(true);
                    }}
                    onFocus={() => setShowPatientResults(true)}
                    placeholder="Search patient by name or phone"
                    className="w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] border-gray-200"
                  />
                  <input
                    type="hidden"
                    {...register("patientId", { required: "Patient is required" })}
                  />
                </div>
                
                {showPatientResults && filteredPatients.length > 0 && (
                  <div className="mt-1 border border-gray-200 rounded-xl max-h-60 overflow-y-auto shadow-lg z-10 bg-white">
                    {filteredPatients.map((patient) => (
                      <div
                        key={patient._id}
                        className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
                        onClick={() => handlePatientSelect(patient)}
                      >
                        <p className="font-medium">{patient.fullName}</p>
                        <p className="text-sm text-gray-500">{patient.phone}</p>
                      </div>
                    ))}
                  </div>
                )}
                
                {errors.patientId && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.patientId.message}
                  </p>
                )}
              </div>
            </div>

            {/* Appointment Schedule Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <CiCalendar className="h-5 w-5 text-[#233955]" />
                <h2 className="text-xl font-semibold text-[#233955]">
                  Appointment Schedule
                </h2>
              </div>

              {!selectedDoctor ? (
                <div className="bg-blue-50 p-4 rounded-lg text-blue-800">
                  Please select a doctor first to view available schedule
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid grid-cols-7 gap-2">
                    {weekDays.map((day, index) => (
                      <div
                        key={index}
                        onClick={() => handleDaySelect(day)}
                        className={`p-2 text-center rounded-lg cursor-pointer ${
                          selectedDate?.toDateString() === day.toDateString()
                            ? 'bg-[#a2f2ee] text-[#233955] font-medium'
                            : 'bg-white border border-gray-200 hover:bg-gray-50'
                        }`}
                      >
                        <div className="font-medium">
                          {formatDate(day).split(' ')[0]}
                        </div>
                        <div className="text-sm">
                          {formatDate(day).split(' ')[1]}
                        </div>
                      </div>
                    ))}
                  </div>

                  {selectedDate && (
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <h3 className="font-medium mb-3">
                        Available slots for {selectedDate.toLocaleDateString('en-US')}
                      </h3>
                      {availableSlots.length > 0 ? (
                        <div className="grid grid-cols-3 gap-2">
                          {availableSlots
                            .filter(slot => slot.date === selectedDate.toISOString().split('T')[0])
                            .map((slot, idx) => (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => handleTimeSlotSelect(slot.time)}
                                disabled={slot.isBooked}
                                className={`p-2 rounded border text-sm ${
                                  watch("timeSlot") === slot.time
                                    ? 'bg-[#a2f2ee] border-[#233955]'
                                    : slot.isBooked
                                      ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                      : 'bg-white hover:bg-gray-50'
                                }`}
                              >
                                <div className="flex items-center justify-center">
                                  <CiClock2 className="mr-1" />
                                  {slot.time}
                                  {slot.isBooked && <span className="text-xs mr-1">(Booked)</span>}
                                </div>
                              </button>
                            ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">No available slots for selected date</p>
                      )}
                      <input
                        type="hidden"
                        {...register("date", { required: "Date is required" })}
                      />
                      <input
                        type="hidden"
                        {...register("timeSlot", { required: "Time slot is required" })}
                      />
                      {errors.date && (
                        <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                      )}
                      {errors.timeSlot && (
                        <p className="mt-1 text-sm text-red-600">{errors.timeSlot.message}</p>
                      )}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Treatment Section */}
            <div className="space-y-6">
              <div className="flex items-center space-x-2 mb-6">
                <CiMedicalCase className="h-5 w-5 text-[#233955]" />
                <h2 className="text-xl font-semibold text-[#233955]">
                  Treatment Details
                </h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#233955] mb-2">
                  Reason for Visit *
                </label>
                <div className="relative">
                  <CiMedicalCase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                  <input
                    type="text"
                    {...register("treatment", { required: "Reason for visit is required" })}
                    placeholder="Describe the reason for visit or initial diagnosis"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                      errors.treatment ? "border-red-300" : "border-gray-200"
                    }`}
                  />
                </div>
                {errors.treatment && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.treatment.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-6 w-xs mx-auto md:w-xl">
              <PrimaryButton
                type="submit"
                className="w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center space-x-2">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>{"Saving..."}</span>
                  </div>
                ) : (
                  <span>{"Book Appointment"}</span>
                )}
              </PrimaryButton>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddAppointment;