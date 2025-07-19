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
// 

// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { toast } from 'react-toastify';
// import { apiClient } from '../../core/utils/apiClient';
// import { Endpoints } from '../../core/utils/endpoints';
// import PrimaryButton from '../../core/components/PrimaryButton';
// import { useNavigate, Link } from 'react-router-dom';
// import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
// import { CiUser, CiCalendar, CiClock2, CiMedicalCase, CiSearch } from 'react-icons/ci';

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

//   // State variables
//   const [doctors, setDoctors] = useState([]);
//   const [patients, setPatients] = useState([]);
//   const [doctorSchedules, setDoctorSchedules] = useState([]);
//   const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
//   const [loadingSlots, setLoadingSlots] = useState(false);
//   const [selectedDate, setSelectedDate] = useState(null);
//   const [selectedDoctor, setSelectedDoctor] = useState(null);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [currentMonth, setCurrentMonth] = useState(new Date());
//   const [calendarDays, setCalendarDays] = useState([]);
//   const [doctorSearch, setDoctorSearch] = useState("");
//   const [patientSearch, setPatientSearch] = useState("");
//   const [filteredDoctors, setFilteredDoctors] = useState([]);
//   const [filteredPatients, setFilteredPatients] = useState([]);
//   const [showDoctorResults, setShowDoctorResults] = useState(false);
//   const [showPatientResults, setShowPatientResults] = useState(false);

//   // Generate calendar days
//   // const generateCalendarDays = (date) => {
//   //   const startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
//   //   const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    
//   //   const days = [];
    
//   //   // Previous month days (disabled)
//   //   for (let i = 0; i < startDay; i++) {
//   //     days.push({
//   //       date: new Date(date.getFullYear(), date.getMonth(), -i),
//   //       isCurrentMonth: false,
//   //       hasSlots: false
//   //     });
//   //   }
    
//   //   // Current month days
//   //   for (let i = 1; i <= daysInMonth; i++) {
//   //     const dayDate = new Date(date.getFullYear(), date.getMonth(), i);
//   //     const dateStr = dayDate.toISOString().split('T')[0];
//   //     const daySchedule = doctorSchedules.find(s => s.date === dateStr);
//   //     const hasSlots = daySchedule?.timeSlots?.length > 0;
      
//   //     days.push({
//   //       date: dayDate,
//   //       isCurrentMonth: true,
//   //       hasSlots
//   //     });
//   //   }
    
//   //   // Next month days (disabled)
//   //   const daysToAdd = 42 - days.length;
//   //   for (let i = 1; i <= daysToAdd; i++) {
//   //     days.push({
//   //       date: new Date(date.getFullYear(), date.getMonth() + 1, i),
//   //       isCurrentMonth: false,
//   //       hasSlots: false
//   //     });
//   //   }
    
//   //   return days;
//   // };

//   // useEffect(() => {
//   //   setCalendarDays(generateCalendarDays(currentMonth));
//   // }, [currentMonth, doctorSchedules]);

//  const generateCalendarDays = (date, schedules) => {
//   const startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
//   const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();

//   // فقط التاريخ بدون توقيت
//   const scheduledDateStrings = schedules.map(s => s.date.split('T')[0]);

//   const days = [];

//   // Previous month padding
//   for (let i = 0; i < startDay; i++) {
//     days.push({
//       date: new Date(date.getFullYear(), date.getMonth(), -i),
//       isCurrentMonth: false,
//       hasSlots: false
//     });
//   }

//   // Current month days
//   for (let i = 1; i <= daysInMonth; i++) {
//     const dayDate = new Date(date.getFullYear(), date.getMonth(), i);
//     const dayDateStr = dayDate.toISOString().split('T')[0]; // دا هيبقى "2025-07-03"
//     const hasSlot = scheduledDateStrings.includes(dayDateStr);

//     days.push({
//       date: dayDate,
//       isCurrentMonth: true,
//       hasSlots: hasSlot
//     });
//   }

//   // Next month padding
//   const daysToAdd = 42 - days.length;
//   for (let i = 1; i <= daysToAdd; i++) {
//     days.push({
//       date: new Date(date.getFullYear(), date.getMonth() + 1, i),
//       isCurrentMonth: false,
//       hasSlots: false
//     });
//   }

//   return days;
// };


//   // Fetch doctors and patients data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           navigate('/login');
//           return;
//         }

//         const [doctorsRes, patientsRes] = await Promise.all([
//           apiClient.get(Endpoints.doctors, {
//             headers: { Authorization: `Bearer ${token}` }
//           }),
//           apiClient.get(Endpoints.patients, {
//             headers: { Authorization: `Bearer ${token}` }
//           })
//         ]);

