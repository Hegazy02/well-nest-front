
import { useState, useEffect, useMemo } from "react"
import { useParams } from "react-router-dom"
import { Endpoints } from "../../../core/utils/endpoints"
import { apiClient } from "../../../core/utils/apiClient"
import DoctorProfileCard from "./Components/DoctorProfileCard"
import StatsCards from "./Components/StatsCards"
import AppointmentChart from "./Components/AppointmentChart"
import ScheduleAndAppointments from "./Components/ScheduleAndAppointments"
import ErrorComponent from "../../../core/components/ErrorComponent"
import Loader from "../../../core/components/Loader"

export default function DoctorDetails() {
  const [doctor, setDoctor] = useState(null)
  const [schedule, setSchedule] = useState([]) 
  const [appointments, setAppointments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const { id: doctorId } = useParams()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [appointmentChartRange, setAppointmentChartRange] = useState("week") 

  const getDatesForRange = (rangeType) => {
    const dates = []
    const startDate = new Date()

    if (rangeType === "week") {
      const dayOfWeek = startDate.getDay() 
      startDate.setDate(startDate.getDate() - dayOfWeek) 
    } else if (rangeType === "lastWeek") {
      const dayOfWeek = startDate.getDay()
      startDate.setDate(startDate.getDate() - dayOfWeek - 7) 
    } else if (rangeType === "month") {
      startDate.setDate(1) 
    }

    startDate.setHours(0, 0, 0, 0)

    for (let i = 0; i < (rangeType === "month" ? 31 : 7); i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      if (rangeType === "month" && currentDate.getMonth() !== startDate.getMonth()) {
        break 
      }
      dates.push(currentDate)
    }
    return dates
  }

  const getAppointmentRangeLabel = useMemo(() => {
    const today = new Date()
    let startDate, endDate

    if (appointmentChartRange === "week") {
      startDate = new Date(today)
      startDate.setDate(today.getDate() - today.getDay()) 
      endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6) 
    } else if (appointmentChartRange === "lastWeek") {
      startDate = new Date(today)
      startDate.setDate(today.getDate() - today.getDay() - 7) 
      endDate = new Date(startDate)
      endDate.setDate(startDate.getDate() + 6) 
    } else if (appointmentChartRange === "month") {
      startDate = new Date(today.getFullYear(), today.getMonth(), 1) 
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0) 
    }

    const formatOptions = { month: "short", day: "numeric" }
    const startStr = startDate.toLocaleDateString("en-US", formatOptions)
    const endStr = endDate.toLocaleDateString("en-US", formatOptions)

    const yearSuffix =
      startDate.getFullYear() !== endDate.getFullYear() || appointmentChartRange === "month"
        ? `, ${startDate.getFullYear()}`
        : ""

    return `${startStr} - ${endStr}${yearSuffix}`
  }, [appointmentChartRange])

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setError(null)
      try {
        const [doctorRes, appointmentsRes, scheduleRes] = await Promise.all([
          apiClient.get(`${Endpoints.doctors}/${doctorId}`),
          apiClient.get(`${Endpoints.appointments}?doctorId=${doctorId}`),
          apiClient.get(`${Endpoints.calendar}?doctorId=${doctorId}`),
        ])

        if (doctorRes.data.success) {
          setDoctor(doctorRes.data.data)
        } else {
          setError(doctorRes.data.message || "Failed to fetch doctor data.")
        }

        if (appointmentsRes.data.success) {
          setAppointments(appointmentsRes.data.data)
        } else {
          console.error("Failed to fetch appointments")
          setAppointments([])
        }

        if (scheduleRes.data.success) {
          setSchedule(scheduleRes.data.data)
        } else {
          console.error("Failed to fetch schedule")
          setSchedule([])
        }
      } catch (err) {
        console.error("Error fetching data:", err)
        setError(err.response?.data?.message || err.message || "An unexpected error occurred.")
      } finally {
        setLoading(false)
      }
    }
    if (doctorId) {
      fetchData()
    }
  }, [doctorId])

  useEffect(() => {
    if (doctor) {
      console.log("Doctor after fetch:", doctor)
      console.log("patientCount:", doctor.patientCount)
    }
  }, [doctor])

  useEffect(() => {
    console.log("Appointments Data:", appointments)
  }, [appointments])

  useEffect(() => {
    console.log("Doctor Schedule Response (state):", schedule)
  }, [schedule])

  

  const getCurrentWeekDates = () => {
    const dates = []
    const start = new Date(currentWeek)
    const dayOfWeek = start.getDay()
    const diff = start.getDate() - dayOfWeek
    const startDate = new Date(start.setDate(diff))
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(startDate)
      currentDate.setDate(startDate.getDate() + i)
      dates.push(currentDate)
    }
    return dates
  }

  const getScheduleForSelectedDate = () => {
    if (!schedule || !selectedDate) return []

    const selectedDayName = selectedDate.toLocaleDateString("en-US", { weekday: "long" })
    const selectedDateNormalized = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate())

    return schedule.filter((shift) => {
      const shiftDate = new Date(shift.date)
      const shiftDateNormalized = new Date(shiftDate.getFullYear(), shiftDate.getMonth(), shiftDate.getDate())

      return shift.day === selectedDayName && shiftDateNormalized.getTime() === selectedDateNormalized.getTime()
    })
  }

  const selectedDaySchedule = getScheduleForSelectedDate()

  const selectedDayAppointments = useMemo(() => {
    if (!appointments || !selectedDate) return []
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date)
      return (
        aptDate.getDate() === selectedDate.getDate() &&
        aptDate.getMonth() === selectedDate.getMonth() &&
        aptDate.getFullYear() === selectedDate.getFullYear()
      )
    })
  }, [appointments, selectedDate])

  const newPatientsCount = useMemo(() => {
    return appointments.filter((apt) => apt.patientId?.visitTypeId?.visitType === "new").length || 0
  }, [appointments])

  const followUpCount = useMemo(() => {
    return appointments.filter((apt) => apt.patientId?.visitTypeId?.visitType === "checkUp").length || 0
  }, [appointments])

  const todayAppointmentsCount = useMemo(() => {
    if (!appointments.length) return 0
    const today = new Date()
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.date)
      return (
        aptDate.getDate() === today.getDate() &&
        aptDate.getMonth() === today.getMonth() &&
        aptDate.getFullYear() === today.getFullYear()
      )
    }).length
  }, [appointments])

  const getAppointmentStats = useMemo(() => {
    if (!appointments.length) return []
    const datesToConsider = getDatesForRange(appointmentChartRange)

    const stats = datesToConsider.map((date) => {
      const dayAppointments = appointments.filter((apt) => {
        const aptDate = new Date(apt.date)
        return aptDate.toDateString() === date.toDateString()
      })
      const newPatients = dayAppointments.filter((apt) => apt.patientId?.visitTypeId?.visitType === "new").length
      const followUp = dayAppointments.filter((apt) => apt.patientId?.visitTypeId?.visitType === "checkUp").length
      const totalAppointmentsPerDay = dayAppointments.length 

      return {
        day: date.toLocaleDateString("en-US", { weekday: "short" }),
        fullDate: date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
        newPatients,
        followUp,
        totalAppointments: totalAppointmentsPerDay, 
      }
    })
    return stats
  }, [appointments, appointmentChartRange])

  const totalPatients = doctor?.patientCount || 0
  const totalAppointments = appointments.length || 0
  const appointmentStatsData = getAppointmentStats

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f0f4f8]">
        <Loader />
      </div>
    )
  }

