
const AddScheduleModal = ({ showForm, onClose, onSubmit, doctors, register, handleSubmit, watch }) => {
  if (!showForm) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-500 cursor-pointer">
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Add New Schedule</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <select {...register("doctorId", { required: true })} className="border p-2 rounded col-span-2">
            <option value="">Select Doctor</option>
            {doctors.map((doctor) => (
              <option key={doctor._id} value={doctor._id}>
                {doctor.name}
              </option>
            ))}
          </select>
          <select {...register("day", { required: true })} className="border p-2 rounded">
            {["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </select>
          <div className="col-span-4 grid grid-cols-2 gap-4">
            <input
              type="time"
              {...register("from", { required: true })}
              className="border p-2 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="time"
              {...register("to", { required: true })}
              className="border p-2 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <label className="flex items-center col-span-4 space-x-2 mt-2">
            <input type="checkbox" {...register("repeat")} className="form-checkbox h-4 w-4 text-blue-600" />
            <span className="text-sm text-gray-700">
              Repeat this schedule for all {watch("day") || "selected day"}s this month
            </span>
          </label>
          <button type="submit" className="bg-[#233955] text-white px-4 py-2 rounded col-span-4 cursor-pointer">
            Save
          </button>
        </form>
      </div>
    </div>
  )
}

export default AddScheduleModal
