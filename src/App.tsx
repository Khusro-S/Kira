import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { useConvexAuth } from "convex/react";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import Auth from "./pages/Auth";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";
import ErrorPage from "./pages/ErrorPage";

function App() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={<LandingPage />}
          errorElement={<ErrorPage />}
        />
        <Route
          path="/auth"
          element={!isAuthenticated ? <Auth /> : <Navigate to="/dashboard" />}
          errorElement={<ErrorPage />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />}
          errorElement={<ErrorPage />}
        />
        <Route path="/demo" element={<Demo />} errorElement={<ErrorPage />} />
        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </>
    )
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100">
        <div className="text-center flex gap-4 items-center justify-center">
          <div className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent ">
            Kira
          </div>

          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
