import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { User, Settings, LogOut } from "lucide-react";

export default function NavBar() {
  const [user, setUser] = useState(null); // null = not logged in
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Load user from localStorage (replace with real backend fetch later)
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser)); // { name, avatar }
    } else {
      setUser(null);
    }

    // Close dropdown if clicked outside
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
    navigate("/login");
  };

  const defaultAvatar = "/default-avatar.png"; // place a default image in public/

  return (
    <nav className="w-full bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <img
            src="/jharkhand-logo.png"
            alt="Jharkhand Logo"
            className="w-10 h-10"
          />
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              JHARKHAND CIVIC PORTAL
            </h1>
            <p className="text-xs text-gray-500">
              Crowdsourced Issue Reporting System
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 relative" ref={menuRef}>
          <span className="text-sm text-gray-600 hidden sm:block">
            Government of Jharkhand
          </span>

          {!user ? (
            // 🔹 Before Login
            <>
              <NavLink
                to="/login"
                className="px-4 py-1 text-sm rounded border border-gray-300 hover:bg-gray-100"
              >
                Sign In
              </NavLink>

              <NavLink
                to="/signup"
                className="px-4 py-1 text-sm rounded bg-green-600 text-white hover:bg-green-700"
              >
                Register
              </NavLink>
            </>
          ) : (
            // 🔹 After Login
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 px-3 py-1 rounded hover:bg-gray-100"
              >
                <img
                  src={user.avatar || defaultAvatar}
                  alt="User Avatar"
                  className="w-9 h-9 rounded-full object-cover border border-gray-300"
                />
                <span className="hidden sm:inline text-sm font-medium text-gray-700">
                  {user.name?.split(" ")[0]}
                </span>
              </button>

              {menuOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white border rounded-lg shadow-lg z-50">
                  <NavLink
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </NavLink>
                  <NavLink
                    to="/settings"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </NavLink>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut className="w-4 h-4" />
                    Logout
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
