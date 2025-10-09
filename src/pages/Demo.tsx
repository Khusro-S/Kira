import { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import DemoCalendarView from "../components/DemoCalendarView";
import DemoInsightsView from "../components/insights/DemoInsightsView";

export interface DemoData {
  userId: string;
  date: string;
  flow?: string;
  mood?: string;
  energy?: string;
  sleep?: number;
  symptoms?: string[];
  notes?: string;
  isPeriod: boolean;
  dayOfCycle: number;
}

export default function Demo() {
  const [activeTab, setActiveTab] = useState<"calendar" | "insights">(
    "calendar"
  );
  const [allDemoData, setAllDemoData] = useState<DemoData[]>([]);
  const [loading, setLoading] = useState(true);
  const [dataMetadata, setDataMetadata] = useState<{
    totalEntries: number;
    uniqueUsers: number;
    dateRange: { min: Date; max: Date } | null;
  }>({ totalEntries: 0, uniqueUsers: 0, dateRange: null });
  const [availableMonths, setAvailableMonths] = useState<string[]>([]);
  const [loadedMonths, setLoadedMonths] = useState<Set<string>>(new Set());
  const loadedMonthsRef = useRef<Set<string>>(new Set());

  // Load index file on mount to get metadata
  useEffect(() => {
    fetch("/data/monthly/index.json")
      .then((response) => response.json())
      .then((index) => {
        console.log(
          `📊 Loaded index with ${index.months.length} months available`
        );
        console.log(`📁 Lazy loading strategy: Load only months as needed`);
        console.log(`   - Calendar: Current + prev + next month (3 months)`);
        console.log(`   - Insights: Months within selected time range`);

        setAvailableMonths(index.months);
        setDataMetadata({
          totalEntries: index.totalEntries,
          uniqueUsers: index.uniqueUsers,
          dateRange: {
            min: new Date(index.dateRange.min),
            max: new Date(index.dateRange.max),
          },
        });

        setLoading(false);
      })
      .catch((error) => {
        console.error("Error loading index:", error);
        setLoading(false);
      });
  }, []);

  // Function to load a specific month's data
  const loadMonthData = useCallback(
    async (monthKey: string) => {
      if (loadedMonthsRef.current.has(monthKey)) {
        console.log(`📦 Month ${monthKey} already loaded (cached)`);
        return; // Already loaded
      }

      try {
        console.log(`🔄 Loading month ${monthKey}...`);
        const response = await fetch(`/data/monthly/${monthKey}.json`);
        const monthData: DemoData[] = await response.json();

        // Add to allDemoData (already filtered to one user per month)
        setAllDemoData((prev) => [...prev, ...monthData]);
        loadedMonthsRef.current.add(monthKey);
        setLoadedMonths((prev) => new Set(prev).add(monthKey));

        console.log(
          `✅ Loaded ${monthData.length} records for ${monthKey} (Total loaded: ${loadedMonthsRef.current.size}/${availableMonths.length} months)`
        );
      } catch (error) {
        console.error(`❌ Error loading month ${monthKey}:`, error);
      }
    },
    [availableMonths.length]
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading demo data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-pink-500 transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </Link>
            <h1 className="text-xl font-bold text-gray-900">
              <span className="font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                Demo Mode
              </span>
            </h1>
          </div>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3">
            <div className="px-3 py-1.5 sm:px-4 sm:py-2 bg-purple-100 text-purple-700 text-xs sm:text-sm font-medium rounded-full">
              Read-Only Demo
            </div>
            <Link
              to="/auth"
              className="w-full sm:w-auto text-center px-4 py-2 bg-pink-500 hover:bg-pink-600 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              Sign Up to Track Your Data
            </Link>
          </div>
        </div>
      </header>

      {/* Main Dashboard Content */}
      <main className="max-w-7xl mx-auto px-6 py-4">
        <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Interactive Demo
            </h2>
            <p className="text-gray-600">
              {dataMetadata.totalEntries > 0 ? (
                <>
                  Viewing <strong>one user per month</strong> across{" "}
                  <strong>
                    {loadedMonths.size} of {availableMonths.length} months
                    loaded
                  </strong>
                  . Full dataset contains{" "}
                  <strong>
                    {dataMetadata.totalEntries.toLocaleString()} entries
                  </strong>{" "}
                  from <strong>{dataMetadata.uniqueUsers} users</strong>. Sign
                  up to track your own cycle!
                </>
              ) : (
                "Explore the features with sample data. Sign up to track your own cycle!"
              )}
            </p>
          </div>
          {/* Tab Navigation */}
          <div>
            <div className="flex space-x-1 bg-gray-50 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("calendar")}
                className={`max-md:flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 flex gap-x-2 justify-center items-center ${
                  activeTab === "calendar"
                    ? "bg-pink-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-pink-500 hover:bg-gray-200"
                }`}
              >
                📅 Calendar
              </button>
              <button
                onClick={() => setActiveTab("insights")}
                className={`max-md:flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200  ${
                  activeTab === "insights"
                    ? "bg-pink-500 text-white shadow-sm"
                    : "text-gray-600 hover:text-pink-500 hover:bg-gray-200"
                }`}
              >
                📊 Insights
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === "calendar" ? (
          <DemoCalendarView
            allDemoData={allDemoData}
            dataMetadata={dataMetadata}
            loadMonthData={loadMonthData}
            availableMonths={availableMonths}
          />
        ) : (
          <DemoInsightsView
            allDemoData={allDemoData}
            dataMetadata={dataMetadata}
            loadMonthData={loadMonthData}
            availableMonths={availableMonths}
          />
        )}
      </main>
    </div>
  );
}
