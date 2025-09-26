import type { DailyData } from "../utils/scoreHelpers";

interface CycleOverviewProps {
  data: DailyData[];
}

export default function CycleOverview({ data }: CycleOverviewProps) {
  const periodDays = data.filter((d) => d.flow && d.flow !== "none").length;
  const totalDays = data.length;
  const avgSleep = data
    .filter((d) => d.sleep)
    .reduce((sum, d, _, arr) => sum + (d.sleep || 0) / arr.length, 0);
  const moodData = data.filter((d) => d.mood);
  const goodMoodDays = moodData.filter((d) =>
    ["great", "good"].includes(d.mood || "")
  ).length;

  return (
    <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm border border-gray-200">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
        📊 Quick Overview
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-pink-600">
            {periodDays}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Period Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-blue-600">
            {avgSleep.toFixed(1)}h
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Avg Sleep</div>
        </div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-green-600">
            {moodData.length > 0
              ? Math.round((goodMoodDays / moodData.length) * 100)
              : 0}
            %
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Good Mood Days</div>
        </div>
        <div className="text-center">
          <div className="text-2xl sm:text-3xl font-bold text-purple-600">
            {totalDays}
          </div>
          <div className="text-xs sm:text-sm text-gray-600">Days Tracked</div>
        </div>
      </div>
    </div>
  );
}