//         setDoctors(doctorsRes.data.data || []);
//         setPatients(patientsRes.data.data || []);

//       } catch (err) {
//         console.error("Error fetching data:", err);
//         if (err.response?.status === 401) {
//           toast.error("Session expired. Please login again.");
//           navigate('/login');
//         } else {
//           toast.error("Failed to load data");
//         }
//       }
//     };

//     fetchData();
//   }, [navigate]);

//   // Fetch doctor schedules when selected doctor changes
// useEffect(() => {
//   const fetchDoctorSchedule = async () => {
//     if (!selectedDoctor) return;

//     try {
//       const token = localStorage.getItem('token');
//       const response = await apiClient.get(
//         `${Endpoints.doctorSchedule}?doctorId=${selectedDoctor._id}`,
//         {
//           headers: { Authorization: `Bearer ${token}` }
//         }
//       );

//       const schedules = response.data.data || [];
//       setDoctorSchedules(schedules);

//       // نحدث التقويم فورًا بالتواريخ
//       const days = generateCalendarDays(currentMonth, schedules);
//       setCalendarDays(days);

//     } catch (error) {
//       console.error("Error fetching doctor schedule:", error);
//       toast.error("Failed to load doctor schedule");
//     }
//   };

//   fetchDoctorSchedule();
// }, [selectedDoctor, currentMonth]);


//   // Filter doctors based on search
//   useEffect(() => {
//     if (doctorSearch.trim() === "") {
//       setFilteredDoctors([]);
//       return;
//     }
    
//     const filtered = doctors.filter(doctor => {
//       const name = doctor.name || '';
//       const specialization = doctor.specialization || '';
//       const searchTerm = doctorSearch.toLowerCase();
      
//       return (
//         name.toLowerCase().includes(searchTerm) ||
//         specialization.toLowerCase().includes(searchTerm)
//       );
//     });
//     setFilteredDoctors(filtered);
//   }, [doctorSearch, doctors]);

//   // Filter patients based on search
//   useEffect(() => {
//     if (patientSearch.trim() === "") {
//       setFilteredPatients([]);
//       return;
//     }
    
//     const filtered = patients.filter(patient => {
//       const fullName = patient.fullName || '';
//       const phone = patient.phone || '';
//       const searchTerm = patientSearch.toLowerCase();
      
//       return (
//         fullName.toLowerCase().includes(searchTerm) ||
//         phone.includes(patientSearch)
//       );
//     });
//     setFilteredPatients(filtered);
//   }, [patientSearch, patients]);

//   // Fetch available time slots for selected date
// const fetchAvailableSlots = async (date) => {
//   if (!selectedDoctor || !date) return [];

//   setLoadingSlots(true);
//   try {
//     const dateStr = date.toISOString().split('T')[0];

//     // دور على schedule الخاص باليوم المحدد
//     const daySchedule = doctorSchedules.find(s => s.date.split('T')[0] === dateStr);

//     if (!daySchedule) return [];

//     const slots = generateTimeSlots(daySchedule.from, daySchedule.to, dateStr);

//     // لاحقًا ممكن تجيب قائمة بالمواعيد المحجوزة من الـ backend وتعلّم عليها هنا
//     return slots;

//   } catch (error) {
//     console.error("Error generating slots:", error);
//     return [];
//   } finally {
//     setLoadingSlots(false);
//   }
// };

// const generateTimeSlots = (from, to, dateStr, intervalMinutes = 30) => {
//   const slots = [];
  
//   const [fromHours, fromMinutes] = from.split(':').map(Number);
//   const [toHours, toMinutes] = to.split(':').map(Number);

//   const fromDate = new Date(`${dateStr}T${from}`);
//   const toDate = new Date(`${dateStr}T${to}`);

//   let current = new Date(fromDate);

//   while (current < toDate) {
//     const hours = current.getHours().toString().padStart(2, '0');
//     const minutes = current.getMinutes().toString().padStart(2, '0');

//     slots.push({
//       date: dateStr,
//       start: `${hours}:${minutes}`,
//       isBooked: false // تقدر تعلّمها true لو عملت مقارنة مع قائمة المواعيد المحجوزة
//     });

//     current.setMinutes(current.getMinutes() + intervalMinutes);
//   }

//   return slots;
// };

//   // Update available slots when date changes
//   useEffect(() => {
//     const fetchSlots = async () => {
//       if (selectedDate) {
//         const slots = await fetchAvailableSlots(selectedDate);
//         setAvailableTimeSlots(slots);
//       }
//     };
    
