import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import type { DemoData } from "../../pages/Demo";
import type { DailyData, TimeRange } from "./utils/scoreHelpers";

import TrendsChart from "./charts/TrendsChart";
import SleepChart from "./charts/SleepChart";
import SymptomsChart from "./charts/SymptomsChart";
import CycleOverview from "./charts/CycleOverview";
import PersonalInsights from "./PersonalInsights";
import DemoTimeRangeSelector from "./DemoTimeRangeSelector";

interface DataMetadata {
  totalEntries: number;
  uniqueUsers: number;
  dateRange: { min: Date; max: Date } | null;
}

interface DemoInsightsViewProps {
  allDemoData: DemoData[];
  dataMetadata: DataMetadata;
  loadMonthData: (monthKey: string) => Promise<void>;
  availableMonths: string[];
}

export default function DemoInsightsView({
  allDemoData,
  dataMetadata,
  loadMonthData,
  availableMonths,
}: DemoInsightsViewProps) {
  const [insights, setInsights] = useState<string[]>([]);
  const [selectedRange, setSelectedRange] = useState<TimeRange>("30days");
  const [anchorDate, setAnchorDate] = useState<Date | null>(null);
  const loadingMonthsRef = useRef<Set<string>>(new Set());
  const availableMonthsRef = useRef<string[]>([]);
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const lastLoadParamsRef = useRef<string>(""); // Track last load parameters

  // Update availableMonths ref when it changes
  useEffect(() => {
    availableMonthsRef.current = availableMonths;
  }, [availableMonths]);

  // Initialize anchor date to the earliest available date
  useEffect(() => {
    if (dataMetadata.dateRange && !anchorDate) {
      setAnchorDate(dataMetadata.dateRange.min);
    }
  }, [dataMetadata.dateRange, anchorDate]);

  // Load months needed for the selected time range
  const loadRangeMonths = useCallback(async () => {
    if (!anchorDate || isLoading) return;

    const startDate = new Date(anchorDate);
    const endDate = new Date(startDate);

    switch (selectedRange) {
      case "30days":
        endDate.setDate(startDate.getDate() + 30);
        break;
      case "3months":
        endDate.setMonth(startDate.getMonth() + 3);
        break;
      case "6months":
        endDate.setMonth(startDate.getMonth() + 6);
        break;
      case "1year":
        endDate.setFullYear(startDate.getFullYear() + 1);
        break;
    }

    // Create a unique key for this load operation
    const loadKey = `${anchorDate.toISOString()}-${selectedRange}`;

    // Skip if we already loaded this exact range
    if (lastLoadParamsRef.current === loadKey) {
      return;
    }

    // Generate list of months to load
    const monthsToLoad: string[] = [];
    const current = new Date(startDate);
    while (current <= endDate) {
      const monthKey = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, "0")}`;
      if (
        availableMonthsRef.current.includes(monthKey) &&
        !loadingMonthsRef.current.has(monthKey)
      ) {
        monthsToLoad.push(monthKey);
      }
      current.setMonth(current.getMonth() + 1);
    }

    // Load all needed months
    if (monthsToLoad.length > 0) {
      setIsLoading(true);

      // Mark months as loading
      monthsToLoad.forEach((month) => loadingMonthsRef.current.add(month));

      try {
        // Load months in batches to prevent overwhelming the system
        const batchSize = 3;
        for (let i = 0; i < monthsToLoad.length; i += batchSize) {
          const batch = monthsToLoad.slice(i, i + batchSize);
          await Promise.all(batch.map((month) => loadMonthData(month)));
        }

        // Mark this load as complete
        lastLoadParamsRef.current = loadKey;
      } catch (error) {
        console.error("Error loading months:", error);
      } finally {
        setIsLoading(false);
      }
    } else {
      // No new months to load, just update the load key
      lastLoadParamsRef.current = loadKey;
    }
  }, [selectedRange, anchorDate, loadMonthData, isLoading]);

  useEffect(() => {
    loadRangeMonths();
  }, [loadRangeMonths]);

  // Convert DemoData to DailyData format
  const convertToDailyData = useCallback((data: DemoData[]): DailyData[] => {
    return data.map((item) => ({
      _id: item.date,
      _creationTime: new Date(item.date).getTime(),
      userId: item.userId,
      date: item.date,
      flow: item.flow,
      mood: item.mood,
      energy: item.energy,
      sleep: item.sleep,
      symptoms: item.symptoms,
      notes: item.notes,
      isPeriod: item.isPeriod,
    }));
  }, []);

  // Aggregate daily data by week for cleaner visualization
  const aggregateByWeek = useCallback((dailyData: DailyData[]): DailyData[] => {
    const weekGroups: { [key: string]: DailyData[] } = {};

    // Group data by week
    dailyData.forEach((data) => {
      const date = new Date(data.date);
      // Get week number (ISO week)
      const weekStart = new Date(date);
      weekStart.setDate(date.getDate() - date.getDay()); // Start of week (Sunday)
      const weekKey = weekStart.toISOString().split("T")[0];

      if (!weekGroups[weekKey]) {
        weekGroups[weekKey] = [];
      }
      weekGroups[weekKey].push(data);
    });

    // Calculate weekly aggregates
    return Object.entries(weekGroups)
      .map(([weekKey, dataPoints]) => {
        const weekDate = new Date(weekKey);
        // Use mid-week date for visualization (Wednesday)
        weekDate.setDate(weekDate.getDate() + 3);

        // Calculate sleep average
        const sleepData = dataPoints.filter(
          (d) => d.sleep !== null && d.sleep !== undefined
        );
        const avgSleep =
          sleepData.length > 0
            ? sleepData.reduce((sum, d) => sum + (d.sleep || 0), 0) /
              sleepData.length
            : undefined;

        // Find most common mood
        const moods = dataPoints.filter((d) => d.mood).map((d) => d.mood!);
        const moodCounts = moods.reduce(
          (acc, mood) => {
            acc[mood] = (acc[mood] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );
        const mostCommonMood = Object.entries(moodCounts).sort(
          ([, a], [, b]) => b - a
        )[0]?.[0];

        // Find most common energy
        const energies = dataPoints
          .filter((d) => d.energy)
          .map((d) => d.energy!);
        const energyCounts = energies.reduce(
          (acc, energy) => {
            acc[energy] = (acc[energy] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );
        const mostCommonEnergy = Object.entries(energyCounts).sort(
          ([, a], [, b]) => b - a
        )[0]?.[0];

        // Find most common flow
        const flows = dataPoints
          .filter((d) => d.flow && d.flow !== "none")
          .map((d) => d.flow!);
        const flowCounts = flows.reduce(
          (acc, flow) => {
            acc[flow] = (acc[flow] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );
        const mostCommonFlow = Object.entries(flowCounts).sort(
          ([, a], [, b]) => b - a
        )[0]?.[0];

        // Aggregate symptoms
        const allSymptoms = dataPoints.flatMap((d) => d.symptoms || []);
        const symptomCounts = allSymptoms.reduce(
          (acc, symptom) => {
            acc[symptom] = (acc[symptom] || 0) + 1;
            return acc;
          },
          {} as Record<string, number>
        );
        const topSymptoms = Object.entries(symptomCounts)
          .sort(([, a], [, b]) => b - a)
          .slice(0, 3)
          .map(([symptom]) => symptom);

        return {
          date: weekDate.toISOString().split("T")[0],
          flow: mostCommonFlow,
          mood: mostCommonMood,
          energy: mostCommonEnergy,
          sleep: avgSleep ? Math.round(avgSleep * 10) / 10 : undefined,
          symptoms: topSymptoms,
          notes: `Weekly average (${dataPoints.length} days)`,
        };
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, []);

  // Aggregate daily data by month for cleaner visualization
  const aggregateByMonth = useCallback(
    (dailyData: DailyData[]): DailyData[] => {
      const monthGroups: { [key: string]: DailyData[] } = {};

      // Group data by month
      dailyData.forEach((data) => {
        const date = new Date(data.date);
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;

        if (!monthGroups[monthKey]) {
          monthGroups[monthKey] = [];
        }
        monthGroups[monthKey].push(data);
      });

      // Calculate monthly aggregates
      return Object.entries(monthGroups)
        .map(([monthKey, dataPoints]) => {
          const [year, month] = monthKey.split("-");
          // Use mid-month date for visualization
          const monthDate = new Date(parseInt(year), parseInt(month) - 1, 15);

          // Calculate sleep average
          const sleepData = dataPoints.filter(
            (d) => d.sleep !== null && d.sleep !== undefined
          );
          const avgSleep =
            sleepData.length > 0
              ? sleepData.reduce((sum, d) => sum + (d.sleep || 0), 0) /
                sleepData.length
              : undefined;

          // Find most common mood
          const moods = dataPoints.filter((d) => d.mood).map((d) => d.mood!);
          const moodCounts = moods.reduce(
            (acc, mood) => {
              acc[mood] = (acc[mood] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>
          );
          const mostCommonMood = Object.entries(moodCounts).sort(
            ([, a], [, b]) => b - a
          )[0]?.[0];

          // Find most common energy
          const energies = dataPoints
            .filter((d) => d.energy)
            .map((d) => d.energy!);
          const energyCounts = energies.reduce(
            (acc, energy) => {
              acc[energy] = (acc[energy] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>
          );
          const mostCommonEnergy = Object.entries(energyCounts).sort(
            ([, a], [, b]) => b - a
          )[0]?.[0];

          // Find most common flow
          const flows = dataPoints
            .filter((d) => d.flow && d.flow !== "none")
            .map((d) => d.flow!);
          const flowCounts = flows.reduce(
            (acc, flow) => {
              acc[flow] = (acc[flow] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>
          );
          const mostCommonFlow = Object.entries(flowCounts).sort(
            ([, a], [, b]) => b - a
          )[0]?.[0];

          // Aggregate symptoms
          const allSymptoms = dataPoints.flatMap((d) => d.symptoms || []);
          const symptomCounts = allSymptoms.reduce(
            (acc, symptom) => {
              acc[symptom] = (acc[symptom] || 0) + 1;
              return acc;
            },
            {} as Record<string, number>
          );
          const topSymptoms = Object.entries(symptomCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 3)
            .map(([symptom]) => symptom);

          return {
            date: monthDate.toISOString().split("T")[0],
            flow: mostCommonFlow,
            mood: mostCommonMood,
            energy: mostCommonEnergy,
            sleep: avgSleep ? Math.round(avgSleep * 10) / 10 : undefined,
            symptoms: topSymptoms,
            notes: `Monthly average (${dataPoints.length} days)`,
          };
        })
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    },
    []
  );

  // Get data for selected time range (with lazy loading)
  // Filter to only show the selected user for each month
  const rangeData = useMemo(() => {
    if (!allDemoData || allDemoData.length === 0 || !anchorDate) return [];

    const startDate = new Date(anchorDate);
    const endDate = new Date(startDate);

    switch (selectedRange) {
      case "30days":
        endDate.setDate(startDate.getDate() + 30);
        break;
      case "3months":
        endDate.setMonth(startDate.getMonth() + 3);
        break;
      case "6months":
        endDate.setMonth(startDate.getMonth() + 6);
        break;
      case "1year":
        endDate.setFullYear(startDate.getFullYear() + 1);
        break;
    }

    // Filter by date range (data already pre-filtered to one user per month)
    const filteredData = allDemoData.filter((data) => {
      const dataDate = new Date(data.date);
      return dataDate >= startDate && dataDate <= endDate;
    });

    const dailyData = convertToDailyData(filteredData).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Aggregate data for longer time ranges to improve readability
    if (selectedRange === "6months") {
      return aggregateByWeek(dailyData); // Weekly averages for 6 months
    }

    if (selectedRange === "1year") {
      return aggregateByMonth(dailyData); // Monthly averages for 1 year
    }

    return dailyData;
  }, [
    allDemoData,
    selectedRange,
    anchorDate,
    convertToDailyData,
    aggregateByWeek,
    aggregateByMonth,
  ]);

  const hasAnyData = allDemoData && allDemoData.length > 0;

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
          `Your most common symptom is ${mostCommon[0].toLowerCase().replace(/_/g, " ")} (${mostCommon[1]} times)`
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
          Health Insights Demo
        </h1>
        {hasAnyData && rangeData.length > 0 && (
          <p className="text-sm sm:text-base text-gray-600">
            Based on {rangeData.length}{" "}
            {selectedRange === "1year"
              ? "months"
              : selectedRange === "6months"
                ? "weeks"
                : "days"}{" "}
            of sample tracking data
          </p>
        )}
      </div>

      {!hasAnyData ? (
        <div className="text-center py-8 sm:py-12">
          <div className="text-5xl sm:text-6xl mb-4">📊</div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
            No Demo Data Available
          </h3>
          <p className="text-sm sm:text-base text-gray-600 px-4">
            Unable to load demo data
          </p>
        </div>
      ) : (
        <div className="space-y-6 sm:space-y-8">
          {/* Time Range Selector */}
          <DemoTimeRangeSelector
            selectedRange={selectedRange}
            onRangeChange={setSelectedRange}
          />

          {/* Month/Year Selector */}
          {anchorDate && (
            <div className="flex justify-center">
              <div className="inline-flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-700 text-center">
                  Viewing data starting from:
                </label>
                <select
                  value={`${anchorDate.getFullYear()}-${String(anchorDate.getMonth() + 1).padStart(2, "0")}`}
                  onChange={(e) => {
                    const [year, month] = e.target.value.split("-");
                    const newDate = new Date(
                      parseInt(year),
                      parseInt(month) - 1,
                      1
                    );
                    setAnchorDate(newDate);
                  }}
                  className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-pink-400 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all text-sm font-medium text-gray-700"
                >
                  {availableMonths.map((monthKey) => {
                    const [year, month] = monthKey.split("-");
                    const date = new Date(parseInt(year), parseInt(month) - 1);
                    const monthName = date.toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    });
                    return (
                      <option key={monthKey} value={monthKey}>
                        {monthName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          )}

          {/* Aggregation Indicator */}
          {(selectedRange === "6months" || selectedRange === "1year") &&
            rangeData.length > 0 && (
              <div className="text-center">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 text-sm font-medium rounded-full border border-blue-200">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  {selectedRange === "6months"
                    ? `Showing weekly averages (${rangeData.length} weeks)`
                    : `Showing monthly averages (${rangeData.length} months)`}
                </span>
              </div>
            )}

          {rangeData.length === 0 ? (
            <div className="text-center py-8 sm:py-12">
              <div className="text-4xl sm:text-5xl mb-4">📅</div>
              <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
                No Data in This Period
              </h3>
              <p className="text-sm sm:text-base text-gray-600 px-4">
                Try selecting a different time range to see demo insights!
              </p>
            </div>
          ) : (
            <>
              {/* Charts */}
              <TrendsChart data={rangeData} />
              <SleepChart data={rangeData} />
              <SymptomsChart data={rangeData} />
              <CycleOverview data={rangeData} />

              {/* Personal Insights */}
              <PersonalInsights insights={insights} />
            </>
          )}
        </div>
      )}
    </div>
  );
}
