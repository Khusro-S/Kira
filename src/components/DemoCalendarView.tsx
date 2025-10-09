import { useState, useEffect, useMemo } from "react";
import type { DemoData } from "../pages/Demo";
import DemoDayDetailsModal from "./DemoDayDetailsModal";
import DemoCalendar from "./DemoCalendar";

interface DataMetadata {
  totalEntries: number;
  uniqueUsers: number;
  dateRange: { min: Date; max: Date } | null;
}

interface DemoCalendarViewProps {
  allDemoData: DemoData[];
  dataMetadata: DataMetadata;
  loadMonthData: (monthKey: string) => Promise<void>;
  availableMonths: string[];
}

export default function DemoCalendarView({
  allDemoData,
  dataMetadata,
  loadMonthData,
  availableMonths,
}: DemoCalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // Initialize to first month with data, or null if not yet loaded
  const [currentMonth, setCurrentMonth] = useState<Date | null>(null);

  // Initialize to first month with data
  useEffect(() => {
    if (dataMetadata.dateRange && !currentMonth) {
      const firstDate = dataMetadata.dateRange.min;
      setCurrentMonth(
        new Date(firstDate.getFullYear(), firstDate.getMonth(), 1)
      );
    }
  }, [dataMetadata.dateRange, currentMonth]);

  // Load data for current month and adjacent months when month changes
  useEffect(() => {
    if (!currentMonth) return; // Wait for initialization

    const loadSurroundingMonths = async () => {
      const monthKey = `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`;

      // Load current month
      await loadMonthData(monthKey);

      // Load previous month (for calendar display)
      const prevMonth = new Date(currentMonth);
      prevMonth.setMonth(prevMonth.getMonth() - 1);
      const prevMonthKey = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, "0")}`;
      if (availableMonths.includes(prevMonthKey)) {
        await loadMonthData(prevMonthKey);
      }

      // Load next month (for calendar display)
      const nextMonth = new Date(currentMonth);
      nextMonth.setMonth(nextMonth.getMonth() + 1);
      const nextMonthKey = `${nextMonth.getFullYear()}-${String(nextMonth.getMonth() + 1).padStart(2, "0")}`;
      if (availableMonths.includes(nextMonthKey)) {
        await loadMonthData(nextMonthKey);
      }
    };

    loadSurroundingMonths();
  }, [currentMonth, loadMonthData, availableMonths]);

  // Load only data for current month (and adjacent months for smooth navigation)
  // Data is already pre-filtered to one user per month
  const currentMonthData = useMemo(() => {
    if (allDemoData.length === 0 || !currentMonth) return [];

    const startOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1
    );
    const endOfMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    );

    // Include a few days before and after for calendar display
    const startDate = new Date(startOfMonth);
    startDate.setDate(startDate.getDate() - 7);
    const endDate = new Date(endOfMonth);
    endDate.setDate(endDate.getDate() + 7);

    const startStr = startDate.toISOString().split("T")[0];
    const endStr = endDate.toISOString().split("T")[0];

    // Filter by date range (data already has one user per month)
    return allDemoData.filter((d) => {
      return d.date >= startStr && d.date <= endStr;
    });
  }, [allDemoData, currentMonth]);

  const goToFirstMonth = () => {
    if (dataMetadata.dateRange) {
      setCurrentMonth(
        new Date(
          dataMetadata.dateRange.min.getFullYear(),
          dataMetadata.dateRange.min.getMonth(),
          1
        )
      );
    }
  };

  // Check if current month is the first month with data
  const isFirstMonth =
    dataMetadata.dateRange &&
    currentMonth &&
    currentMonth.getMonth() === dataMetadata.dateRange.min.getMonth() &&
    currentMonth.getFullYear() === dataMetadata.dateRange.min.getFullYear();

  // Handle navigation in modal - load month if needed
  const handleModalNavigate = async (newDate: Date) => {
    const monthKey = `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}`;

    // Load the month data if it's not already loaded
    if (availableMonths.includes(monthKey)) {
      await loadMonthData(monthKey);
    }

    setSelectedDate(newDate);
  };

  // Handle month selector change
  const handleMonthSelectorChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const [year, month] = e.target.value.split("-");
    const newMonth = new Date(parseInt(year), parseInt(month) - 1, 1);
    setCurrentMonth(newMonth);
  };

  // Get current month value for selector (YYYY-MM format)
  const currentMonthValue = currentMonth
    ? `${currentMonth.getFullYear()}-${String(currentMonth.getMonth() + 1).padStart(2, "0")}`
    : "";

  // Format month for display (e.g., "January 1990")
  const formatMonthDisplay = (monthKey: string) => {
    const [year, month] = monthKey.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2 gap-3 flex-wrap">
          <h3 className="text-ls font-semibold text-gray-900">
            Calendar View (Demo)
          </h3>

          <div className="flex items-center gap-2">
            {/* Month Selector Dropdown */}
            {currentMonth && availableMonths.length > 0 && (
              <select
                value={currentMonthValue}
                onChange={handleMonthSelectorChange}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:border-pink-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-all cursor-pointer"
              >
                {availableMonths.map((monthKey) => (
                  <option key={monthKey} value={monthKey}>
                    {formatMonthDisplay(monthKey)}
                  </option>
                ))}
              </select>
            )}

            {/* First Month Button */}
            <button
              onClick={goToFirstMonth}
              className={` items-center space-x-2 px-2 py-2 bg-pink-500 text-white text-xs font-bold rounded-lg transition-all duration-200 transform shadow-sm hover:scale-105 ${!isFirstMonth && dataMetadata.dateRange ? "flex" : "opacity-0 pointer-events-none"}`}
              disabled={isFirstMonth || !dataMetadata.dateRange}
            >
              <span>First Month</span>
            </button>
          </div>
        </div>
        <p className="text-gray-600 mb-4">
          {dataMetadata.dateRange ? (
            <>
              Viewing <strong>one user's data per month</strong> from{" "}
              {dataMetadata.dateRange.min.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}{" "}
              -{" "}
              {dataMetadata.dateRange.max.toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
              . Dataset contains{" "}
              <strong>
                {dataMetadata.totalEntries.toLocaleString()} entries
              </strong>{" "}
              from <strong>{dataMetadata.uniqueUsers} users</strong> (read-only
              demo)
            </>
          ) : (
            "Loading demo data..."
          )}
        </p>
      </div>

      {currentMonth ? (
        <>
          <DemoCalendar
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            currentMonth={currentMonth}
            setCurrentMonth={setCurrentMonth}
            demoData={currentMonthData}
            dateRange={dataMetadata.dateRange}
          />

          {selectedDate && (
            <DemoDayDetailsModal
              date={selectedDate}
              onClose={() => setSelectedDate(null)}
              onNavigate={handleModalNavigate}
              demoData={allDemoData}
            />
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      )}
    </div>
  );
}
