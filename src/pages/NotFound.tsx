import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex flex-col items-center justify-between px-4">
      <div className="h-full flex flex-col items-center justify-center px-4 max-w-lg w-full text-center">
        {/* 404 Illustration */}
        <div className="">
          <div className="text-9xl font-bold bg-gradient-to-r from-pink-400 to-purple-600 bg-clip-text text-transparent mb-4">
            404
          </div>
          <div className="text-6xl mb-6">🌸</div>
        </div>

        {/* Error Message */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-2">
            Oops! The page you're looking for doesn't exist.
          </p>
          <p className="text-gray-500">
            It might have been moved, deleted, or you entered the wrong URL.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center">
          <Link
            to="/"
            className="inline-block w-full sm:w-auto bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            Go Home
          </Link>

          <button
            onClick={() => window.history.back()}
            className="inline-block w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-8 rounded-xl transition-all duration-200 border border-gray-200 shadow-sm"
          >
            Go Back
          </button>
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
