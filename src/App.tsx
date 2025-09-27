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

function App() {
  const { isLoading, isAuthenticated } = useConvexAuth();

  const router = createBrowserRouter(
    createRoutesFromElements(
      <>
        <Route
          path="/"
          element={<LandingPage />}
          errorElement={<div>Error</div>}
        />
        <Route
          path="/auth"
          element={!isAuthenticated ? <Auth /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated ? <Dashboard /> : <Navigate to="/auth" />}
        />
      </>
    )
  );

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-xl">Loading...</div>
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
