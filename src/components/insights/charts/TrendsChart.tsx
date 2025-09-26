import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import type { DailyData } from "../utils/scoreHelpers";
import {
  getMoodScore,
  getEnergyScore,
  getFlowScore,
  getScoreLabel,
  getFlowLabel,
} from "../utils/scoreHelpers";

interface TrendsChartProps {
  data: DailyData[];
}

export default function TrendsChart({ data }: TrendsChartProps) {
  // Prepare data for chart
  const chartData = data
    .filter((d) => d.mood || d.energy || d.flow)
    .map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      mood: d.mood ? getMoodScore(d.mood) : null,
      energy: d.energy ? getEnergyScore(d.energy) : null,
      flow: d.flow ? getFlowScore(d.flow) : null,
    }));

  if (chartData.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">📈 Trends</h2>
        <div className="text-center py-8">
          <p className="text-gray-500">
            No mood, energy, or flow data to display
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
        📈 Trends
      </h2>
      <div className="w-full h-64 sm:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 15, left: 5, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="5 5"
              stroke="#e5e7eb"
              opacity={0.8}
            />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              tickLine={{ stroke: "#9ca3af" }}
              axisLine={{ stroke: "#9ca3af" }}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={[1, 5]}
              tickFormatter={(value) => getScoreLabel(value)}
              tick={{ fontSize: 10 }}
              tickLine={{ stroke: "#9ca3af" }}
              axisLine={{ stroke: "#9ca3af" }}
              width={50}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-[200px]">
                      <p className="font-medium text-gray-900 mb-2 text-sm">{`${label}`}</p>
                      {payload.map((pld, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-2 mb-1"
                        >
                          <div
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: pld.color }}
                          />
                          <span className="text-xs text-gray-700">
                            {pld.name}:{" "}
                            {pld.value
                              ? pld.name === "Flow"
                                ? getFlowLabel(pld.value as number)
                                : getScoreLabel(pld.value as number)
                              : "No data"}
                            {pld.name !== "Flow" && pld.value
                              ? ` (${pld.value}/5)`
                              : ""}
                          </span>
                        </div>
                      ))}
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              wrapperStyle={{ paddingTop: "15px" }}
              iconType="line"
              iconSize={12}
            />
            <Line
              type="monotone"
              dataKey="mood"
              stroke="#ec4899"
              strokeWidth={2}
              dot={{ fill: "#ec4899", strokeWidth: 1, r: 3 }}
              activeDot={{
                r: 6,
                fill: "#ec4899",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              connectNulls={false}
              name="Mood"
            />
            <Line
              type="monotone"
              dataKey="energy"
              stroke="#10b981"
              strokeWidth={2}
              dot={{ fill: "#10b981", strokeWidth: 1, r: 3 }}
              activeDot={{
                r: 6,
                fill: "#10b981",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              connectNulls={false}
              name="Energy"
            />
            <Line
              type="monotone"
              dataKey="flow"
              stroke="#dc2626"
              strokeWidth={2}
              dot={{ fill: "#dc2626", strokeWidth: 1, r: 3 }}
              activeDot={{
                r: 6,
                fill: "#dc2626",
                stroke: "#fff",
                strokeWidth: 2,
              }}
              connectNulls={false}
              name="Flow"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
