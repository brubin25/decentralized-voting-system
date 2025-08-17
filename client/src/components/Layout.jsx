// src/components/Layout.jsx
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login", { replace: true });
  };

  return (
    <div>
      <header className="flex justify-between items-center p-4 bg-gray-100 shadow">
        <div>
          <Link to="/index" className="mr-4 text-blue-600">
            Index
          </Link>
          <Link to="/admin" className="text-blue-600">
            Admin
          </Link>
        </div>
        {user?.isAuthenticated && (
          <div>
            <span className="mr-4">Logged in as: {user.role}</span>
            <button
              onClick={handleLogout}
              className="px-3 py-1 bg-red-500 text-white rounded"
            >
              Logout
            </button>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}
