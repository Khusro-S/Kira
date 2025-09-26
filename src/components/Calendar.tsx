import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function Calendar({
  selectedDate,
  setSelectedDate,
  currentMonth,
  setCurrentMonth,
}: {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
}) {
  // Get daily tracking data
  const dailyTrackingData = useQuery(api.cycles.getUserDailyTracking);

  const today = new Date();
  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  );
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const days = [];
  const currentDate = new Date(startDate);

  // Generate 42 days (6 weeks)
  for (let i = 0; i < 42; i++) {
    days.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  const isPeriodDay = (date: Date) => {
    const data = getTrackingDataForDate(date);
    return data && data.flow && data.flow !== "none";
  };

  // Helper function to format date in local timezone (YYYY-MM-DD)
  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const getTrackingDataForDate = (date: Date) => {
    if (!dailyTrackingData) return null;
    const dateString = formatDateString(date);
    return dailyTrackingData.find((data) => data.date === dateString);
  };

  const hasTrackingData = (date: Date) => {
    const data = getTrackingDataForDate(date);
    return (
      data &&
      (data.mood ||
        data.energy ||
        data.sleep ||
        data.symptoms?.length ||
        data.notes)
    );
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === currentMonth.getMonth();
  };

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const navigateMonth = (direction: "prev" | "next") => {
    const newMonth = new Date(currentMonth);
    if (direction === "prev") {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth("prev")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ←
        </button>
        <h2 className="text-xl font-semibold text-gray-900">
          {currentMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button
          onClick={() => navigateMonth("next")}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          →
        </button>
      </div>

      {/* Days of Week Header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-2 text-center text-sm font-medium text-gray-500"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-2">
        {days.map((date, index) => {
          const periodDay = isPeriodDay(date);
          const currentMonthDay = isCurrentMonth(date);
          const todayDay = isToday(date);
          const hasData = hasTrackingData(date);
          // const trackingData = getTrackingDataForDate(date);

          return (
            <button
              key={index}
              onClick={() => setSelectedDate(date)}
              className={`
                p-3 rounded-lg text-sm font-medium transition-all duration-200 relative
                ${currentMonthDay ? "text-gray-900" : "text-gray-300"}
                ${todayDay ? "ring-2 ring-green-300" : ""}
                ${periodDay ? "bg-pink-100 text-pink-700 font-bold" : hasData ? "bg-blue-50" : "hover:bg-gray-50"}
                ${selectedDate?.toDateString() === date.toDateString() ? "bg-pink-200" : ""}
              `}
            >
              <div className="relative">
                {date.getDate()}

                {/* Indicators */}
                {/* <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 flex space-x-0.5">
                  {trackingData?.mood && (
                    <div className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></div>
                  )}
                  {trackingData?.energy && (
                    <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                  )}
                  {trackingData?.sleep && (
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                  )}
                  {trackingData?.symptoms &&
                    trackingData.symptoms.length > 0 && (
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                    )}
                  {trackingData?.notes && trackingData.notes.trim() !== "" && (
                    <div className="w-1.5 h-1.5 bg-gray-500 rounded-full"></div>
                  )}
                </div> */}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
