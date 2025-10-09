import type { TimeRange } from "./utils/scoreHelpers";

interface DemoTimeRangeSelectorProps {
  selectedRange: TimeRange;
  onRangeChange: (range: TimeRange) => void;
}

export default function DemoTimeRangeSelector({
  selectedRange,
  onRangeChange,
}: DemoTimeRangeSelectorProps) {
  const ranges: {
    key: TimeRange;
    label: string;
    shortLabel: string;
    description: string;
  }[] = [
    {
      key: "30days",
      label: "Next 30 Days",
      shortLabel: "30D",
      description: "~1 cycle",
    },
    {
      key: "3months",
      label: "Next 3 Months",
      shortLabel: "3M",
      description: "2-3 cycles",
    },
    {
      key: "6months",
      label: "Next 6 Months",
      shortLabel: "6M",
      description: "4-6 cycles",
    },
    {
      key: "1year",
      label: "Next Year",
      shortLabel: "1Y",
      description: "10+ cycles",
    },
  ];

  return (
    <div className="bg-white rounded-xl p-3 sm:p-4 shadow-sm border border-gray-200 mb-6">
      {/* Mobile: Horizontal scroll */}
      <div className="flex sm:hidden gap-2 overflow-x-auto pb-2">
        {ranges.map((range) => (
          <button
            key={range.key}
            onClick={() => onRangeChange(range.key)}
            className={`flex-shrink-0 flex-grow-1 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 min-w-[80px] ${
              selectedRange === range.key
                ? "bg-pink-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 active:bg-gray-200"
            }`}
          >
            <div className="text-center">
              <div className="font-semibold">{range.shortLabel}</div>
              <div
                className={`text-xs ${
                  selectedRange === range.key
                    ? "text-pink-100"
                    : "text-gray-500"
                }`}
              >
                {range.description}
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Desktop: Flex wrap */}
      <div className="hidden sm:flex flex-wrap gap-2">
        {ranges.map((range) => (
          <button
            key={range.key}
            onClick={() => onRangeChange(range.key)}
            className={`flex-grow-1 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 group ${
              selectedRange === range.key
                ? "bg-pink-500 text-white shadow-lg"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:text-pink-500"
            }`}
          >
            <div className="text-center">
              <div>{range.label}</div>
              <div
                className={`text-xs  ${
                  selectedRange === range.key
                    ? "text-pink-100"
                    : "text-gray-500 group-hover:text-pink-500"
                }`}
              >
                {range.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
