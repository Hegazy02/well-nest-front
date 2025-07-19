
import FullCalendar from "@fullcalendar/react"
import dayGridPlugin from "@fullcalendar/daygrid"
import timeGridPlugin from "@fullcalendar/timegrid"
import interactionPlugin from "@fullcalendar/interaction"
import Loader from "../../../core/components/Loader"
import { format } from "date-fns"
import { getDoctorColor } from "../../../core/utils/ScheduleUtils"
const CalendarSection = ({
  events,
  loading,
  calendarRef,
  setView,
  setDate,
  setMoreEventsData,
  setShowMoreEventsModal,
  setSelectedEvent,
  setIsEditing,
}) => {
  const renderEventContent = (eventInfo) => {
    const event = eventInfo.event
    const backgroundColor = getDoctorColor(event.extendedProps.doctorName || event.title)
    return (
      <div
        className="h-full flex flex-col justify-center overflow-hidden p-1 rounded-md cursor-pointer"
        style={{ backgroundColor, opacity: 0.95, color: "black", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }}
      >
        <div className="text-black text-sm truncate font-normal">{event.title}</div>
        <div className="text-black text-xs opacity-95">
          {format(event.start, "hh:mm a")} - {format(event.end, "hh:mm a")}
        </div>
      </div>
    )
  }

  const renderDayCellContent = (dayRenderInfo) => {
    const date = dayRenderInfo.date
    const allEventsForDay = events.filter((event) => {
      const eventDate = new Date(event.start)
      return (
        eventDate.getFullYear() === date.getFullYear() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getDate() === date.getDate()
      )
    })
    const displayedEvents = allEventsForDay.slice(0, 3)
    const moreCount = allEventsForDay.length - displayedEvents.length
    return (
      <div className="fc-daygrid-day-frame fc-scrollgrid-sync-inner flex flex-col h-full p-1 gap-1">
        <div className="fc-daygrid-day-top">
          <span className="fc-daygrid-day-number">{dayRenderInfo.dayNumberText}</span>
        </div>

        <div className="flex flex-col gap-1">
          {displayedEvents.map((event) => (
            <button
              key={event.id}
              onClick={() => {
                setSelectedEvent(event)
                setIsEditing(false)
              }}
              className="px-2 py-[2px] text-[11px] rounded text-black truncate text-left w-full cursor-pointer"
              style={{
                backgroundColor: getDoctorColor(event.doctorName),
                fontWeight: 500,
              }}
            >
              <div className="truncate">{event.title}</div>
              <div className="text-[10px] text-black/90">
                {format(event.start, "hh:mm a")} - {format(event.end, "hh:mm a")}
              </div>
            </button>
          ))}
        </div>
        {moreCount > 0 && (
          <button
            onClick={() => {
              setMoreEventsData(allEventsForDay)
              setShowMoreEventsModal(true)
            }}
            className="text-[10px] text-blue-700 hover:underline text-left mt-auto cursor-pointer"
          >
            +{moreCount} more
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-auto p-4">
      {loading ? (
        <div className="flex items-center justify-center h-[400px]">
          <Loader />
        </div>
      ) : (

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 min-h-[900px]">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            eventContent={renderEventContent}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth,timeGridWeek,timeGridDay",
            }}
            views={{
              dayGridMonth: {
                titleFormat: { year: "numeric", month: "long" },
              },
              timeGridWeek: {
                titleFormat: { year: "numeric", month: "short", day: "numeric" },
              },
              timeGridDay: {
                titleFormat: { year: "numeric", month: "short", day: "numeric" },
              },
            }}
            events={events}
            eventClick={(clickInfo) => {
              setSelectedEvent({
                id: clickInfo.event.id,
                doctorName: clickInfo.event.title,
                start: clickInfo.event.start,
                end: clickInfo.event.end,
                doctorId: clickInfo.event.extendedProps.doctorId,
              })
              setIsEditing(false)
            }}
            eventDidMount={(info) => {
              if (info.el) {
                info.el.style.cursor = "pointer"
                info.el.classList.add("hover:shadow-md")
              }
            }}
            dateClick={(info) => {
              console.log("Date clicked:", info.dateStr)
            }}
            datesSet={(dateInfo) => {
              if (dateInfo.view.type === "dayGridMonth") setView("dayGridMonth")
              else if (dateInfo.view.type === "timeGridWeek") setView("timeGridWeek")
              else if (dateInfo.view.type === "timeGridDay") setView("timeGridDay")
              setDate(dateInfo.view.calendar.getDate())
            }}
            dayCellContent={renderDayCellContent}
            moreLinkClick={(info) => {
              console.log("More link clicked! Info:", info)
              info.jsEvent.preventDefault()
              info.jsEvent.stopPropagation()

              const allDayEvents = (info.allEvents ?? []).map((fcEvent) => ({
                id: fcEvent.id,
                title: fcEvent.title,
                start: fcEvent.start,
                end: fcEvent.end,
                doctorName: fcEvent.extendedProps.doctorName || fcEvent.title,
                doctorId: fcEvent.extendedProps.doctorId,
              }))

              console.log("Events for date:", allDayEvents)

              setMoreEventsData(allDayEvents)
              setShowMoreEventsModal(true)

              return false
            }}
            moreLinkDidMount={(info) => {
              const fcPopover = document.querySelector(".fc-more-popover")
              if (fcPopover) {
                console.log("Found FullCalendar popover via moreLinkDidMount, attempting to remove it.")
                fcPopover.remove()
              }
            }}
            height="auto"
          />
        </div>
      )}
    </div>
  )
}

export default CalendarSection