if (error) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-[#f0f4f8]">
      <ErrorComponent  />
    </div>
  )
}

  if (!doctor) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#f0f4f8]">
        <div className="text-[#1e3a5f] text-lg">No doctor found for ID: {doctorId}</div>
      </div>
    )
  }

  return (
    <div className="flex bg-[#f0f4f8]">
      <div className="flex-1 flex flex-col">
        {/* Main Content Area */}
        <main className="flex-1 p-0 overflow-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
            <DoctorProfileCard doctor={doctor} />

            {/* Right Column */}
            <div className="lg:col-span-2 grid grid-rows-[auto_1fr_auto] gap-3">
              <StatsCards
                totalPatients={totalPatients}
                totalAppointments={totalAppointments}
                todayAppointmentsCount={todayAppointmentsCount}
              />

              <AppointmentChart
                appointmentStatsData={appointmentStatsData}
                getAppointmentRangeLabel={getAppointmentRangeLabel}
                appointmentChartRange={appointmentChartRange}
                setAppointmentChartRange={setAppointmentChartRange}
                totalAppointments={totalAppointments}
              />

              <ScheduleAndAppointments
                currentWeek={currentWeek}
                setCurrentWeek={setCurrentWeek}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectedDaySchedule={selectedDaySchedule}
                getCurrentWeekDates={getCurrentWeekDates}
                selectedDayAppointments={selectedDayAppointments}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
