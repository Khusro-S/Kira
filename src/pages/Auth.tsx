import { SignedIn, SignedOut, SignInButton } from "@clerk/clerk-react";
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function SignedInRedirect() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/dashboard");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
      <div className="mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back!</h2>
        <p className="text-gray-600 mb-4">
          You're successfully signed in to your Kira account
        </p>
        <p className="text-sm text-pink-600 font-medium">
          Redirecting to dashboard in {countdown} second
          {countdown !== 1 ? "s" : ""}...
        </p>
      </div>
    </div>
  );
}

export default function Auth() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50">
      {/* Header */}
      <header className="px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            {/* <div className="w-8 h-8 bg-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div> */}
            <span className="font-bold text-2xl text-pink-500">Kira</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-6 py-16">
        <div className="max-w-md mx-auto">
          <SignedOut>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-2xl">K</span>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  Welcome to Kira
                </h2>
                <p className="text-gray-600 mb-6">
                  Ready to start tracking your cycle? Sign in or create your
                  account below.
                </p>
              </div>

              <div className="mb-6">
                <SignInButton
                  mode="modal"
                  forceRedirectUrl="/dashboard"
                  appearance={{
                    elements: {
                      modalContent: "bg-white rounded-2xl shadow-2xl",
                      modalCloseButton: "text-gray-400 hover:text-gray-600",
                      card: "shadow-2xl border-0 rounded-2xl p-8",
                      headerTitle: "text-2xl font-bold text-gray-900",
                      headerSubtitle: "text-gray-600",
                      socialButtonsBlockButton:
                        "bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 rounded-lg transition-colors",
                      socialButtonsBlockButtonText: "font-medium",
                      dividerLine: "bg-gray-200",
                      dividerText: "text-gray-500 text-sm",
                      formFieldLabel: "text-gray-700 font-medium",
                      formFieldInput:
                        "border border-gray-200 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-pink-500",
                      formButtonPrimary:
                        "bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200",
                      footerActionLink:
                        "text-pink-500 hover:text-pink-600 font-medium",
                      footer: "text-gray-600",
                      logoImage: "h-8 w-8",
                      identityPreviewText: "text-gray-600",
                      identityPreviewEditButton:
                        "text-pink-500 hover:text-pink-600",
                    },
                    variables: {
                      colorPrimary: "#ec4899", // pink-500
                      colorBackground: "#ffffff",
                      colorInputBackground: "#ffffff",
                      colorInputText: "#374151", // gray-700
                      colorText: "#374151", // gray-700
                      colorTextSecondary: "#6b7280", // gray-500
                      fontFamily: "system-ui, -apple-system, sans-serif",
                      borderRadius: "0.75rem", // rounded-xl
                    },
                    layout: {
                      logoPlacement: "none",
                      socialButtonsVariant: "blockButton",
                    },
                  }}
                >
                  <button className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Get Started
                  </button>
                </SignInButton>
              </div>

              <div></div>
              <div className="mt-6 pt-6 border-t border-gray-100">
                <div className="text-center">
                  <p className="text-xs text-gray-400 mb-3">Why choose Kira?</p>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 text-pink-500 mr-2 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Track your menstrual patterns
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 text-pink-500 mr-2 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Get personalized insights
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <svg
                        className="w-4 h-4 text-pink-500 mr-2 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Secure, private data storage
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </SignedOut>

          <SignedIn>
            <SignedInRedirect />
          </SignedIn>
        </div>
      </main>
    </div>
  );
}
