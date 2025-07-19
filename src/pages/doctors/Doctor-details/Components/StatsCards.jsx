
import { Calendar, Clock, Users } from "lucide-react"

const StatsCards = ({ totalPatients, totalAppointments, todayAppointmentsCount }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <div className="bg-white rounded-lg overflow-hidden p-6 flex items-center gap-4">
        <div className="p-3 bg-[#e6f3ff] rounded-full">
          <Users className="h-6 w-6 text-[#1e3a5f]" />
        </div>
        <div>
          <p className="text-sm text-[#64748b]">Total Patients</p>
          <p className="text-2xl font-bold text-[#1e3a5f]">{totalPatients}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg overflow-hidden p-6 flex items-center gap-4">
        <div className="p-3 bg-[#e6f3ff] rounded-full">
          <Calendar className="h-6 w-6 text-[#1e3a5f]" />
        </div>
        <div>
          <p className="text-sm text-[#64748b]">Total Appointments</p>
          <p className="text-2xl font-bold text-[#1e3a5f]">{totalAppointments}</p>
        </div>
      </div>
      <div className="bg-white rounded-lg overflow-hidden p-6 flex items-center gap-4">
        <div className="p-3 bg-[#e6f3ff] rounded-full">
          <Clock className="h-6 w-6 text-[#1e3a5f]" />
        </div>
        <div>
          <p className="text-sm text-[#64748b]">Today's Appointments</p>
          <p className="text-2xl font-bold text-[#1e3a5f]">{todayAppointmentsCount}</p>
        </div>
      </div>
    </div>
  )
}

export default StatsCards
