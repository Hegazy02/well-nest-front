import { parse, setHours, setMinutes } from "date-fns"
import { nextDay } from "date-fns"

const dayMap = {
  Sunday: 0,
  Monday: 1,
  Tuesday: 2,
  Wednesday: 3,
  Thursday: 4,
  Friday: 5,
  Saturday: 6,
}



export function convertScheduleToEvents(schedules) {
  return schedules.map((schedule) => {
    const { day, from, to, doctorName, id } = schedule

    const [fromHour, fromMin] = from.split(":").map(Number)
    const [toHour, toMin] = to.split(":").map(Number)

    const eventStart = setMinutes(
      setHours(nextDay(new Date(), dayMap[day]), fromHour),
      fromMin
    )

    const eventEnd = setMinutes(
      setHours(nextDay(new Date(), dayMap[day]), toHour),
      toMin
    )

    return {
      id,
      title: doctorName,
      start: eventStart,
      end: eventEnd,
      doctorName,
    }
  })
}

export function getDoctorColor(doctorName) {
  const colors = ["#6366F1", "#14B8A6", "#F97316", "#84CC16", "#A855F7", "#06B6D4"]
  const hash = doctorName.split("").reduce((a, b) => {
    a = (a << 5) - a + b.charCodeAt(0)
    return a & a
  }, 0)

  return colors[Math.abs(hash) % colors.length]
}
