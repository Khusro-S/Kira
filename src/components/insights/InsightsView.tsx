import { useState, useEffect } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import type { DailyData, TimeRange } from "./utils/scoreHelpers";
import TimeRangeSelector from "./TimeRangeSelector";
import TrendsChart from "./charts/TrendsChart";
import SleepChart from "./charts/SleepChart";
import SymptomsChart from "./charts/SymptomsChart";
import CycleOverview from "./charts/CycleOverview";
import PersonalInsights from "./PersonalInsights";

export default function InsightsView() {
  const dailyData = useQuery(api.cycles.getUserDailyTracking);
  const [insights, setInsights] = useState<string[]>([]);
  const [selectedRange, setSelectedRange] = useState<TimeRange>("30days");

  // Get data for selected time range
  const getDataForRange = (range: TimeRange): DailyData[] => {
    if (!dailyData) return [];

    const now = new Date();
    const startDate = new Date();

    switch (range) {
      case "30days":
        startDate.setDate(now.getDate() - 30);
        break;
      case "3months":
        startDate.setMonth(now.getMonth() - 3);
        break;
      case "6months":
        startDate.setMonth(now.getMonth() - 6);
        break;
      case "1year":
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    return dailyData
      .filter((data) => new Date(data.date) >= startDate)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  };

  const rangeData = getDataForRange(selectedRange);

  // Generate insights based on data
  useEffect(() => {
    if (rangeData.length === 0) return;

    const newInsights: string[] = [];

    // Sleep insights
    const sleepData = rangeData.filter((d) => d.sleep);
    if (sleepData.length > 0) {
      const avgSleep =
        sleepData.reduce((sum, d) => sum + (d.sleep || 0), 0) /
        sleepData.length;
      newInsights.push(
        `You average ${avgSleep.toFixed(1)} hours of sleep per night`
      );

      if (avgSleep < 7) {
        newInsights.push(
          "Consider aiming for 7-9 hours of sleep for better health"
        );
      }
    }

    // Period insights
    const periodDays = rangeData.filter(
      (d) => d.flow && d.flow !== "none"
    ).length;
    if (periodDays > 0) {
      const timeframe =
        selectedRange === "30days"
          ? "30 days"
          : selectedRange === "3months"
            ? "3 months"
            : selectedRange === "6months"
              ? "6 months"
              : "year";
      newInsights.push(
        `You had ${periodDays} period days in the last ${timeframe}`
      );
    }

    // Mood insights
    const moodData = rangeData.filter((d) => d.mood);
    const greatDays = moodData.filter((d) => d.mood === "great").length;
    if (moodData.length > 0) {
      const percentage = Math.round((greatDays / moodData.length) * 100);
      newInsights.push(`${percentage}% of your tracked days had a great mood`);
    }

    // Symptom insights
    const symptomsData = rangeData.filter(
      (d) => d.symptoms && d.symptoms.length > 0
    );
    if (symptomsData.length > 0) {
      const allSymptoms = symptomsData.flatMap((d) => d.symptoms || []);
      const symptomCounts = allSymptoms.reduce(
        (acc, symptom) => {
          acc[symptom] = (acc[symptom] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>
      );

      const mostCommon = Object.entries(symptomCounts).sort(
        ([, a], [, b]) => (b as number) - (a as number)
      )[0];

      if (mostCommon) {
        newInsights.push(
          `Your most common symptom is ${mostCommon[0].toLowerCase()} (${mostCommon[1]} times)`
        );
      }
    }

    setInsights(newInsights);
  }, [rangeData, selectedRange]);

  return (
    <div className="space-y-6 sm:space-y-8 px-4 sm:px-0">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Your Health Insights
        </h1>
        {rangeData.length !== 0 && (
          <p className="text-sm sm:text-base text-gray-600">
            Based on your last {rangeData.length} days of tracking
          </p>
        )}
      </div>

      {rangeData.length === 0 ? (
        <div className="text-center py-8 sm:py-12">
          <div className="text-5xl sm:text-6xl mb-4">📊</div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            No Data Yet
          </h3>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            Start tracking your daily health to see insights here!
          </p>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {/* Time Range Selector */}
          <TimeRangeSelector
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />

          {/* Charts */}
          <TrendsChart data={rangeData} />
          <SleepChart data={rangeData} />
          <SymptomsChart data={rangeData} />
          <CycleOverview data={rangeData} />

          {/* Personal Insights */}
          <PersonalInsights insights={insights} />
        </div>
      )}
    </div>
  );
}
