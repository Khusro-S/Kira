import { useEffect, useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

// Custom CSS for slider
const sliderStyles = `
  .slider::-webkit-slider-thumb {
    appearance: none;
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #374151;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
  
  .slider::-moz-range-thumb {
    height: 20px;
    width: 20px;
    border-radius: 50%;
    background: #374151;
    cursor: pointer;
    border: 2px solid #ffffff;
    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  }
`;

export default function DayDetailsModal({
  date,
  onClose,
}: {
  date: Date;
  onClose: () => void;
}) {
  // Helper function to format date in local timezone (YYYY-MM-DD)
  const formatDateString = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  // Get today's tracking data
  const dateString = formatDateString(date);
  const dailyData = useQuery(api.cycles.getDailyTrackingByDate, {
    date: dateString,
  });
  const addDailyTracking = useMutation(api.cycles.addDailyTracking);
  const deleteDailyTracking = useMutation(api.cycles.deleteDailyTracking);

  // Form state
  const [flow, setFlow] = useState<
    "light" | "medium" | "heavy" | "none" | null
  >(null);
  const [mood, setMood] = useState<
    "great" | "good" | "okay" | "low" | "irritable" | null
  >(null);
  const [energy, setEnergy] = useState<"high" | "medium" | "low" | null>(null);
  const [sleep, setSleep] = useState<number>(7.5);
  const [symptoms, setSymptoms] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Check if there's existing data
  const hasExistingData =
    dailyData &&
    (dailyData.flow ||
      dailyData.mood ||
      dailyData.energy ||
      dailyData.sleep ||
      dailyData.symptoms?.length ||
      dailyData.notes);

  // Load existing data when available
  useEffect(() => {
    if (dailyData) {
      setFlow(dailyData.flow || null);
      setMood(dailyData.mood || null);
      setEnergy(dailyData.energy || null);
      setSleep(dailyData.sleep || 7.5);
      setSymptoms(dailyData.symptoms || []);
      setNotes(dailyData.notes || "");
    }
  }, [dailyData]);

  // Save daily tracking data
  const handleSave = async () => {
    try {
      setIsSaving(true);
      await addDailyTracking({
        date: dateString,
        flow: flow || undefined,
        mood: mood || undefined,
        energy: energy || undefined,
        sleep: sleep,
        symptoms: symptoms.length > 0 ? symptoms : undefined,
        notes: notes || undefined,
        isPeriod: flow && flow !== "none" ? true : undefined, // Period = any flow except 'none'
      });
    } catch (error) {
      console.error("Failed to save daily tracking:", error);
    } finally {
      setIsSaving(false);
      onClose();
    }
  };

  // Handle period logging
  // Lock scroll when modal is open
  useEffect(() => {
    // Prevent background scroll
    document.body.style.overflow = "hidden";

    // Handle escape key
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "unset";
      document.removeEventListener("keydown", handleEscape);
    };
  }, [onClose]);

  const handleDelete = async () => {
    if (!dailyData) return;

    setIsDeleting(true);
    try {
      // Properly delete the record from the database
      await deleteDailyTracking({
        date: dateString,
      });
      onClose();
    } catch (error) {
      console.error("Error deleting daily tracking:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      {/* Custom styles for slider */}
      <style>{sliderStyles}</style>

      <div
        className="fixed inset-0 bg-white/30 backdrop-blur-sm flex items-center justify-center z-50"
        onClick={onClose}
      >
        <div
          className="bg-white border border-solid border-black rounded-2xl p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {date.toLocaleDateString("en-US", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </h3>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 w-8 h-8 flex items-center justify-center rounded-full"
            >
              ✕
            </button>
          </div>

          <div className="space-y-8">
            {/* Menstrual Flow */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 flex items-center justify-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                </div>
                <h4 className="text-lg font-medium text-gray-900">
                  Menstrual Flow
                </h4>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <button
                  onClick={() => setFlow("light")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    flow === "light"
                      ? "border-pink-300 bg-pink-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-pink-200 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">
                      Light
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setFlow("medium")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    flow === "medium"
                      ? "border-pink-400 bg-pink-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-pink-400 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">
                      Medium
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setFlow("heavy")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    flow === "heavy"
                      ? "border-red-500 bg-red-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">
                      Heavy
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setFlow("none")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    flow === "none"
                      ? "border-gray-400 bg-gray-900 text-white"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <span
                      className={`text-sm font-medium ${flow === "none" ? "text-white" : "text-gray-900"}`}
                    >
                      None
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Mood */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 flex items-center justify-center">
                  💗
                </div>
                <h4 className="text-lg font-medium text-gray-900">Mood</h4>
              </div>
              <div className="grid grid-cols-5 gap-3">
                <button
                  onClick={() => setMood("great")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    mood === "great"
                      ? "border-gray-400 bg-gray-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-2xl">😊</span>
                    <span className="text-sm font-medium text-gray-900">
                      Great
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setMood("good")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    mood === "good"
                      ? "border-gray-400 bg-gray-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-2xl">🙂</span>
                    <span className="text-sm font-medium text-gray-900">
                      Good
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setMood("okay")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    mood === "okay"
                      ? "border-gray-400 bg-gray-900 text-white"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-2xl">😐</span>
                    <span
                      className={`text-sm font-medium ${mood === "okay" ? "text-white" : "text-gray-900"}`}
                    >
                      Okay
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setMood("low")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    mood === "low"
                      ? "border-gray-400 bg-gray-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-2xl">😔</span>
                    <span className="text-sm font-medium text-gray-900">
                      Low
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setMood("irritable")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    mood === "irritable"
                      ? "border-gray-400 bg-gray-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex flex-col items-center space-y-2">
                    <span className="text-2xl">😤</span>
                    <span className="text-sm font-medium text-gray-900">
                      Irritable
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Energy Level */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-6 h-6 flex items-center justify-center">
                  ⚡
                </div>
                <h4 className="text-lg font-medium text-gray-900">
                  Energy Level
                </h4>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <button
                  onClick={() => setEnergy("high")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    energy === "high"
                      ? "border-gray-400 bg-gray-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">
                      High
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setEnergy("medium")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    energy === "medium"
                      ? "border-gray-400 bg-gray-900 text-white"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span
                      className={`text-sm font-medium ${energy === "medium" ? "text-white" : "text-gray-900"}`}
                    >
                      Medium
                    </span>
                  </div>
                </button>
                <button
                  onClick={() => setEnergy("low")}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    energy === "low"
                      ? "border-gray-400 bg-gray-50"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-sm font-medium text-gray-900">
                      Low
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* Sleep Hours */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <div className="w-6 h-6 flex items-center justify-center">
                    🌙
                  </div>
                  <h4 className="text-lg font-medium text-gray-900">
                    Sleep Hours: {sleep}
                  </h4>
                </div>
              </div>
              <div className="relative">
                <input
                  type="range"
                  min="3"
                  max="12"
                  step="0.5"
                  value={sleep}
                  onChange={(e) => setSleep(Number(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  style={{
                    background: `linear-gradient(to right, #374151 0%, #374151 ${((sleep - 3) / 9) * 100}%, #e5e7eb ${((sleep - 3) / 9) * 100}%, #e5e7eb 100%)`,
                  }}
                />
                <div className="flex justify-between text-sm text-gray-500 mt-2">
                  <span>3h</span>
                  <span>12h</span>
                </div>
              </div>
            </div>

            {/* Symptoms */}
            {symptoms.length > 0 && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">
                  Selected Symptoms
                </h4>
                <div className="flex flex-wrap gap-2">
                  {symptoms.map((symptom) => (
                    <span
                      key={symptom}
                      className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm"
                    >
                      {symptom}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Notes */}
            {notes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-3">Notes</h4>
                <p className="text-gray-600 text-sm">{notes}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-6 border-t border-gray-200">
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 bg-gray-900 hover:bg-gray-800 disabled:opacity-50 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200"
              >
                {isSaving ? "Saving..." : "Save"}
              </button>
              {hasExistingData && (
                <button
                  onClick={handleDelete}
                  disabled={isDeleting}
                  className="px-6 py-3 border border-red-300 hover:bg-red-50 text-red-600 font-medium rounded-xl transition-all duration-200 disabled:opacity-50"
                >
                  {isDeleting ? "Deleting..." : "Delete"}
                </button>
              )}
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition-all duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
