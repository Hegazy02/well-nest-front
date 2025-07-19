
import { Calendar, ChevronLeft, ChevronRight, Clock, MoreHorizontal, Users } from "lucide-react"

const ScheduleAndAppointments = ({
  currentWeek,
  setCurrentWeek,
  selectedDate,
  setSelectedDate,
  selectedDaySchedule,
  getCurrentWeekDates,
  selectedDayAppointments,
}) => {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-3">
      {/* Schedule Section */}
      <div className="bg-white rounded-lg overflow-hidden p-6">
        <div className="flex flex-row items-center justify-between mb-4">
          <p className="text-lg font-semibold text-[#1e3a5f]">Schedule</p>
          <MoreHorizontal className="h-5 w-5 text-[#64748b]" />
        </div>
        {/* Week Navigation */}
        <div className="flex items-center justify-between mb-4 text-[#1e3a5f]">
          <button
            className="p-1 text-[#64748b] hover:text-[#1e3a5f]"
            onClick={() => {
              const newWeek = new Date(currentWeek)
              newWeek.setDate(newWeek.getDate() - 7)
              setCurrentWeek(newWeek)
            }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <div className="flex gap-1 text-sm">
            {getCurrentWeekDates().map((date, index) => {
              const isSelected = date.toDateString() === selectedDate.toDateString()
              return (
                <button
                  key={index}
                  onClick={() => setSelectedDate(date)}
                  className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                    isSelected ? "bg-[#1e3a5f] text-white" : "hover:bg-[#f0f7ff] text-[#64748b]"
                  }`}
                >
                  {date.getDate()}
                </button>
              )
            })}
          </div>
          <button
            className="p-1 text-[#64748b] hover:text-[#1e3a5f]"
            onClick={() => {
              const newWeek = new Date(currentWeek)
              newWeek.setDate(newWeek.getDate() + 7)
              setCurrentWeek(newWeek)
            }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
        {/* Selected Date Label */}
        <p className="text-sm text-[#64748b] mb-4">
          {selectedDaySchedule.length} schedule
          {selectedDaySchedule.length !== 1 ? "s" : ""} on{" "}
          {selectedDate.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          })}
        </p>
        {/* Schedule Items */}
        <div className="space-y-4">
          {selectedDaySchedule.length > 0 ? (
            selectedDaySchedule.map((item, index) => (
              <div key={item.id || index} className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-[#64748b] mt-1" />
                <div>
                  <p className="font-medium text-[#1e3a5f]">{item.day} Schedule</p>
                  <p className="text-sm text-[#64748b]">
                    {item.from} - {item.to}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-[#64748b]">
              <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No schedule for this day</p>
            </div>
          )}
        </div>
      </div>

      {/* Appointments List for Selected Day */}
      <div className="bg-white rounded-lg overflow-hidden p-6">
        <h3 className="text-lg font-semibold text-[#1e3a5f] mb-4">Appointments ({selectedDayAppointments.length})</h3>
        {selectedDayAppointments.length > 0 ? (
          <ul className="space-y-4">
            {selectedDayAppointments.map((apt, index) => (
              <li key={apt._id || index} className="flex items-start gap-3 p-3 bg-[#f8fafc] rounded-md">
                <div className="p-2 bg-[#e6f3ff] rounded-full">
                  <Users className="h-4 w-4 text-[#1e3a5f]" />
                </div>
                <div>
                  <p className="font-medium text-[#1e3a5f]">{apt.patientId?.fullName || "Unknown Patient"}</p>
                  <p className="text-sm text-[#64748b]">
                    {new Date(apt.date).toLocaleTimeString("en-US", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center py-8 text-[#64748b]">
            <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>No appointments for this day</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ScheduleAndAppointments