//     fetchSlots();
//   }, [selectedDate, doctorSchedules]);

//   // Navigation functions
//   const prevMonth = () => {
//     setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
//   };

//   const nextMonth = () => {
//     setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
//   };

//   // Handle doctor selection
//   const handleDoctorSelect = (doctor) => {
//     setSelectedDoctor(doctor);
//     setValue("doctorId", doctor._id);
//     setDoctorSearch(`${doctor.name} - ${doctor.specialization}`);
//     setFilteredDoctors([]);
//     setShowDoctorResults(false);
//     setSelectedDate(null);
//     setDoctorSchedules([]);
//     setAvailableTimeSlots([]);
//     setValue("date", "");
//     setValue("timeSlot", "");
//   };

//   // Handle patient selection
//   const handlePatientSelect = (patient) => {
//     setSelectedPatient(patient);
//     setValue("patientId", patient._id);
//     setPatientSearch(patient.fullName);
//     setFilteredPatients([]);
//     setShowPatientResults(false);
//   };

//   // Handle date selection
//   const handleDaySelect = (day) => {
//     setSelectedDate(day);
//     setValue("date", day.toISOString().split('T')[0]);
//     setValue("timeSlot", "");
//   };
  

//   // Handle time slot selection
//   const handleTimeSlotSelect = (time) => {
//     setValue("timeSlot", time);
//   };

//   // Format time to 12-hour format
//  const formatTime12Hour = (time) => {
//   const [rawHours, rawMinutes] = time.split(':');
//   const hours = parseInt(rawHours, 10);
//   const minutes = parseInt(rawMinutes, 10);
//   const period = hours >= 12 ? 'PM' : 'AM';
//   const hours12 = hours % 12 || 12;
//   return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
// };


//   // Submit appointment form
//   const onSubmit = async (data) => {
//     try {
//       const dateTime = `${data.date}T${data.timeSlot}:00`;
      
//       const appointmentData = {
//         doctorId: data.doctorId,
//         patientId: data.patientId,
//         date: dateTime,
//         treatment: data.treatment
//       };

//       const res = await apiClient.post(
//         Endpoints.appointments,
//         appointmentData,
//         {
//           headers: { 
//             Authorization: `Bearer ${localStorage.getItem('token')}`,
//             'Content-Type': 'application/json'
//           }
//         }
//       );

//       toast.success("Appointment booked successfully!");
//       reset();
//       setDoctorSearch("");
//       setPatientSearch("");
//       setSelectedDoctor(null);
//       setSelectedPatient(null);
//       setSelectedDate(null);
//       setDoctorSchedules([]);
//       setAvailableTimeSlots([]);
//       navigate("/appointments");
      
//     } catch (error) {
//       toast.error(
//         error.response?.data?.message || 
//         "Failed to book appointment. Please try again."
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="bg-white shadow-sm rounded-lg overflow-hidden max-w-4xl mx-auto">
//         {/* Header */}
//         <div className="bg-blue-50 px-6 py-4 border-b border-blue-100">
//           <div className="flex items-center">
//             <Link to="/appointments" className="mr-4 p-1 rounded-full hover:bg-blue-100">
//               <IoIosArrowBack className="h-5 w-5 text-blue-600" />
//             </Link>
//             <div className="flex items-center space-x-3">
//               <div className="p-2 bg-white rounded-lg shadow">
//                 <CiCalendar className="h-6 w-6 text-blue-600" />
//               </div>
//               <div>
//                 <h1 className="text-2xl font-bold text-gray-800">Book New Appointment</h1>
//                 <p className="text-gray-600">Schedule an appointment for a patient</p>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
//           {/* Doctor Selection */}
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold text-gray-800 flex items-center">
//               <CiUser className="mr-2 text-blue-500" />
//               Doctor Information
//             </h2>
//             <div className="relative">
//               <CiSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 value={doctorSearch}
//                 onChange={(e) => {
//                   setDoctorSearch(e.target.value);
//                   setShowDoctorResults(true);
//                 }}
//                 onFocus={() => setShowDoctorResults(true)}
//                 onBlur={() => setTimeout(() => setShowDoctorResults(false), 200)}
//                 placeholder="Search doctor by name or specialty"
//                 className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
//               />
//               <input type="hidden" {...register("doctorId", { required: true })} />
//               {errors.doctorId && <p className="mt-1 text-sm text-red-600">Doctor is required</p>}
//             </div>
//             {/* Doctor search results dropdown */}
//             {showDoctorResults && filteredDoctors.length > 0 && (
//               <div className="mt-1 border border-gray-200 rounded-lg shadow-lg bg-white max-h-60 overflow-y-auto">
//                 {filteredDoctors.map((doctor) => (
//                   <div
//                     key={doctor._id}
//                     className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
//                     onClick={() => handleDoctorSelect(doctor)}
//                   >
//                     <p className="font-medium text-gray-800">{doctor.name}</p>
//                     <p className="text-sm text-gray-500">{doctor.specialization}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Patient Selection */}
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold text-gray-800 flex items-center">
//               <CiUser className="mr-2 text-blue-500" />
//               Patient Information
//             </h2>
//             <div className="relative">
//               <CiSearch className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 value={patientSearch}
//                 onChange={(e) => {
//                   setPatientSearch(e.target.value);
//                   setShowPatientResults(true);
//                 }}
//                 onFocus={() => setShowPatientResults(true)}
//                 onBlur={() => setTimeout(() => setShowPatientResults(false), 200)}
//                 placeholder="Search patient by name or phone"
//                 className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
//               />
//               <input type="hidden" {...register("patientId", { required: true })} />
//               {errors.patientId && <p className="mt-1 text-sm text-red-600">Patient is required</p>}
//             </div>
//             {/* Patient search results dropdown */}
//             {showPatientResults && filteredPatients.length > 0 && (
//               <div className="mt-1 border border-gray-200 rounded-lg shadow-lg bg-white max-h-60 overflow-y-auto">
//                 {filteredPatients.map((patient) => (
//                   <div
//                     key={patient._id}
//                     className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100"
//                     onClick={() => handlePatientSelect(patient)}
//                   >
//                     <p className="font-medium text-gray-800">{patient.fullName}</p>
//                     <p className="text-sm text-gray-500">{patient.phone}</p>
//                   </div>
//                 ))}
//               </div>
//             )}
//           </div>

