import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import type { DailyData } from "../utils/scoreHelpers";

interface SymptomsChartProps {
  data: DailyData[];
}

export default function SymptomsChart({ data }: SymptomsChartProps) {
  // Get symptom counts
  const allSymptoms = data.flatMap((d) => d.symptoms || []);
  const symptomCounts = allSymptoms.reduce(
    (acc, symptom) => {
      acc[symptom] = (acc[symptom] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>
  );

  const symptomData = Object.entries(symptomCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 6)
    .map(([symptom, count], index) => ({
      name: symptom,
      value: count,
      percentage: Math.round((count / data.length) * 100),
      fill: ["#8b5cf6", "#ec4899", "#10b981", "#f59e0b", "#ef4444", "#3b82f6"][
        index
      ],
    }));

  if (symptomData.length === 0) {
    return (
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          🩹 Most Common Symptoms
        </h2>
        <div className="text-center py-8">
          <p className="text-gray-500">No symptoms data to display</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
        🩹 Most Common Symptoms
      </h2>

      {/* Mobile: Stacked layout */}
      <div className="block sm:hidden space-y-4">
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={symptomData}
                cx="50%"
                cy="50%"
                innerRadius={40}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
              >
                {symptomData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg max-w-[160px]">
                        <p className="font-medium text-gray-900 mb-1 text-sm">
                          {data.name}
                        </p>
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <div
                              className="w-3 h-3 rounded-full flex-shrink-0"
                              style={{ backgroundColor: data.fill }}
                            />
                            <span className="text-xs text-gray-700">
                              {data.value} times
                            </span>
                          </div>
                          <div className="text-xs text-gray-500">
                            {data.percentage}% of days
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {symptomData.map((entry, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className="w-3 h-3 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.fill }}
              />
              <div className="flex-grow min-w-0">
                <div className="text-sm font-medium text-gray-900 truncate">
                  {entry.name}
                </div>
                <div className="text-xs text-gray-500">{entry.value}x</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Side-by-side layout */}
      <div className="hidden sm:flex w-full h-96">
        <ResponsiveContainer width="60%" height="100%">
          <PieChart>
            <Pie
              data={symptomData}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={120}
              paddingAngle={5}
              dataKey="value"
            >
              {symptomData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
                      <p className="font-medium text-gray-900 mb-2">{`Symptom: ${data.name}`}</p>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: data.fill }}
                          />
                          <span className="text-sm text-gray-700">
                            Frequency: {data.value} times
                          </span>
                        </div>
                        <div className="text-sm text-gray-500">
                          Occurred in {data.percentage}% of tracked days
                        </div>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="w-40% flex flex-col justify-center space-y-3">
          {symptomData.map((entry, index) => (
            <div key={index} className="flex items-center space-x-3">
              <div
                className="w-4 h-4 rounded-full flex-shrink-0"
                style={{ backgroundColor: entry.fill }}
              />
              <div className="flex-grow">
                <div className="text-sm font-medium text-gray-900">
                  {entry.name}
                </div>
                <div className="text-xs text-gray-500">{entry.value} times</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
