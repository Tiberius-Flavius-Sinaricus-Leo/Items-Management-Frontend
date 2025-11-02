import { useEffect } from "react";
import { createBrowserRouter, Navigate, Outlet, useLocation } from "react-router-dom";
import useAuthStore from "./store/AuthStore";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import CategoryManagement from "./pages/CategoryManagement";
import Navbar from "./components/Navbar";
import ItemManagement from "./pages/ItemManagement";
import UserManagement from "./pages/UserManagement";

function ProtectedRoute() {
  const location = useLocation();
  const { checkAuth, isAuthenticated, loading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading) return <div style={{ textAlign: "center", justifyContent: "center" }}>Loading...</div>;
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace state={{ from: location }} />;
}

const AppRouter = createBrowserRouter([
  { path: "/login", element: <Login /> },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: (<>
          <Navbar />
          <Outlet />
        </>),
        children: [
          { path: "/", element: <Dashboard /> },
          { path: "/explore", element: <Explore /> },
          { path: "/categories", element: <CategoryManagement /> },
          { path: "/items", element: <ItemManagement /> },
          { path: "/users", element: <UserManagement /> },
        ],
      },
    ],
  },
]);

export default AppRouter;