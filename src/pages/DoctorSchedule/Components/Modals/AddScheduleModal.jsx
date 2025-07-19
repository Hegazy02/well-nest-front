import { useState, useEffect } from "react";
import PrimaryDropDown from "../../../../core/components/PrimaryDropDown";
import { Controller } from "react-hook-form";

const AddScheduleModal = ({
  showForm,
  onClose,
  onSubmit,
  doctors,
  register,
  handleSubmit,
  watch,
  control,
  setValue,
  errors = {},
}) => {
  const [filteredDoctors, setFilteredDoctors] = useState(doctors);
  const [filteredDays, setFilteredDays] = useState([
    "Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"
  ]);

  const [selectedDoctorName, setSelectedDoctorName] = useState("Select Doctor");
  const [selectedDayText, setSelectedDayText] = useState("Select Day");

    useEffect(() => {
    setFilteredDoctors(doctors);
  }, [doctors]);

  useEffect(() => {
    const initialDoctorId = watch("doctorId");
    if (initialDoctorId) {
      const doc = doctors.find((d) => d._id === initialDoctorId);
      if (doc) setSelectedDoctorName(doc.name);
    }
    const initialDay = watch("day");
    if (initialDay) {
      setSelectedDayText(initialDay);
    }
  }, [watch, doctors]);

  if (!showForm) return null;

  const handleDoctorSearch = (e) => {
    const search = e.target.value.toLowerCase();
    const filtered = doctors.filter((doc) => doc.name.toLowerCase().includes(search));
    setFilteredDoctors(filtered);
  };


  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-500 cursor-pointer"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Add New Schedule</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4">

          {/* Doctor Dropdown */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-[#233955] mb-2">
              Doctor <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="doctorId"
              rules={{ required: "Doctor is required" }}
              render={({ field }) => (
                <PrimaryDropDown
                  text={
                    doctors.find((d) => d._id === field.value)?.name ||
                    selectedDoctorName ||
                    "Select Doctor"
                  }
                  onSearch={handleDoctorSearch}
                  onSelect={(index) => {
                    const doctor = filteredDoctors[index];
                    field.onChange(doctor._id);
                    setSelectedDoctorName(doctor.name);
                  }}
                  className={`w-full ${errors.doctorId ? "border border-red-500 rounded-md" : ""}`}
                >
                  {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor) => (
                      <div key={doctor._id} data-value={doctor._id}>
                        {doctor.name}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No doctors found</div>
                  )}
                </PrimaryDropDown>
              )}
            />
            {errors.doctorId && <p className="text-red-500 text-xs mt-1">{errors.doctorId.message}</p>}
          </div>

          {/* Day Dropdown */}
          <div className="col-span-2">
            <label className="block text-sm font-medium text-[#233955] mb-2">
              Day <span className="text-red-500">*</span>
            </label>
            <Controller
              control={control}
              name="day"
              rules={{ required: "Day is required" }}
              render={({ field }) => (
                <PrimaryDropDown
                  text={field.value || selectedDayText || "Select Day"}
                  onSelect={(index) => {
                    const selected = filteredDays[index];
                    field.onChange(selected);
                    setSelectedDayText(selected);
                  }}
                  className={`w-full ${errors.day ? "border border-red-500 rounded-md" : ""}`}
                >
                  {filteredDays.length > 0 ? (
                    filteredDays.map((day) => (
                      <div key={day} data-value={day}>
                        {day}
                      </div>
                    ))
                  ) : (
                    <div className="p-2 text-gray-500">No days found</div>
                  )}
                </PrimaryDropDown>
              )}
            />
            {errors.day && <p className="text-red-500 text-xs mt-1">{errors.day.message}</p>}
          </div>

          {/* Time inputs */}
          <div className="col-span-4 grid grid-cols-2 gap-4">
            <input
              type="time"
              {...register("from", { required: "Start time is required" })}
              className="border p-2 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="time"
              {...register("to", { required: "End time is required" })}
              className="border p-2 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Repeat checkbox */}
          <label className="flex items-center col-span-4 space-x-2 mt-2">
            <input type="checkbox" {...register("repeat")} className="form-checkbox h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-700">
              Repeat this schedule for all {watch("day") || "selected day"}s this month
            </span>
          </label>

          {/* Submit button */}
          <button type="submit" className="bg-[#233955] text-white px-4 py-2 rounded col-span-4 cursor-pointer">
            Save
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddScheduleModal;
