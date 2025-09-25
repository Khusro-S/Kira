import { Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useAuth } from "@clerk/clerk-react";
import "../animations.css";

export default function LandingPage() {
  const { isLoaded } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="font-bold text-2xl text-pink-500">Kira</span>
          </div>
          <nav className="min-w-[120px] flex justify-end">
            <SignedIn>
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-12 h-12 shadow-lg",
                    userButtonPopoverCard:
                      "bg-white shadow-2xl border-0 rounded-2xl",
                    userButtonPopoverActions: "text-gray-600",
                    userButtonPopoverActionButton:
                      "text-gray-700 hover:text-pink-600 hover:bg-pink-50 rounded-lg transition-colors",
                    userButtonPopoverFooter: "border-t border-gray-100",
                    userButtonPopoverActionButtonText: "font-medium",
                    userButtonPopoverActionButtonIcon: "text-gray-400",
                    userPreviewMainIdentifier: "text-gray-900 font-semibold",
                    userPreviewSecondaryIdentifier: "text-gray-500",
                  },
                  variables: {
                    colorPrimary: "#ec4899", // pink-500
                    colorBackground: "#ffffff",
                    colorText: "#374151", // gray-700
                    colorTextSecondary: "#6b7280", // gray-500
                    borderRadius: "1rem", // rounded-2xl
                  },
                }}
              />
            </SignedIn>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <main className="px-6 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Track Your Cycle,
            <span className="text-pink-500"> Understand Your Body</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Empower yourself with insights about your menstrual cycle. Make
            informed decisions about your health, lifestyle, and wellbeing.
          </p>

          <div className="min-h-[72px] flex items-center justify-center">
            {!isLoaded ? (
              <div className="w-56 h-16 bg-pink-300 rounded-lg animate-pulse"></div>
            ) : (
              <div className="animate-fade-in">
                <SignedOut>
                  <Link
                    to="/auth"
                    className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Start Tracking Today
                  </Link>
                </SignedOut>

                <SignedIn>
                  <Link
                    to="/dashboard"
                    className="inline-block bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Go to Dashboard
                  </Link>
                </SignedIn>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section className="px-6 py-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why Choose Kira?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-pink-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Pattern Recognition
              </h3>
              <p className="text-gray-600">
                Identify trends and patterns in your cycle to better understand
                your body's natural rhythm.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-purple-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Smart Predictions
              </h3>
              <p className="text-gray-600">
                Get accurate predictions for your next period and fertile
                windows based on your personal data.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-indigo-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Privacy First
              </h3>
              <p className="text-gray-600">
                Your health data is completely private and secure. We never
                share your personal information.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="px-6 py-16 bg-gradient-to-r from-pink-400 to-purple-400">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-pink-100 text-lg mb-8">
            Join thousands of women who trust Kira to track their cycles and
            make informed health decisions.
          </p>

          <div className="min-h-[72px] flex items-center justify-center">
            {!isLoaded ? (
              <div className="w-48 h-16 bg-white bg-opacity-20 rounded-lg animate-pulse"></div>
            ) : (
              <div className="animate-fade-in">
                <SignedOut>
                  <Link
                    to="/auth"
                    className="inline-block bg-white text-pink-600 font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 shadow-lg hover:bg-gray-50 hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Get Started
                  </Link>
                </SignedOut>

                <SignedIn>
                  <Link
                    to="/dashboard"
                    className="inline-block bg-white text-pink-600 font-semibold px-8 py-4 rounded-lg text-lg transition-all duration-300 shadow-lg hover:bg-gray-50 hover:shadow-xl transform hover:-translate-y-0.5"
                  >
                    Continue to Dashboard
                  </Link>
                </SignedIn>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <span className="font-bold text-lg text-pink-500">Kira</span>
          </div>
          <p className="text-gray-400">
            Empowering women through cycle awareness and health insights.
          </p>
        </div>
      </footer>
    </div>
  );
}
