import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
// import { useQuery } from "convex/react";
// import { api } from "../../convex/_generated/api";
import { useState } from "react";
import InsightsView from "../components/InsightsView";
import CalendarView from "../components/CalendarView";

export default function Dashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<"calendar" | "insights">(
    "calendar"
  );

  // This query will automatically be authenticated and only return this user's data
  // const cycles = useQuery(api.cycles.getUserCycles);

  return (
    <>
      <SignedIn>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
          {/* Header */}
          <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
              <div className="flex items-center space-x-4">
                {/* <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">K</span>
                </div> */}
                <h1 className="text-xl font-bold text-gray-900">
                  Welcome, {user?.firstName || "User"}!
                </h1>
              </div>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-10 h-10",
                    userButtonPopoverCard: "rounded-2xl shadow-2xl border-0",
                    userButtonPopoverActionButton: "hover:bg-pink-50",
                  },
                  variables: {
                    colorPrimary: "#ec4899",
                  },
                }}
              />
            </div>
          </header>

          {/* Main Dashboard Content */}
          <main className="max-w-7xl mx-auto px-6 py-4">
            <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Your Kira Dashboard
                </h2>
                <p className="text-gray-600">
                  Track your cycle, understand your patterns, make informed
                  decisions.
                </p>
              </div>
              {/* Tab Navigation */}
              <div>
                <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                  <button
                    onClick={() => setActiveTab("calendar")}
                    className={`max-md:flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeTab === "calendar"
                        ? "bg-white text-pink-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    📅 Calendar
                  </button>
                  <button
                    onClick={() => setActiveTab("insights")}
                    className={`max-md:flex-1 px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                      activeTab === "insights"
                        ? "bg-white text-pink-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    📊 Insights
                  </button>
                </div>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === "calendar" ? <CalendarView /> : <InsightsView />}
          </main>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center max-w-md">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Access Denied
            </h2>
            <p className="text-gray-600 mb-6">
              Please sign in to access your dashboard.
            </p>
            <Link
              to="/auth"
              className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </SignedOut>
      {/* <Content /> */}
    </>
  );
}







// function Content() {
//   const messages = useQuery(api.messages.getForCurrentUser);
//   return <div>Authenticated content: {messages?.length}</div>;
// }
