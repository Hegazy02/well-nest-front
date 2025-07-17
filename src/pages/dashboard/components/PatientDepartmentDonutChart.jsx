import React, { useState, useEffect } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { getPatientDepartmentStatistics } from "../../../core/api/departmentsApi";
import PrimaryDropDown from "../../../core/components/PrimaryDropDown";

const COLORS = ["#1a237e", "#4dd0e1", "#b2ebf2", "#e0e0e0"];
const ranges = [
  { label: "This Week", value: 7 },
  { label: "Last 14 Days", value: 14 },
  { label: "Last 30 Days", value: 30 },
];

function getDateRange(days) {
  const to = new Date();
  const from = new Date();
  from.setDate(to.getDate() - (days - 1));
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
  };
}

const PatientDepartmentDonutChart = () => {
  const [range, setRange] = useState(ranges[0]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const { from, to } = getDateRange(range.value);
    setLoading(true);
    setError(null);
    getPatientDepartmentStatistics(from, to)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data");
        setLoading(false);
      });
  }, [range]);

  const chartData = data?.departmentsPercentage || [];
  const total = data?.totalAppointment || 0;
  console.log("chartData", chartData);
  console.log("total", total);

  return (
    <div className="bg-white rounded-2xl p-6 border border-[#eee] w-full max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="font-bold text-xl">Patient Overview</div>
          <div className="text-gray-400 text-sm">by Departments</div>
        </div>
      </div>
      <div className="flex flex-col items-center justify-center">
        {loading ? (
          <div className="h-[200px] flex items-center justify-center text-gray-400">
            Loading...
          </div>
        ) : error ? (
          <div className="h-[200px] flex items-center justify-center text-red-400">
            {error}
          </div>
        ) : (
          <ResponsiveContainer width={220} height={220}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="percentage"
                nameKey="title"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={2}
                startAngle={90}
                endAngle={-270}
              >
                {chartData.map((entry, idx) => (
                  <Cell
                    key={`cell-${idx}`}
                    fill={COLORS[idx % COLORS.length]}
                  />
                ))}
              </Pie>
              <foreignObject x="60" y="90" width="100" height="60">
                <div
                  className="flex flex-col items-center justify-center"
                  style={{ pointerEvents: "none" }}
                >
                  <div className="text-gray-400 text-sm">Overall</div>
                  <div className="font-bold text-2xl">{total}</div>
                  <PrimaryDropDown
                    text={range.label}
                    onSelect={(e) => setRange(ranges[e])}
                  >
                    {ranges.map((r) => (
                      <option key={r.value} value={r.value}>
                        {r.label}
                      </option>
                    ))}
                  </PrimaryDropDown>
                </div>
              </foreignObject>
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="mt-4">
        {chartData.map((entry, idx) => (
          <div
            key={entry.title}
            className="flex items-center justify-between mb-1"
          >
            <div className="flex items-center gap-2">
              <span
                className="w-3 h-3 rounded-full inline-block"
                style={{ background: COLORS[idx % COLORS.length] }}
              ></span>
              <span className="text-gray-700 text-sm font-medium">
                {entry.title}
              </span>
            </div>
            <span className="text-gray-700 text-sm font-semibold">
              {entry.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PatientDepartmentDonutChart;
