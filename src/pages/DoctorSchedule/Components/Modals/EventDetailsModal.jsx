
import { format } from "date-fns"
import PrimaryModal from "../../../../core/components/PrimaryModal"

const EventDetailsModal = ({ selectedEvent, isEditing, onClose, onEdit, onDeleteThis, onDeleteAll }) => {
  if (!selectedEvent || isEditing) return null

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md relative border border-gray-200 text-center">
        {/* Close Button */}
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-xl">
          ✕
        </button>
        {/* Title */}
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Schedule Details</h2>
        {/* Content */}
        <div className="space-y-3 text-lg text-gray-700">
          <p>
            <span className="font-semibold text-gray-900">Doctor:</span> {selectedEvent.doctorName}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Day:</span> {format(selectedEvent.start, "EEEE")}
          </p>
          <p>
            <span className="font-semibold text-gray-900">Time:</span> {format(selectedEvent.start, "hh:mm a")} -{" "}
            {format(selectedEvent.end, "hh:mm a")}
          </p>
        </div>
        {/* Actions */}
        <div className="mt-8 flex justify-center flex-wrap gap-4">
          {/* Edit Button */}
          <button
            onClick={onEdit}
            className="px-4 py-2 text-sm min-w-[180px] bg-[#233955] hover:bg-[#1b2e44] text-white rounded-lg"
          >
            Edit Schedule
          </button>
          {/* Delete Buttons */}
          <PrimaryModal
            title="Delete this schedule?"
            content="Are you sure you want to delete this specific schedule? This action cannot be undone."
            confirmText="Yes, delete it"
            cancelText="Cancel"
            showIcon={true}
            onConfirm={onDeleteThis}
            onCancel={onClose}
          >
            <button className="px-4 py-2 text-sm min-w-[180px] bg-red-600 hover:bg-red-700 text-white rounded-lg">
              Delete This Schedule Only
            </button>
          </PrimaryModal>
          <PrimaryModal
            title="Delete all schedules for this doctor?"
            content={`This will permanently remove all schedules for Dr. ${selectedEvent.doctorName}.`}
            confirmText="Yes, delete all"
            cancelText="Cancel"
            showIcon={true}
            onConfirm={onDeleteAll}
            onCancel={onClose}
          >
            <button className="px-4 py-2 text-sm min-w-[180px] bg-red-800 hover:bg-red-900 text-white rounded-lg">
              Delete All Schedules
            </button>
          </PrimaryModal>
        </div>
      </div>
    </div>
  )
}

export default EventDetailsModal
