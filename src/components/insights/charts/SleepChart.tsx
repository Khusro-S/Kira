import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { DailyData } from "../utils/scoreHelpers";

interface SleepChartProps {
  data: DailyData[];
}

export default function SleepChart({ data }: SleepChartProps) {
  const sleepData = data
    .filter((d) => d.sleep)
    .map((d) => ({
      date: new Date(d.date).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      }),
      sleep: d.sleep!,
    }));

  if (sleepData.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          😴 Sleep Patterns
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No sleep data to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
        😴 Sleep Patterns
      </h2>
      <div className="w-full h-60 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={sleepData}
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
              domain={[0, 12]}
              tickFormatter={(value) => `${value}h`}
              tick={{ fontSize: 10 }}
              tickLine={{ stroke: "#9ca3af" }}
              axisLine={{ stroke: "#9ca3af" }}
              width={35}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const sleepValue = payload[0]?.value as number;
                  let sleepQuality = "";
                  let qualityColor = "";
                  if (sleepValue >= 7 && sleepValue <= 9) {
                    sleepQuality = " (Optimal)";
                    qualityColor = "text-green-600";
                  } else if (sleepValue < 7) {
                    sleepQuality = " (Too short)";
                    qualityColor = "text-orange-600";
                  } else {
                    sleepQuality = " (Too long)";
                    qualityColor = "text-orange-600";
                  }

                  return (
                    <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-[180px]">
                      <p className="font-medium text-gray-900 mb-2 text-sm">
                        {label}
                      </p>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-blue-500 flex-shrink-0" />
                        <span className="text-xs text-gray-700">
                          {sleepValue}h
                          <span className={`font-medium ${qualityColor}`}>
                            {sleepQuality}
                          </span>
                        </span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar
              dataKey="sleep"
              fill="#3b82f6"
              radius={[4, 4, 0, 0]}
              stroke="#2563eb"
              strokeWidth={1}
              name="Sleep Hours"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs sm:text-sm text-gray-600 mt-2">
        Optimal sleep range is 7-9 hours per night
      </p>
    </div>
  );
}
