import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { getAppointmenstPatientsAgeStatistics } from "../../../core/api/patientsApi";
import PrimaryDropDown from "../../../core/components/PrimaryDropDown";
import Loader from "../../../core/components/Loader";
import Skeleton from "react-loading-skeleton";

const AGE_COLORS = {
  child: "#1a237e",
  adult: "#4dd0e1",
  elderly: "#b2ebf2",
};

const ranges = [
  { label: "Last 8 Days", value: 8 },
  { label: "Last 14 Days", value: 14 },
  { label: "Last 30 Days", value: 30 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload || !payload.length) return null;
  return (
    <div className="bg-white rounded-lg  p-2 flex gap-4">
      <div>
        <div className="font-bold text-xs mb-1">{label}</div>
        <div className="flex gap-4">
          <div className="text-xs text-[#1a237e]">
            Child <span className="font-bold">{payload[0]?.value}</span>
          </div>
          <div className="text-xs text-[#4dd0e1]">
            Adult <span className="font-bold">{payload[1]?.value}</span>
          </div>
          <div className="text-xs text-[#b2ebf2]">
            Elderly <span className="font-bold">{payload[2]?.value}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

function getDateRange(days) {
  const toDate = new Date();
  const fromDate = new Date();
  fromDate.setDate(toDate.getDate() - (days - 1));
  return {
    fromDate: fromDate.toISOString().slice(0, 10),
    toDate: toDate.toISOString().slice(0, 10),
  };
}

const PatientOverviewChart = () => {
  const [range, setRange] = useState(ranges[0]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const { fromDate, toDate } = getDateRange(range.value);
    setLoading(true);
    setError(null);
    getAppointmenstPatientsAgeStatistics(fromDate, toDate)
      .then((res) => {
        console.log("dataaa", res);

        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data");
        setLoading(false);
      });
  }, [range]);

  // Sort and format data for chart
  const chartData = [...(data?.days || [])]
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
      }),
      child: d.child,
      adult: d.adult,
      elderly: d.elderly,
    }));

  return (
    <div className="bg-white rounded-2xl p-2 border border-[#eee]">
      <div className="flex items-center justify-between mb-2">
        <div>
          <div className="font-bold text-xl">Patient Overview</div>
          <div className="text-gray-400 text-sm">by Age Stages</div>
        </div>
        <PrimaryDropDown
          text={range.label}
          onSelect={(e) => {
            setRange(ranges[e]);
          }}
        >
          {ranges.map((r) => (
            <option key={r.value} value={r.value}>
              {r.label}
            </option>
          ))}
        </PrimaryDropDown>
      </div>
      <div className="flex gap-6 mb-2 mt-2">
        <div className="flex items-center gap-2 text-[#1a237e] font-bold text-sm">
          <span className="w-3 h-3 rounded-full bg-[#1a237e] inline-block"></span>
          Child
        </div>
        <div className="flex items-center gap-2 text-[#4dd0e1] font-bold text-sm">
          <span className="w-3 h-3 rounded-full bg-[#4dd0e1] inline-block"></span>
          Adult
        </div>
        <div className="flex items-center gap-2 text-[#b2ebf2] font-bold text-sm">
          <span className="w-3 h-3 rounded-full bg-[#b2ebf2] inline-block"></span>
          Elderly
        </div>
      </div>
      {error ? (
        <div className="h-[260px] flex items-center justify-center text-red-400">
          {error}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={260}>
          {chartData.length == 0 ? (
            <Skeleton height={260} />
          ) : (
            <BarChart data={chartData} barGap={4} barCategoryGap={16}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip content={<CustomTooltip />} />
              {/* <Legend /> */}
              <Bar
                dataKey="child"
                fill={AGE_COLORS.child}
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="adult"
                fill={AGE_COLORS.adult}
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="elderly"
                fill={AGE_COLORS.elderly}
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default PatientOverviewChart;