//           {/* Appointment Schedule */}
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold text-gray-800 flex items-center">
//               <CiCalendar className="mr-2 text-blue-500" />
//               Appointment Schedule
//             </h2>

//             {!selectedDoctor ? (
//               <div className="bg-blue-50 p-4 rounded-lg text-blue-800">
//                 Please select a doctor first to view available schedule
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {/* Calendar Navigation */}
//                 <div className="flex items-center justify-between">
//                   <button
//                     type="button"
//                     onClick={prevMonth}
//                     className="p-2 rounded-full hover:bg-gray-100"
//                   >
//                     <IoIosArrowBack className="h-5 w-5 text-gray-600" />
//                   </button>
//                   <h3 className="text-lg font-medium text-gray-700">
//                     {currentMonth.toLocaleDateString('en-US', {
//                       month: 'long',
//                       year: 'numeric'
//                     })}
//                   </h3>
//                   <button
//                     type="button"
//                     onClick={nextMonth}
//                     className="p-2 rounded-full hover:bg-gray-100"
//                   >
//                     <IoIosArrowForward className="h-5 w-5 text-gray-600" />
//                   </button>
//                 </div>
// {/* /////////////////////////////////////////// */}
//                 {/* Calendar Grid */}
//               <div className="grid grid-cols-7 gap-1">
//   {calendarDays.map((day, index) => {
//     const isSelected = selectedDate?.toDateString() === day.date.toDateString();
//     const isToday = new Date().toDateString() === day.date.toDateString();
//     const isAvailable = day.hasSlots;

//     return (
//       <button
//         key={index}
//         type="button"
//         onClick={() => isAvailable && handleDaySelect(day)}
//         disabled={!isAvailable}
//         className={`
//           h-12 rounded-lg transition-colors flex flex-col items-center justify-center
//           ${isSelected ? 'bg-blue-600 text-white' : ''}
//           ${isAvailable && !isSelected
//             ? 'bg-white text-gray-800 border border-green-400 hover:bg-green-50 cursor-pointer'
//             : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'}
//           ${isToday && !isSelected ? 'ring-2 ring-blue-400' : ''}
//         `}
//       >
//         <span className="text-sm font-medium">
//           {day.date.getDate()}
//         </span>

//         {isAvailable && !isSelected && (
//           <span className="w-2 h-2 mt-1 rounded-full bg-green-500"></span>
//         )}
//       </button>
//     );
//   })}
// </div>
// {/* /////////////////////////////////////////////////// */}

//                 {/* Time Slots Selection */}
//                 {selectedDate && (
//                   <div className="bg-gray-50 p-4 rounded-lg mt-4">
//                     <h3 className="font-medium text-gray-800 mb-3">
//                       Available time slots for {selectedDate.toLocaleDateString('en-US', {
//                         weekday: 'long',
//                         month: 'long',
//                         day: 'numeric'
//                       })}
//                     </h3>
                    
