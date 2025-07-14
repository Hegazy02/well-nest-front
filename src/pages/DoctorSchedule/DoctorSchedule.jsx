import { useState, useEffect } from "react"
import { Calendar, dateFnsLocalizer } from "react-big-calendar"
import { format, parse, startOfWeek, getDay } from "date-fns"
import { enUS } from "date-fns/locale"
import axios from "axios"
import { toast, ToastContainer } from "react-toastify"
import "react-big-calendar/lib/css/react-big-calendar.css"
import "react-toastify/dist/ReactToastify.css"

import { convertScheduleToEvents, getDoctorColor } from "../../core/utils/ScheduleUtils"
import DoctorFilter from "../../core/components/DoctorFilter"
import LoadingSpinner from "../../core/components/LoadingSpinner"
import Sidebar from "../../core/components/layout/Sidebar"
import { CalendarIcon, Plus } from "lucide-react"
import { Button } from "../../core/components/Button"
import PrimaryButton from "../../core/components/PrimaryButton"
import { useForm } from "react-hook-form"
import PrimaryModal from "../../core/components/primaryModal"


const locales = { "en-US": enUS }

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
})

export default function DoctorSchedulePage() {
  const [schedules, setSchedules] = useState([])
  const [filteredSchedules, setFilteredSchedules] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState("all")
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState("month")
  const [date, setDate] = useState(new Date())
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [isInitialLoad, setIsInitialLoad] = useState(true)
const { register, handleSubmit, reset, setValue, watch } = useForm()
  // const [showDeleteModal, setShowDeleteModal] = useState(false)
  // const [scheduleToDelete, setScheduleToDelete] = useState(null)




  useEffect(() => {
    fetchSchedules()
  }, [])

  useEffect(() => {
    if (selectedDoctor === "all") {
      setFilteredSchedules(schedules)
    } else {
      setFilteredSchedules(schedules.filter(s => s.doctorName === selectedDoctor))
    }
  }, [selectedDoctor, schedules])

  useEffect(() => {
    axios.get("http://localhost:3000/doctors").then(res => {
      if (res.data.success) {
        setDoctors(res.data.data)
      }
    })
  }, [])

  const fetchSchedules = async () => {
    try {
      setLoading(true)
      const response = await axios.get("http://localhost:3000/calendar")
      if (response.data.success) {
        setSchedules(response.data.data)
        if (isInitialLoad) {
          toast.success("Schedules loaded successfully!", {
            toastId: "scheduleLoaded"
          })
          setIsInitialLoad(false)
        }
      } else {
        toast.error("Failed to load schedules")
      }
    } catch (error) {
      console.error("Error fetching schedules:", error)
      toast.error("Error connecting to server.")
    } finally {
      setLoading(false)
    }
  }

  const events = convertScheduleToEvents(filteredSchedules)

  const eventStyleGetter = (event) => {
    const backgroundColor = getDoctorColor(event.doctorName)
    return {
      style: {
        backgroundColor,
        borderRadius: "6px",
        opacity: 0.95,
        color: "#fff",
        fontWeight: "600",
        padding: "4px 6px",
        minHeight: "24px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        textShadow: "0 1px 2px rgba(0,0,0,0.6)"
      },
    }
  }

  const CustomEvent = ({ event }) => (
    <div className="h-full flex flex-col justify-center overflow-hidden">
      <div className="font-semibold text-white truncate">{event.doctorName}</div>
      <div className="text-white text-xs opacity-95">
        {format(event.start, "hh:mm a")} - {format(event.end, "hh:mm a")}
      </div>
    </div>
  )

  const uniqueDoctors = Array.from(new Set(schedules.map((s) => s.doctorName)))

const onSubmit = async (data) => {
  try {
    const repeat = data.repeat
    const selectedDay = data.day
    const from = data.from
    const to = data.to
    const doctorId = data.doctorId

    const getAllWeekdaysInMonth = (dayName) => {
      const dayMap = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6
      }

      const today = new Date()
      const year = today.getFullYear()
      const month = today.getMonth()
      const targetDay = dayMap[dayName]

      const dates = []

      for (let i = 1; i <= 31; i++) {
        const date = new Date(year, month, i)
        if (date.getMonth() !== month) break
        if (date.getDay() === targetDay) {
          dates.push(date)
        }
      }

      return dates
    }

    if (repeat) {
      const days = getAllWeekdaysInMonth(selectedDay)
      await Promise.all(days.map(async () => {
        await axios.post("http://localhost:3000/calendar", {
          doctorId,
          day: selectedDay,
          from,
          to,
        })
      }))
      toast.success("Schedules added for all " + selectedDay + "s this month")
    } else {
      await axios.post("http://localhost:3000/calendar", {
        doctorId,
        day: selectedDay,
        from,
        to,
      })
      toast.success("Schedule added successfully")
    }

    reset()
    setShowForm(false)
    fetchSchedules()
  } catch (err) {
    toast.error("Failed to add schedule")
  }
}



  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* { <Sidebar />} */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <CalendarIcon className="h-6 w-6 text-teal-600" />
              <h1 className="text-2xl font-bold text-gray-900">Doctor Schedule</h1>
            </div>
            <PrimaryButton className="bg-teal-600 hover:bg-teal-800 text-white" onClick={() => setShowForm(true)}>
              {/* <Plus className="h-4 w-4 mr-2" /> */}
              Add Schedule
            </PrimaryButton>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <DoctorFilter doctors={uniqueDoctors} selectedDoctor={selectedDoctor} onDoctorChange={setSelectedDoctor} />
            <div className="flex items-center space-x-2">

              <Button variant={view === "month" ? "outline" : "default"} size="sm" onClick={() => setView("month")}>Month</Button>
              <Button variant={view === "week" ? "outline" : "default"} size="sm" onClick={() => setView("week")}>Week</Button>
              <Button variant={view === "day" ? "outline" : "default"} size="sm" onClick={() => setView("day")}>Day</Button>

            </div>
          </div>
        </div>

        {/* Calendar */}
        <div className="flex-1 overflow-auto p-4">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 min-h-[900px]">
              <Calendar
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                style={{ height: "100%", minHeight: 900 }}
                view={view}
                onView={setView}
                date={date}
                onNavigate={setDate}
                eventPropGetter={eventStyleGetter}
                components={{
                  event: CustomEvent,
                  timeGutterHeader: () => null,
                }} onSelectEvent={(event) => setSelectedEvent(event)}
                popup
                formats={{
                  timeGutterFormat: (date, culture, localizer) =>
                    localizer.format(date, 'h:mm a', culture),
                  eventTimeRangeFormat: () => '',
                }}

              />
            </div>
          )}
        </div>
      </div>

      {/* Add Schedule Modal */}
      {showForm && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
            <button onClick={() => setShowForm(false)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500">✕</button>
            <h2 className="text-xl font-semibold mb-4">Add New Schedule</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <select {...register("doctorId", { required: true })} className="border p-2 rounded col-span-2">
                <option value="">Select Doctor</option>
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>{doctor.name}</option>
                ))}
              </select>
              <select {...register("day", { required: true })} className="border p-2 rounded">
                {["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>
              <input type="time" {...register("from", { required: true })} className="border p-2 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <input type="time" {...register("to", { required: true })} className="border p-2 rounded appearance-none focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
              <label className="flex items-center col-span-4 space-x-2 mt-2">
                <input type="checkbox" {...register("repeat")} className="form-checkbox h-4 w-4 text-teal-600" />
                <span className="text-sm text-gray-700">Repeat this schedule for all {watch("day") || "selected day"}s this month</span>
              </label>
              <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded col-span-4">Save</button>
            </form>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && !isEditing && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md relative">
            <button onClick={() => setSelectedEvent(null)} className="absolute top-2 right-2 text-gray-500 hover:text-red-500">✕</button>
            <h2 className="text-xl font-semibold mb-4">Schedule Details</h2>
            <div className="space-y-2">
              <p><strong>Doctor:</strong> {selectedEvent.doctorName}</p>
              <p><strong>Day:</strong> {format(selectedEvent.start, 'EEEE')}</p>
              <p><strong>Time:</strong> {format(selectedEvent.start, 'hh:mm a')} - {format(selectedEvent.end, 'hh:mm a')}</p>
            </div>
            <div className="mt-6 flex justify-between">
              <button onClick={() => setIsEditing(true)} className="bg-teal-600 text-white px-4 py-2 rounded hover:bg-teal-700">Edit</button>
              <PrimaryModal
                title="Are you sure you want to delete this schedule?"
                content="This action cannot be undone."
                confirmText="Yes, delete it"
                cancelText="Cancel"
                showIcon={true}
                onConfirm={async () => {
                  try {
                    await axios.delete(`http://localhost:3000/calendar/${selectedEvent.id}`)
                    toast.success("Schedule deleted successfully")
                    setSelectedEvent(null)
                    fetchSchedules()
                  } catch (err) {
                    toast.error("Failed to delete schedule")
                  }
                }}
                onCancel={() => setSelectedEvent(null)}
              >
                <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                  Delete
                </button>
              </PrimaryModal>

            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditing && selectedEvent && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-xl relative">
            <button
              onClick={() => {
                setIsEditing(false)
                setSelectedEvent(null)
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
            >
              ✕
            </button>
            <h2 className="text-xl font-semibold mb-4">Edit Schedule</h2>
            <form
              onSubmit={handleSubmit(async (data) => {
                try {
                  await axios.patch(`http://localhost:3000/calendar/${selectedEvent.id}`, {
                    doctorId: data.doctorId,
                    day: data.day,
                    from: data.from,
                    to: data.to,
                  })
                  toast.success("Schedule updated successfully")
                  setIsEditing(false)
                  setSelectedEvent(null)
                  fetchSchedules()
                } catch (err) {
                  toast.error("Failed to update schedule")
                }
              })}
              className="grid grid-cols-1 md:grid-cols-4 gap-4"
            >
              <select
                {...register("doctorId", { required: true })}
                className="border p-2 rounded col-span-2"
                defaultValue={doctors.find(doc => doc.name === selectedEvent.doctorName)?.id || ""}
              >
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>{doctor.name}</option>
                ))}
              </select>

              <select
                {...register("day", { required: true })}
                className="border p-2 rounded"
                defaultValue={format(selectedEvent.start, 'EEEE')}
              >
                {["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map(day => (
                  <option key={day} value={day}>{day}</option>
                ))}
              </select>

              <input
                type="time"
                {...register("from", { required: true })}
                defaultValue={format(selectedEvent.start, 'HH:mm a')}
                className="border p-2 rounded"
              />

              <input
                type="time"
                {...register("to", { required: true })}
                defaultValue={format(selectedEvent.end, 'HH:mm a')}
                className="border p-2 rounded"
              />

              <button type="submit" className="bg-teal-600 text-white px-4 py-2 rounded col-span-4">Save Changes</button>
            </form>
          </div>
        </div>
      )}



    </div>

  )
}

