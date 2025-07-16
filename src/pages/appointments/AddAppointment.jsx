// src/pages/appointments/AddAppointment.jsx

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { apiClient } from "../../core/utils/apiClient";
import { Endpoints } from "../../core/utils/endpoints";
import PrimaryButton from "../../core/components/PrimaryButton";
import { useNavigate } from "react-router-dom";

const AddAppointment = () => {
  const navigate = useNavigate();

  const [doctors, setDoctors] = useState([]);
  const [patients, setPatients] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    defaultValues: {
      doctorId: "",
      patientId: "",
      date: "",
      treatment: "",
      status: "upcoming",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [doctorsRes, patientsRes] = await Promise.all([
          apiClient.get("/doctors/all"),
          apiClient.get("/patients/all"),
        ]);
        setDoctors(doctorsRes.data.data);
        setPatients(patientsRes.data.data);
      } catch (err) {
        toast("Error loading data", { type: "error" });
      }
    };
    fetchData();
  }, []);

  const onSubmit = async (data) => {
    try {
      await apiClient.post(Endpoints.appointments, data);
      toast("Appointment added successfully", { type: "success" });
      reset();
      navigate("/appointments");
    } catch (error) {
      toast(
        `Error adding appointment: ${
          error.response?.data?.message ?? error.message
        }`,
        { type: "error" }
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 rounded-xl">
      <div className="bg-white rounded-xl shadow p-8 w-full max-w-3xl mx-auto">
        <h1 className="text-2xl font-bold text-[#233955] mb-6">
          Add New Appointment
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Doctor */}
          <div>
            <label className="block text-sm font-medium text-[#233955] mb-2">
              Doctor *
            </label>
            <select
              {...register("doctorId", { required: "Doctor is required" })}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                errors.doctorId ? "border-red-300" : "border-gray-200"
              }`}
            >
              <option value="">Select a doctor</option>
              {doctors.map((doc) => (
                <option key={doc._id} value={doc._id}>
                  {doc.name}
                </option>
              ))}
            </select>
            {errors.doctorId && (
              <p className="text-sm text-red-600 mt-1">
                {errors.doctorId.message}
              </p>
            )}
          </div>

          {/* Patient */}
          <div>
            <label className="block text-sm font-medium text-[#233955] mb-2">
              Patient *
            </label>
            <select
              {...register("patientId", { required: "Patient is required" })}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                errors.patientId ? "border-red-300" : "border-gray-200"
              }`}
            >
              <option value="">Select a patient</option>
              {patients.map((pat) => (
                <option key={pat._id} value={pat._id}>
                  {pat.name}
                </option>
              ))}
            </select>
            {errors.patientId && (
              <p className="text-sm text-red-600 mt-1">
                {errors.patientId.message}
              </p>
            )}
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-[#233955] mb-2">
              Appointment Date *
            </label>
            <input
              type="datetime-local"
              {...register("date", { required: "Date is required" })}
              className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                errors.date ? "border-red-300" : "border-gray-200"
              }`}
            />
            {errors.date && (
              <p className="text-sm text-red-600 mt-1">
                {errors.date.message}
              </p>
            )}
          </div>

          {/* Treatment */}
          <div>
            <label className="block text-sm font-medium text-[#233955] mb-2">
              Treatment *
            </label>
            <input
              type="text"
              {...register("treatment", { required: "Treatment is required" })}
              placeholder="Ex: Skin Allergy Test"
              className={`w-full px-4 py-3 rounded-xl border-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] transition-colors ${
                errors.treatment ? "border-red-300" : "border-gray-200"
              }`}
            />
            {errors.treatment && (
              <p className="text-sm text-red-600 mt-1">
                {errors.treatment.message}
              </p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-[#233955] mb-2">
              Status *
            </label>
            <select
              {...register("status", { required: true })}
              className="w-full px-4 py-3 rounded-xl border-2 focus:ring-[#a2f2ee] focus:border-[#a2f2ee] border-gray-200"
            >
              <option value="upcoming">Upcoming</option>
              <option value="done">Done</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Submit */}
          <PrimaryButton type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : "Add Appointment"}
          </PrimaryButton>
        </form>
      </div>
    </div>
  );
};

export default AddAppointment;