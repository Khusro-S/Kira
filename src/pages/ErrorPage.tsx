import { Link } from "react-router-dom";

interface ErrorPageProps {
  error?: Error;
}

export default function ErrorPage({ error }: ErrorPageProps) {
  return (
    <div className="h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex flex-col justify-between">
      <div className="h-full flex items-center justify-center px-4">
        <div className="max-w-lg w-full text-center">
          {/* Error Illustration */}
          <div className="mb-8">
            <div className="text-6xl md:text-8xl mb-6">⚠️</div>
            <div className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-red-400 to-pink-600 bg-clip-text text-transparent mb-4">
              Oops!
            </div>
          </div>

          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h1>
            <p className="text-base md:text-lg text-gray-600 mb-4">
              We're sorry, but something unexpected happened.
            </p>

            {/* Show error details in development */}
            {error && import.meta.env.DEV && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4 text-left">
                <p className="text-sm font-semibold text-red-800 mb-2">
                  Error Details (Development Mode):
                </p>
                <p className="text-sm text-red-700 break-all">
                  {error.message}
                </p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
            <button
              onClick={() => window.location.reload()}
              className="inline-block w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Try Again
            </button>

            <Link
              to="/"
              className="inline-block w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-8 rounded-xl transition-all duration-200 border border-gray-200 shadow-sm"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
      {/* Footer */}

      <div className="w-full max-sm:flex-col flex items-center justify-center space-x-2 my-4 text-center">
        <span className="font-bold text-lg bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
          Kira
        </span>
        <div className="max-sm:hidden h-4 w-px bg-gray-300"></div>
        <p className="text-gray-400">
          Empowering women through cycle awareness and health insights.
        </p>
      </div>
    </div>
  );
}
