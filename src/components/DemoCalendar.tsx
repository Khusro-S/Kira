import type { DemoData } from "../pages/Demo";

interface DateRange {
  min: Date;
  max: Date;
}

export default function DemoCalendar({
  selectedDate,
  setSelectedDate,
  currentMonth,
  setCurrentMonth,
  demoData,
  dateRange,
}: {
  selectedDate: Date | null;
  setSelectedDate: (date: Date | null) => void;
  currentMonth: Date;
  setCurrentMonth: (date: Date) => void;
  demoData: DemoData[];
  dateRange: DateRange | null;
}) {
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
    const dateString = formatDateString(date);
    // Check if ANY user had a period on this day
    return demoData.some(
      (data) => data.date === dateString && data.flow && data.flow !== "none"
    );
  };

  // Helper function to format date in local timezone (YYYY-MM-DD)
  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const hasTrackingData = (date: Date) => {
    const dateString = formatDateString(date);
    // Check if there's ANY data for this date
    return demoData.some((data) => data.date === dateString);
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

    // Check if new month is within data range
    if (dateRange) {
      const newMonthStart = new Date(
        newMonth.getFullYear(),
        newMonth.getMonth(),
        1
      );
      const minMonthStart = new Date(
        dateRange.min.getFullYear(),
        dateRange.min.getMonth(),
        1
      );
      const maxMonthStart = new Date(
        dateRange.max.getFullYear(),
        dateRange.max.getMonth(),
        1
      );

      if (newMonthStart >= minMonthStart && newMonthStart <= maxMonthStart) {
        setCurrentMonth(newMonth);
      }
    } else {
      setCurrentMonth(newMonth);
    }
  };

  // Check if can navigate to prev/next month
  const canNavigatePrev = () => {
    if (!dateRange) return true;
    const prevMonth = new Date(currentMonth);
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthStart = new Date(
      prevMonth.getFullYear(),
      prevMonth.getMonth(),
      1
    );
    const minMonthStart = new Date(
      dateRange.min.getFullYear(),
      dateRange.min.getMonth(),
      1
    );
    return prevMonthStart >= minMonthStart;
  };

  const canNavigateNext = () => {
    if (!dateRange) return true;
    const nextMonth = new Date(currentMonth);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    const nextMonthStart = new Date(
      nextMonth.getFullYear(),
      nextMonth.getMonth(),
      1
    );
    const maxMonthStart = new Date(
      dateRange.max.getFullYear(),
      dateRange.max.getMonth(),
      1
    );
    return nextMonthStart <= maxMonthStart;
  };

  return (
    <div className="w-full">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigateMonth("prev")}
          disabled={!canNavigatePrev()}
          className={`p-2 rounded-lg transition-colors ${
            canNavigatePrev()
              ? "hover:bg-gray-100 cursor-pointer"
              : "opacity-30 cursor-not-allowed"
          }`}
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
          disabled={!canNavigateNext()}
          className={`p-2 rounded-lg transition-colors ${
            canNavigateNext()
              ? "hover:bg-gray-100 cursor-pointer"
              : "opacity-30 cursor-not-allowed"
          }`}
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
              <div className="relative">{date.getDate()}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
