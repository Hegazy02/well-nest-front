
import { Bar, BarChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import PrimaryDropDown from "../../../../core/components/PrimaryDropDown"

const AppointmentChart = ({
  appointmentStatsData,
  getAppointmentRangeLabel,
  appointmentChartRange,
  setAppointmentChartRange,
}) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden p-6">
      <div className="flex flex-row items-center justify-between mb-4">
        <p className="text-lg font-semibold text-[#1e3a5f]">Appointment Stats</p>
        <div className="flex items-center gap-2">
          <p className="text-sm text-[#64748b]">{getAppointmentRangeLabel}</p>
          <PrimaryDropDown
            text={
              appointmentChartRange === "week"
                ? "This Week"
                : appointmentChartRange === "lastWeek"
                  ? "Last Week"
                  : "This Month"
            }
            onSelect={(index) => {
              if (index === 0) setAppointmentChartRange("week")
              if (index === 1) setAppointmentChartRange("lastWeek")
              if (index === 2) setAppointmentChartRange("month")
            }}
            onSearch={() => {}}
          >
            <div className="cursor-pointer hover:bg-gray-100 p-2">This Week</div>
            <div className="cursor-pointer hover:bg-gray-100 p-2">Last Week</div>
            <div className="cursor-pointer hover:bg-gray-100 p-2">This Month</div>
          </PrimaryDropDown>
        </div>
      </div>
      <div className="min-h-[200px] w-full">
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={appointmentStatsData}>
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fontSize: 12, fill: "#64748b" }}
            />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} tick={{ fontSize: 12, fill: "#64748b" }} />
            <Tooltip
              cursor={{ fill: "#f0f7ff" }}
              contentStyle={{
                backgroundColor: "white",
                border: "1px solid #e6f3ff",
                borderRadius: "0.375rem",
                padding: "0.5rem",
                fontSize: "0.875rem",
                color: "#64748b",
              }}
              labelStyle={{ color: "#1e3a5f" }}
              labelFormatter={(label, payload) => {
                if (payload && payload.length > 0 && payload[0].payload.fullDate) {
                  return payload[0].payload.fullDate
                }
                return label
              }}
            />
            <Bar dataKey="totalAppointments" fill="#60a5fa" radius={[4, 4, 0, 0]} name="Total Appointments" />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex justify-center mt-4 text-center">
        <div>
          <p className="text-2xl font-bold text-[#1e3a5f]">
            {appointmentStatsData.reduce((acc, curr) => acc + curr.totalAppointments, 0)}
          </p>
          <p className="text-sm text-[#64748b]">Total Appointments</p>
        </div>
      </div>
    </div>
  )
}

export default AppointmentChart
