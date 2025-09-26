interface PersonalInsightsProps {
  insights: string[];
}

export default function PersonalInsights({ insights }: PersonalInsightsProps) {
  if (insights.length === 0) return null;

  return (
    <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl p-4 sm:p-6 border border-pink-200">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
        💡 Your Personal Insights
      </h2>
      <div className="space-y-2 sm:space-y-3">
        {insights.map((insight, index) => (
          <div key={index} className="flex items-start space-x-2 sm:space-x-3">
            <div className="flex-shrink-0 w-2 h-2 bg-pink-400 rounded-full mt-1.5 sm:mt-2"></div>
            <p className="text-sm sm:text-base text-gray-700">{insight}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-white rounded-lg border border-pink-200">
        <h3 className="text-sm sm:text-base font-medium text-gray-900 mb-2">
          💡 Health Tips
        </h3>
        <p className="text-xs sm:text-sm text-gray-600">
          Keep tracking consistently to get more personalized insights! Regular
          sleep, exercise, and stress management can help with menstrual
          symptoms.
        </p>
      </div>
    </div>
  );
}
