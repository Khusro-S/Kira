import { useState } from "react";

import DayDetailsModal from "./DayDetailsModal";
import Calendar from "./Calendar";

export default function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Check if the current month is different from today's month
  const today = new Date();
  const isCurrentMonth =
    currentMonth.getMonth() === today.getMonth() &&
    currentMonth.getFullYear() === today.getFullYear();

  const goToToday = () => {
    setCurrentMonth(new Date());
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-ls font-semibold text-gray-900">Calendar View</h3>

          <button
            onClick={goToToday}
            className={` items-center space-x-2 px-2 py-2 bg-pink-500 text-white text-xs font-bold rounded-lg transition-all duration-200 transform shadow-sm hover:scale-105 ${!isCurrentMonth ? "flex" : "opacity-0 pointer-events-none"}`}
            disabled={isCurrentMonth}
          >
            <span>Today</span>
          </button>
        </div>
        <p className="text-gray-600 mb-4">
          Click on any day to track period, mood, energy, sleep, and symptoms
        </p>

        {/* Legend */}
        {/* <div className="flex flex-wrap gap-4 text-xs text-gray-600">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-pink-500 rounded-full"></div>
            <span>Period</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Flow</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Mood</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Energy</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>Sleep</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span>Symptoms</span>
          </div>
        </div> */}
      </div>

      <Calendar
        selectedDate={selectedDate}
        setSelectedDate={setSelectedDate}
        currentMonth={currentMonth}
        setCurrentMonth={setCurrentMonth}
      />

      {selectedDate && (
        <DayDetailsModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
          onNavigate={(newDate: Date) => setSelectedDate(newDate)}
        />
      )}
    </div>
  );
}
