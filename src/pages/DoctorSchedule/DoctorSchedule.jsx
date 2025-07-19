
import { useState, useEffect, useRef, useMemo } from "react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import { convertScheduleToEvents } from "../../core/utils/ScheduleUtils"
import { apiClient } from "../../core/utils/apiClient"
import { Endpoints } from "../../core/utils/endpoints"
import { useForm } from "react-hook-form"
import { format } from "date-fns"


import HeaderAndFilters from "./Components/HeaderAndFilters"
import CalendarSection from "./Components/CalendarSection"
import MoreEventsModal from "./Components/Modals/MoreEventsModal"
import AddScheduleModal from "./Components/Modals/AddScheduleModal"
import EventDetailsModal from "./Components/Modals/EventDetailsModal"

export default function DoctorSchedulePage() {
  const [schedules, setSchedules] = useState([])
  const [filteredSchedules, setFilteredSchedules] = useState([])
  const [selectedDoctor, setSelectedDoctor] = useState("all")
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState("dayGridMonth")
  const [date, setDate] = useState(new Date())
  const [showForm, setShowForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [isInitialLoad, setIsInitialLoad] = useState(true)
  const [showMoreEventsModal, setShowMoreEventsModal] = useState(false)
  const [moreEventsData, setMoreEventsData] = useState([])
  const calendarRef = useRef(null)
  const [searchTerm, setSearchTerm] = useState("")
  const { register, handleSubmit, reset, setValue, watch, control } = useForm()


  useEffect(() => {
    fetchSchedules()
  }, [])

  useEffect(() => {
    if (selectedDoctor === "all") {
      setFilteredSchedules(schedules)
    } else {
      setFilteredSchedules(schedules.filter((s) => s.doctorName === selectedDoctor))
    }
  }, [selectedDoctor, schedules])

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const res = await apiClient.get(Endpoints.doctors)
        if (res.data.success) {
          setDoctors(res.data.data)
        }
      } catch (err) {
        console.error("Failed to fetch doctors:", err)
      }
    }
    fetchDoctors()
  }, [])

const fetchSchedules = async () => {
  try {
    setLoading(true)
    const response = await apiClient.get(Endpoints.calendar)

    if (response.data.success && Array.isArray(response.data.data)) {
      const schedules = response.data.data
      setSchedules(schedules)

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

  const handleAddScheduleClick = () => {
    setShowForm(true)
    setIsEditing(false)
    reset()
  }

  const handleAddScheduleSubmit = async (data) => {
    try {
      const repeat = data.repeat
      const selectedDay = data.day
      const from = data.from
      const to = data.to
      const doctorId = data.doctorId


      const response = await apiClient.post(Endpoints.calendar, {
        doctorId,
        day: selectedDay,
        from,
        to,
        date: repeat ? undefined : new Date().toISOString(),
        repeat: repeat,
      })

      toast.success(`Schedules added/updated successfully!`)

      reset()
      setShowForm(false)
      setIsEditing(false)
      setSelectedEvent(null)
      fetchSchedules()
    } catch (err) {
      console.error("Error details:", err.response?.data || err.message)
      toast.error(err.response?.data?.message || "Failed to add schedule")
    }
  }

  const handleEventDetailsEdit = () => {
    if (selectedEvent) {
      setShowForm(false)
      setTimeout(() => {
        setIsEditing(true)
      }, 0)
    }
  }


  useEffect(() => {
    if (selectedEvent && isEditing) {
      const doctor = doctors.find((doc) => doc.name === selectedEvent.doctorName)
      if (doctor) {
        setValue("doctorId", doctor._id)
        setValue("day", format(selectedEvent.start, "EEEE"))
        setValue("from", format(selectedEvent.start, "HH:mm"))
        setValue("to", format(selectedEvent.end, "HH:mm"))
      }
    }
  }, [selectedEvent, isEditing, doctors])

  const handleEventDetailsDeleteThis = async () => {
    try {
      await apiClient.delete(`${Endpoints.calendar}/${selectedEvent.id}`)
      toast.success("Schedule deleted successfully")
      setSelectedEvent(null)
      fetchSchedules()
    } catch (err) {
      toast.error("Failed to delete schedule")
    }
  }

  const handleEventDetailsDeleteAll = async () => {
    try {
      if (!selectedEvent.doctorId) throw new Error("Doctor ID not found for deletion")
      await apiClient.delete(`${Endpoints.calendar}/doctor/${selectedEvent.doctorId}`)
      toast.success("All schedules for this doctor deleted")
      setSelectedEvent(null)
      fetchSchedules()
    } catch (err) {
      console.error("Error:", err)
      toast.error("Failed to delete all schedules")
    }
  }



  const uniqueDoctors = Array.from(new Set(schedules.map((s) => s.doctorName)))
  const filteredDoctorList = useMemo(() => {
    if (!searchTerm) return ["all", ...uniqueDoctors]
    return ["all", ...uniqueDoctors.filter((doc) => doc.toLowerCase().includes(searchTerm.toLowerCase()))]
  }, [searchTerm, uniqueDoctors])

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      <div className="flex-1 flex flex-col overflow-hidden">
        <HeaderAndFilters
          onAddScheduleClick={handleAddScheduleClick}
          uniqueDoctors={uniqueDoctors}
          selectedDoctor={selectedDoctor}
          onDoctorChange={setSelectedDoctor}
          view={view}
          setView={setView}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filteredDoctorList={filteredDoctorList}
        />

        <CalendarSection
          events={events}
          loading={loading}
          calendarRef={calendarRef}
          setView={setView}
          setDate={setDate}
          setMoreEventsData={setMoreEventsData}
          setShowMoreEventsModal={setShowMoreEventsModal}
          setSelectedEvent={setSelectedEvent}
          setIsEditing={setIsEditing}
        />
      </div>

      {(showForm || isEditing) && (
        <AddScheduleModal
          showForm={showForm || isEditing}
          onClose={() => {
            setShowForm(false)
            setIsEditing(false)
            setSelectedEvent(null)
          }}
          onSubmit={handleAddScheduleSubmit}
          doctors={doctors}
          register={register}
          handleSubmit={handleSubmit}
          watch={watch}
          control={control}
        />
      )}

      <EventDetailsModal
        selectedEvent={selectedEvent}
        isEditing={isEditing}
        onClose={() => setSelectedEvent(null)}
        onEdit={handleEventDetailsEdit}
        onDeleteThis={handleEventDetailsDeleteThis}
        onDeleteAll={handleEventDetailsDeleteAll}
      />

      {showMoreEventsModal && (
        <MoreEventsModal
          events={moreEventsData}
          onClose={() => setShowMoreEventsModal(false)}
          onSelectEvent={(event) => {
            setSelectedEvent(event)
            setIsEditing(false)
            setShowMoreEventsModal(false)
          }}
        />
      )}
    </div>
  )
}
