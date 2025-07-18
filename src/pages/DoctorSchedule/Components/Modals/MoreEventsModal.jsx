
import { format } from "date-fns"
import { X } from "lucide-react"
import { getDoctorColor } from "../../../../core/utils/ScheduleUtils"

const MoreEventsModal = ({ events, onClose, onSelectEvent }) => {
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg relative max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">All Schedules for this Day</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors duration-200 rounded-full p-1 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0">
          {events.length === 0 ? (
            <p className="text-gray-500 text-center">No schedules found for this day.</p>
          ) : (
            <ul className="space-y-3">
              {events.map((event) => (
                <li
                  key={event.id}
                  className="p-4 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md"
                  style={{ backgroundColor: getDoctorColor(event.doctorName) }}
                  onClick={() => {
                    onClose() 
                    onSelectEvent(event)
                  }}
                >
                  <div className="text-black">
                    <div className="font-semibold text-lg mb-1">{event.doctorName}</div>
                    <div className="text-sm opacity-90">
                      {format(event.start, "hh:mm a")} - {format(event.end, "hh:mm a")}
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}

export default MoreEventsModal
