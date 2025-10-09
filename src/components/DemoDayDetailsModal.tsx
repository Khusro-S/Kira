import { useEffect, useState } from "react";
import type { DemoData } from "../pages/Demo";

// Divider component
const Divider = () => <div className="border-t border-gray-200 my-6" />;



export default function DemoDayDetailsModal({
  date,
  onClose,
  onNavigate,
  demoData,
}: {
  date: Date;
  onClose: () => void;
  onNavigate?: (newDate: Date) => void;
  demoData: DemoData[];
}) {
  const [isVisible, setIsVisible] = useState(false);

  // Helper function to format date in local timezone (YYYY-MM-DD)
  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const dateString = formatDateString(date);

  // Get entry for this date (data already pre-filtered to one user per month)
  const dailyData = demoData.find((data) => data.date === dateString) || null;

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, 10);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(onClose, 200);
  };

  useEffect(() => {
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsVisible(false);
        setTimeout(onClose, 200);
      } else if (e.key === "ArrowLeft" && onNavigate) {
        e.preventDefault();
        const previousDay = new Date(date);
        previousDay.setDate(previousDay.getDate() - 1);
        onNavigate(previousDay);
      } else if (e.key === "ArrowRight" && onNavigate) {
        e.preventDefault();
        const nextDay = new Date(date);
        nextDay.setDate(nextDay.getDate() + 1);
        onNavigate(nextDay);
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [date, onNavigate, onClose]);

  useEffect(() => {
    const modalContent = document.querySelector(".modal-content");
    if (modalContent && modalContent.scrollTop > 0) {
      modalContent.scrollTo({ top: 0, behavior: "smooth" });
    }
    return;
  });

  return (
    <div
      className={`fixed inset-0 backdrop-blur-sm flex items-center justify-center z-50 transition-all duration-200 ${
        isVisible
          ? "bg-white/30 opacity-100 scale-100"
          : "bg-white/0 opacity-0 scale-0"
      }`}
      onClick={handleClose}
    >
      <div
        className="bg-white border border-solid border-gray-300 shadow-2xl rounded-2xl px-5 py-4 max-w-2xl w-full mx-4 max-h-[92vh] overflow-y-auto modal-content transition-all duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center">
          {/* Navigation Controls */}
          {onNavigate && (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  const previousDay = new Date(date);
                  previousDay.setDate(previousDay.getDate() - 1);
                  onNavigate(previousDay);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-600 hover:text-gray-800"
                title="Previous day (←)"
              >
                <svg
                  className="w-5 h-5"
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
              </button>
              <button
                onClick={() => {
                  const nextDay = new Date(date);
                  nextDay.setDate(nextDay.getDate() + 1);
                  onNavigate(nextDay);
                }}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-600 hover:text-gray-800"
                title="Next day (→)"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </button>
            </div>
          )}

          {/* Date Title */}
          <div className="flex-1 text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {date.toLocaleDateString("en-US", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </h3>
          </div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-600 hover:text-gray-800"
            title="Close (Esc)"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Navigation hint */}
        {onNavigate && (
          <div className="text-center">
            <p className="text-xs text-gray-500 my-2">
              Use &larr; &rarr; arrows or buttons above to navigate between days
            </p>
          </div>
        )}

        {/* Demo Mode Banner */}
        <div className="my-4 bg-purple-50 border border-purple-200 rounded-lg p-3">
          <p className="text-sm text-purple-700 text-center">
            📖 <strong>Demo Mode:</strong> This is sample data from one user.
            Sign up to track your own cycle!
          </p>
        </div>
        <div className="space-y-6">
          {/* Flow */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 flex items-center justify-center">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              </div>
              <h4 className="text-lg font-medium text-gray-900">
                Menstrual Flow
              </h4>
            </div>
            {dailyData?.flow ? (
              <div className="grid grid-cols-4 gap-3">
                {["light", "medium", "heavy", "none"].map((level) => (
                  <div
                    key={level}
                    className={`p-4 rounded-xl border transition-all ${
                      dailyData.flow === level
                        ? "border-gray-400 bg-gray-900 text-white"
                        : "border-gray-200 bg-white opacity-40"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      {level !== "none" && (
                        <div
                          className={`w-3 h-3 rounded-full ${
                            level === "light"
                              ? "bg-pink-200"
                              : level === "medium"
                                ? "bg-pink-400"
                                : "bg-red-500"
                          }`}
                        ></div>
                      )}
                      <span className="text-sm font-medium capitalize">
                        {level}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No data recorded</p>
            )}
          </div>

          <Divider />
          {/* Mood */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 flex items-center justify-center">💗</div>
              <h4 className="text-lg font-medium text-gray-900">Mood</h4>
            </div>
            {dailyData?.mood ? (
              <div className="grid grid-cols-5 gap-3">
                {[
                  { value: "great", emoji: "😊", label: "Great" },
                  { value: "good", emoji: "🙂", label: "Good" },
                  { value: "okay", emoji: "😐", label: "Okay" },
                  { value: "low", emoji: "😔", label: "Low" },
                  { value: "irritable", emoji: "😤", label: "Irritable" },
                ].map((moodOption) => (
                  <div
                    key={moodOption.value}
                    className={`p-4 rounded-xl border transition-all ${
                      dailyData.mood === moodOption.value
                        ? "border-gray-400 bg-gray-900 text-white"
                        : "border-gray-200 bg-white opacity-40"
                    }`}
                  >
                    <div className="flex flex-col items-center space-y-2">
                      <span className="text-2xl">{moodOption.emoji}</span>
                      <span className="text-sm font-medium">
                        {moodOption.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No data recorded</p>
            )}
          </div>

          <Divider />
          {/* Energy */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 flex items-center justify-center">⚡</div>
              <h4 className="text-lg font-medium text-gray-900">
                Energy Level
              </h4>
            </div>
            {dailyData?.energy ? (
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: "high", color: "bg-green-500", label: "High" },
                  {
                    value: "medium",
                    color: "bg-yellow-500",
                    label: "Medium",
                  },
                  { value: "low", color: "bg-red-500", label: "Low" },
                ].map((energyOption) => (
                  <div
                    key={energyOption.value}
                    className={`p-4 rounded-xl border transition-all ${
                      dailyData.energy === energyOption.value
                        ? "border-gray-400 bg-gray-900 text-white"
                        : "border-gray-200 bg-white opacity-40"
                    }`}
                  >
                    <div className="flex items-center justify-center space-x-2">
                      <div
                        className={`w-3 h-3 ${energyOption.color} rounded-full`}
                      ></div>
                      <span className="text-sm font-medium">
                        {energyOption.label}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No data recorded</p>
            )}
          </div>

          <Divider />
          {/* Sleep */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 flex items-center justify-center">🌙</div>
              <h4 className="text-lg font-medium text-gray-900">Sleep</h4>
            </div>
            {dailyData?.sleep !== undefined ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {dailyData.sleep} hours
                  </span>
                </div>
                <div className="relative pt-1">
                  <div className="flex mb-2 items-center justify-between">
                    <div className="text-xs text-gray-600">0h</div>
                    <div className="text-xs text-gray-600">12h</div>
                  </div>
                  <div className="overflow-hidden h-2 text-xs flex rounded-full bg-gray-200">
                    <div
                      style={{
                        width: `${((dailyData.sleep || 0) / 12) * 100}%`,
                      }}
                      className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-gray-900"
                    ></div>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No data recorded</p>
            )}
          </div>

          <Divider />
          {/* Symptoms */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 flex items-center justify-center">🩹</div>
              <h4 className="text-lg font-medium text-gray-900">Symptoms</h4>
            </div>
            {dailyData?.symptoms && dailyData.symptoms.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {dailyData.symptoms.map((symptom) => (
                  <span
                    key={symptom}
                    className="px-4 py-2 bg-gray-900 text-white rounded-full text-sm font-medium capitalize"
                  >
                    {symptom.replace(/_/g, " ")}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No symptoms recorded
              </p>
            )}
          </div>

          <Divider />
          {/* Notes */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-6 h-6 flex items-center justify-center">📝</div>
              <h4 className="text-lg font-medium text-gray-900">Notes</h4>
            </div>
            {dailyData?.notes ? (
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {dailyData.notes}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No notes recorded</p>
            )}
          </div>
        </div>
        {/* Close Button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleClose}
            className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