//                     {loadingSlots ? (
//                       <div className="flex justify-center py-4">
//                         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
//                       </div>
//                     ) : availableTimeSlots.length > 0 ? (
//                       <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
//                         {availableTimeSlots.map((slot, idx) => (
//                           <button
//                             key={idx}
//                             type="button"
//                             onClick={() => handleTimeSlotSelect(slot.start)}
//                             disabled={slot.isBooked}
//                             className={`
//                               p-2 rounded border text-sm transition-colors
//                               ${watch("timeSlot") === slot.start ? 'bg-blue-600 text-white border-blue-600' : ''}
//                               ${!slot.isBooked && watch("timeSlot") !== slot.start ? 'bg-white hover:bg-gray-50 border-gray-300' : ''}
//                               ${slot.isBooked ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : ''}
//                             `}
//                           >
//                             <div className="flex items-center justify-center">
//                               <CiClock2 className="mr-1" />
//                               {formatTime12Hour(slot.start)}
//                               {slot.isBooked && <span className="text-xs ml-1">(Booked)</span>}
//                             </div>
//                           </button>
//                         ))}
//                       </div>
//                     ) : (
//                       <p className="text-gray-500">No available time slots</p>
//                     )}
//                     <input type="hidden" {...register("date", { required: true })} />
//                     <input type="hidden" {...register("timeSlot", { required: true })} />
//                     {errors.date && <p className="mt-1 text-sm text-red-600">Date is required</p>}
//                     {errors.timeSlot && <p className="mt-1 text-sm text-red-600">Time slot is required</p>}
//                   </div>
//                 )}
//               </div>
//             )}
//           </div>

//           {/* Treatment Details */}
//           <div className="space-y-4">
//             <h2 className="text-lg font-semibold text-gray-800 flex items-center">
//               <CiMedicalCase className="mr-2 text-blue-500" />
//               Treatment Details
//             </h2>
//             <div className="relative">
//               <CiMedicalCase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
//               <input
//                 type="text"
//                 {...register("treatment", { required: true })}
//                 placeholder="Reason for visit or treatment description"
//                 className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
//               />
//               {errors.treatment && <p className="mt-1 text-sm text-red-600">Treatment description is required</p>}
//             </div>
//           </div>

//           {/* Submit Button */}
//           <div className="pt-4">
//             <PrimaryButton
//               type="submit"
//               className="w-full py-3"
//               disabled={isSubmitting || !selectedDoctor || !selectedPatient || !selectedDate || !watch("timeSlot")}
//             >
//               {isSubmitting ? (
//                 <div className="flex items-center justify-center space-x-2">
//                   <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
//                   <span>Booking Appointment...</span>
//                 </div>
//               ) : (
//                 <span>Book Appointment</span>
//               )}
//             </PrimaryButton>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default AddAppointment;




