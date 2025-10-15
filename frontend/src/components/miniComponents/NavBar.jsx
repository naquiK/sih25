import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { User, Settings, LogOut, Trophy, LandPlot, LogIn } from "lucide-react";

export default function NavBar() {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Load user from localStorage
  const loadUser = () => {
    const token = localStorage.getItem("authToken");
    const storedUser = localStorage.getItem("user");

    if (token && storedUser) {
      setUser(JSON.parse(storedUser)); // { name, role, avatar }
    } else {
      setUser(null);
    }
  };

  useEffect(() => {
    loadUser();

    // ✅ Refresh when login/logout happens
    const handleStorage = () => loadUser();
    window.addEventListener("storage", handleStorage);

    // Close dropdown if clicked outside
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      window.removeEventListener("storage", handleStorage);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    setUser(null);
    setMenuOpen(false);
    window.dispatchEvent(new Event("storage")); // 🔄 force update
    navigate("/login");
  };

  const defaultAvatar = "/default-avatar.png";
  const getOptionLink = (role) => {
    switch (role) {
      case "citizen":
        return "/KnowYourSurroundings";
    }
  };
  return (
    <nav className="w-full bg-white border-b shadow-sm fixed top-0 z-50"> {/* Fixed NavBar */}
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3">
        {/* Left: Logo + Title */}
        <div className="flex items-center gap-3">
          <img
            src="/MoSJE.png"
            alt="MoSJE Logo"
            className="w-10 h-10"
          />
          <div>
            <h1 className="text-lg font-bold text-gray-800">
              ADARSH GRAM PORTAL
            </h1>
            <p className="text-xs text-gray-500">
              Ministry of Social Justice & Empowerment Government of India
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 relative" ref={menuRef}>
          <span className="text-sm text-gray-600 hidden sm:block">
            Ministry of Social Justice & Empowerment Government of India
          </span>

          {!user ? (
            // 🔹 Before Login
            <>
              <NavLink
                to="/login"
                className="px-5 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100"
              >
                <LogIn className="inline w-4 h-4 mr-1" />
                Log In
              </NavLink>

              <NavLink
                to="/signup"
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-white font-medium 
                 bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 
                 transition"
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
                <div className="absolute right-0 top-12 w-52 bg-white border rounded-lg shadow-lg z-50">

                  <NavLink
                    to="/profile"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    Profile
                  </NavLink>
                  <NavLink
                    to="/leaderboard"
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Trophy className="w-4 h-4" />
                    LeaderBoard
                  </NavLink>
                  <NavLink
                    to={getOptionLink(user.role)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    onClick={() => setMenuOpen(false)}
                  >
                    <LandPlot className="w-4 h-4" />
                    Know Your Surroundings
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
