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
    const { day, from, to, doctorName, id, date, doctorId } = schedule 

    const [fromHour, fromMin] = from.split(":").map(Number)
    const [toHour, toMin] = to.split(":").map(Number)

    let baseDate
    if (date) {
      baseDate = new Date(date)
    } else {
      console.warn("No date provided for schedule, calculating next occurrence")
      baseDate = getNextDayDate(day)
    }

    const eventStart = new Date(baseDate)
    eventStart.setHours(fromHour, fromMin, 0, 0)
    const eventEnd = new Date(baseDate)
    eventEnd.setHours(toHour, toMin, 0, 0)

    return {
      id, 
      title: doctorName,
      start: eventStart,
      end: eventEnd,
      doctorName,
      doctorId, 
    }
  })
}

function getNextDayDate(dayName) {
  const today = new Date()
  const todayIndex = today.getDay()
  const targetIndex = dayMap[dayName]
  let daysToAdd = targetIndex - todayIndex
  if (daysToAdd <= 0) daysToAdd += 7
  const targetDate = new Date()
  targetDate.setDate(today.getDate() + daysToAdd)
  return targetDate
}

const colors = ["#96bcffff", "#7999dcff"]

const doctorColorMap = new Map()
let colorIndex = 0

export function getDoctorColor(doctorName) {
  if (doctorColorMap.has(doctorName)) {
    return doctorColorMap.get(doctorName)
  }

  const assignedColor = colors[colorIndex % colors.length]
  doctorColorMap.set(doctorName, assignedColor)
  colorIndex++
  return assignedColor
}