import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { apiClient } from '../../core/utils/apiClient';
import { Endpoints } from '../../core/utils/endpoints';
import PrimaryButton from '../../core/components/PrimaryButton';
import { useNavigate, Link } from 'react-router-dom';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { CiUser, CiCalendar, CiClock2, CiMedicalCase, CiSearch } from 'react-icons/ci';

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

  // State variables
  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);
  const [doctorSchedules, setDoctorSchedules] = useState([]);
  const [availableTimeSlots, setAvailableTimeSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState([]);
  const [doctorSearch, setDoctorSearch] = useState("");
  const [patientSearch, setPatientSearch] = useState("");
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showDoctorResults, setShowDoctorResults] = useState(false);
  const [showPatientResults, setShowPatientResults] = useState(false);

  // Generate calendar days
  const generateCalendarDays = (date, schedules) => {
    const startDay = new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    const scheduledDateStrings = schedules.map(s => s.date.split('T')[0]);

    const days = [];

    // Previous month padding
    for (let i = 0; i < startDay; i++) {
      days.push({
        date: new Date(date.getFullYear(), date.getMonth(), -i),
        isCurrentMonth: false,
        hasSlots: false
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(date.getFullYear(), date.getMonth(), i);
      const dayDateStr = dayDate.toISOString().split('T')[0];
      const hasSlot = scheduledDateStrings.includes(dayDateStr);

      days.push({
        date: dayDate,
        isCurrentMonth: true,
        hasSlots: hasSlot
      });
    }

    // Next month padding
    const daysToAdd = 42 - days.length;
    for (let i = 1; i <= daysToAdd; i++) {
      days.push({
        date: new Date(date.getFullYear(), date.getMonth() + 1, i),
        isCurrentMonth: false,
        hasSlots: false
      });
    }

    return days;
  };

  // Fetch doctors and patients data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const [doctorsRes, patientsRes] = await Promise.all([
          apiClient.get(Endpoints.doctors, {
            headers: { Authorization: `Bearer ${token}` }
          }),
          apiClient.get(Endpoints.patients, {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setDoctors(doctorsRes.data.data || []);
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

  // Fetch doctor schedules when selected doctor changes
  useEffect(() => {
    const fetchDoctorSchedule = async () => {
      if (!selectedDoctor) return;

      try {
        const token = localStorage.getItem('token');
        const response = await apiClient.get(
          `${Endpoints.doctorSchedule}?doctorId=${selectedDoctor._id}`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const schedules = response.data.data || [];
        console.log("🟡 Schedules from API:", schedules);
        console.log(schedules);
        setDoctorSchedules(schedules);
        setCalendarDays(generateCalendarDays(currentMonth, schedules));

      } catch (error) {
        console.error("Error fetching doctor schedule:", error);
        toast.error("Failed to load doctor schedule");
      }
    };

    fetchDoctorSchedule();
  }, [selectedDoctor, currentMonth]);

  // Filter doctors based on search
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

  // Filter patients based on search
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

  // Generate time slots
  const generateTimeSlots = (from, to, dateStr, intervalMinutes = 30) => {
    const slots = [];
    
    const [fromHours, fromMinutes] = from.split(':').map(Number);
    const [toHours, toMinutes] = to.split(':').map(Number);

    let currentMinutes = fromHours * 60 + fromMinutes;
    const endMinutes = toHours * 60 + toMinutes;

    while (currentMinutes < endMinutes) {
      const hours = Math.floor(currentMinutes / 60);
      const minutes = currentMinutes % 60;
      
      slots.push({
        date: dateStr,
        start: `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`,
        isBooked: false
      });

      currentMinutes += intervalMinutes;
    }

    return slots;
  };

  // Fetch available time slots when date changes
  const fetchAvailableSlots = async (date) => {
    if (!selectedDoctor || !date) {
      console.log("No doctor or date selected");
      return [];
    }

    setLoadingSlots(true);
    try {
      const dateStr = date.toISOString().split('T')[0];
      console.log("Fetching slots for date:", dateStr);

      // 1. Get doctor's schedule for this date
      const token = localStorage.getItem('token');
      const scheduleRes = await apiClient.get(
        `${Endpoints.doctorSchedule}?doctorId=${selectedDoctor._id}&date=${dateStr}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const daySchedule = scheduleRes.data.data[0];
      if (!daySchedule) {
        console.log("No schedule found for this date");
        return [];
      }

      // 2. Get booked appointments
      const appointmentsRes = await apiClient.get(
        `${Endpoints.appointments}?doctorId=${selectedDoctor._id}&date=${dateStr}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const bookedAppointments = appointmentsRes.data.data || [];
      const bookedSlots = bookedAppointments.map(app => 
        app.date.split('T')[1].substring(0, 5)
      );

      // 3. Generate all slots and mark booked ones
      const allSlots = generateTimeSlots(daySchedule.from, daySchedule.to, dateStr);
      
      return allSlots.map(slot => ({
        ...slot,
        isBooked: bookedSlots.includes(slot.start)
      }));

    } catch (error) {
      console.error("Error in fetchAvailableSlots:", error);
      toast.error("Failed to load available slots");
      return [];
    } finally {
      setLoadingSlots(false);
    }
  };

  // Update available slots when date changes
  useEffect(() => {
    const fetchSlots = async () => {
      if (selectedDate && selectedDoctor) {
        const slots = await fetchAvailableSlots(selectedDate);
        setAvailableTimeSlots(slots);
      }
    };
    
    fetchSlots();
  }, [selectedDate, selectedDoctor]);

  // Navigation functions
  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  // Handle doctor selection
  const handleDoctorSelect = (doctor) => {
    setSelectedDoctor(doctor);
    setValue("doctorId", doctor._id);
    setDoctorSearch(`${doctor.name} - ${doctor.specialization}`);
    setFilteredDoctors([]);
    setShowDoctorResults(false);
    setSelectedDate(null);
    setDoctorSchedules([]);
    setAvailableTimeSlots([]);
    setValue("date", "");
    setValue("timeSlot", "");
  };

  // Handle patient selection
  const handlePatientSelect = (patient) => {
    setSelectedPatient(patient);
    setValue("patientId", patient._id);
    setPatientSearch(patient.fullName);
    setFilteredPatients([]);
    setShowPatientResults(false);
  };

  // Handle date selection
  const handleDaySelect = async (day) => {
    if (!day.hasSlots) return;

    setSelectedDate(day.date);
    setValue("date", day.date.toISOString().split('T')[0]);
    setValue("timeSlot", "");

    // Fetch slots immediately when day is selected
    const slots = await fetchAvailableSlots(day.date);
    setAvailableTimeSlots(slots);
  };

  // Handle time slot selection
  const handleTimeSlotSelect = (time) => {
    setValue("timeSlot", time);
  };

  // Format time to 12-hour format
  const formatTime12Hour = (time) => {
    const [hours, minutes] = time.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  };

  // Submit appointment form
const onSubmit = async (data) => {
  try {
  
    // الخطوة الأهم: نرسل البيانات كما هي بدون تحويل
const appointmentData = {
    
  doctor: data.doctorId, // بدل doctorId
  patient: data.patientId, // بدل patientId
  date: `${data.date}T${data.timeSlot}:00`,
  treatment: data.treatment,
};

    const res = await apiClient.post(
      Endpoints.appointments,
      appointmentData,
      {
        headers: { 
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      }
    );

    


      toast.success("Appointment booked successfully!");
      reset();
      setDoctorSearch("");
      setPatientSearch("");
      setSelectedDoctor(null);
      setSelectedPatient(null);
      setSelectedDate(null);
      setDoctorSchedules([]);
      setAvailableTimeSlots([]);
      navigate("/appointments");
      
    } catch (error) {
      toast.error(
        error.response?.data?.message || 
        "Failed to book appointment. Please try again."
      );
    }
  };

return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white overflow-hidden rounded-[8px] shadow-sm max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 bg-[#f3f4f6] px-8 py-6 border-b border-gray-200">
          <Link to="/appointments" className="flex items-center">
            <IoIosArrowBack className="h-5 w-5 text-[#233955]" />
          </Link>
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-white rounded-xl shadow-sm">
              <CiCalendar className="h-8 w-8 text-[#233955]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#233955]">Book New Appointment</h1>
              <p className="text-gray-600 mt-1">Schedule an appointment for a patient</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-8">
          {/* Doctor Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#233955] flex items-center">
              <CiUser className="mr-2 text-[#233955]" />
              Doctor Information
            </h2>
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
                onBlur={() => setTimeout(() => setShowDoctorResults(false), 200)}
                placeholder="Search doctor by name or specialty"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors border-gray-200"
              />
              <input type="hidden" {...register("doctorId", { required: true })} />
              {errors.doctorId && <p className="mt-1 text-sm text-red-600">Doctor is required</p>}
            </div>
            
            {/* Doctor search results dropdown */}
            {showDoctorResults && filteredDoctors.length > 0 && (
              <div className="mt-1 border border-gray-200 rounded-lg shadow-lg bg-white max-h-60 overflow-y-auto">
                {filteredDoctors.map((doctor) => (
                  <div
                    key={doctor._id}
                    className="p-3 hover:bg-[#DFF8F9] cursor-pointer border-b border-gray-100"
                    onClick={() => handleDoctorSelect(doctor)}
                  >
                    <p className="font-medium text-[#233955]">{doctor.name}</p>
                    <p className="text-sm text-gray-600">{doctor.specialization}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Patient Selection */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#233955] flex items-center">
              <CiUser className="mr-2 text-[#233955]" />
              Patient Information
            </h2>
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
                onBlur={() => setTimeout(() => setShowPatientResults(false), 200)}
                placeholder="Search patient by name or phone"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors border-gray-200"
              />
              <input type="hidden" {...register("patientId", { required: true })} />
              {errors.patientId && <p className="mt-1 text-sm text-red-600">Patient is required</p>}
            </div>
            
            {/* Patient search results dropdown */}
            {showPatientResults && filteredPatients.length > 0 && (
              <div className="mt-1 border border-gray-200 rounded-lg shadow-lg bg-white max-h-60 overflow-y-auto">
                {filteredPatients.map((patient) => (
                  <div
                    key={patient._id}
                    className="p-3 hover:bg-[#DFF8F9] cursor-pointer border-b border-gray-100"
                    onClick={() => handlePatientSelect(patient)}
                  >
                    <p className="font-medium text-[#233955]">{patient.fullName}</p>
                    <p className="text-sm text-gray-600">{patient.phone}</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Appointment Schedule */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#233955] flex items-center">
              <CiCalendar className="mr-2 text-[#233955]" />
              Appointment Schedule
            </h2>

            {!selectedDoctor ? (
              <div className="bg-[#DFF8F9] p-4 rounded-xl text-[#233955] border border-[#A2F2EE]">
                Please select a doctor first to view available schedule
              </div>
            ) : (
              <div className="space-y-4">
                {/* Calendar Navigation */}
                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    onClick={prevMonth}
                    className="p-2 rounded-full hover:bg-[#DFF8F9]"
                  >
                    <IoIosArrowBack className="h-5 w-5 text-[#233955]" />
                  </button>
                  <h3 className="text-lg font-medium text-[#233955]">
                    {currentMonth.toLocaleDateString('en-US', {
                      month: 'long',
                      year: 'numeric'
                    })}
                  </h3>
                  <button
                    type="button"
                    onClick={nextMonth}
                    className="p-2 rounded-full hover:bg-[#DFF8F9]"
                  >
                    <IoIosArrowForward className="h-5 w-5 text-[#233955]" />
                  </button>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => {
                    const isSelected = selectedDate?.toDateString() === day.date.toDateString();
                    const isToday = new Date().toDateString() === day.date.toDateString();
                    const isAvailable = day.hasSlots;

                    return (
                      <button
                        key={index}
                        type="button"
                        onClick={() => isAvailable && handleDaySelect(day)}
                        disabled={!isAvailable}
                        className={`
                          h-12 rounded-lg transition-colors flex flex-col items-center justify-center
                          ${isSelected ? 'bg-[#233955] text-white' : ''}
                          ${isAvailable && !isSelected
                            ? 'bg-white text-[#233955] border border-[#A2F2EE] hover:bg-[#DFF8F9] cursor-pointer'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed opacity-50'}
                          ${isToday && !isSelected ? 'ring-2 ring-[#233955]' : ''}
                        `}
                      >
                        <span className="text-sm font-medium">
                          {day.date.getDate()}
                        </span>

                        {isAvailable && !isSelected && (
                          <span className="w-2 h-2 mt-1 rounded-full bg-[#A2F2EE]"></span>
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Time Slots Selection */}
                {selectedDate && (
                  <div className="bg-[#DFF8F9] p-6 rounded-xl border border-[#A2F2EE] mt-4">
                    <h3 className="font-medium text-[#233955] mb-3">
                      Available time slots for {selectedDate.toLocaleDateString('en-US', {
                        weekday: 'long',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </h3>
                    
                    {loadingSlots ? (
                      <div className="flex justify-center py-4">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#233955]"></div>
                      </div>
                    ) : availableTimeSlots.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {availableTimeSlots.map((slot, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => !slot.isBooked && handleTimeSlotSelect(slot.start)}
                            disabled={slot.isBooked}
                            className={`
                              p-2 rounded border text-sm transition-colors
                              ${watch("timeSlot") === slot.start ? 
                                'bg-[#233955] text-white border-[#233955]' : ''}
                              ${!slot.isBooked && watch("timeSlot") !== slot.start 
                                ? 'bg-white hover:bg-[#DFF8F9] border-[#A2F2EE]' 
                                : ''}
                              ${slot.isBooked 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border-gray-200' 
                                : ''}
                            `}
                          >
                            <div className="flex items-center justify-center">
                              <CiClock2 className="mr-1" />
                              {formatTime12Hour(slot.start)}
                              {slot.isBooked && <span className="text-xs ml-1">(Booked)</span>}
                            </div>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-600">No available time slots</p>
                    )}
                    <input type="hidden" {...register("date", { required: true })} />
                    <input type="hidden" {...register("timeSlot", { required: true })} />
                    {errors.date && <p className="mt-1 text-sm text-red-600">Date is required</p>}
                    {errors.timeSlot && <p className="mt-1 text-sm text-red-600">Time slot is required</p>}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Treatment Details */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-[#233955] flex items-center">
              <CiMedicalCase className="mr-2 text-[#233955]" />
              Treatment Details
            </h2>
            <div className="relative">
              <CiMedicalCase className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                {...register("treatment", { required: true })}
                placeholder="Reason for visit or treatment description"
                className="w-full pl-10 pr-4 py-3 rounded-xl border-2 focus:outline-none focus:ring-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors border-gray-200"
              />
              {errors.treatment && <p className="mt-1 text-sm text-red-600">Treatment description is required</p>}
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <PrimaryButton
              type="submit"
              className="w-full py-3 bg-[#233955] hover:bg-[#1e3a5f] text-white"
              disabled={isSubmitting || !selectedDoctor || !selectedPatient || !selectedDate || !watch("timeSlot")}
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Booking Appointment...</span>
                </div>
              ) : (
                <span>Book Appointment</span>
              )}
            </PrimaryButton>
          </div>
        </form>
      </div>
    </div>
  );
};
export default AddAppointment ;