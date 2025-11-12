import React, { useContext, useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  FaSun,
  FaMoon,
  FaBars,
  FaTimes,
  FaUser,
  FaSignOutAlt,
  FaHome,
  FaSearch,
  FaPlus,
  FaList,
} from "react-icons/fa";

const Navbar = () => {
  const { user, loading, signOutUser } = useContext(AuthContext);

  const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleToggle = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleLogout = () => {
    signOutUser()
      .then(() => {
        //console.log("User logged out successfully");
      })
      .catch((error) => {
        //console.error("Logout error:", error);
      });
  };

  const navLinks = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 ${
              isActive
                ? "bg-primary text-primary-content font-medium"
                : "hover:bg-base-200 dark:hover:bg-base-800"
            }`
          }
        >
          <FaHome className="text-sm" />
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/public-habits"
          className={({ isActive }) =>
            `flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 ${
              isActive
                ? "bg-primary text-primary-content font-medium"
                : "hover:bg-base-200 dark:hover:bg-base-800"
            }`
          }
        >
          <FaSearch className="text-sm" />
          Browse Public Habits
        </NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink
              to="/add-habit"
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-content font-medium"
                    : "hover:bg-base-200 dark:hover:bg-base-800"
                }`
              }
            >
              <FaPlus className="text-sm" />
              Add Habit
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/my-habits"
              className={({ isActive }) =>
                `flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-300 ${
                  isActive
                    ? "bg-primary text-primary-content font-medium"
                    : "hover:bg-base-200 dark:hover:bg-base-800"
                }`
              }
            >
              <FaList className="text-sm" />
              My Habits
            </NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50 backdrop-blur-lg bg-opacity-90">
      <div className="navbar-start">
        <div className="lg:hidden">
          <button
            className="btn btn-ghost btn-circle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <FaTimes className="h-5 w-5" />
            ) : (
              <FaBars className="h-5 w-5" />
            )}
          </button>
        </div>
        <Link
          to="/"
          className="btn btn-ghost text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
        >
          HabitTracker
        </Link>
      </div>

      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1 gap-2">{navLinks}</ul>
      </div>

      <div className="navbar-end gap-2">
        <button
          className="btn btn-ghost btn-circle border-none shadow-sm hover:shadow-md transition-all duration-300"
          onClick={handleToggle}
          aria-label="Toggle theme"
        >
          {theme === "light" ? (
            <FaMoon className="h-5 w-5 text-indigo-600" />
          ) : (
            <FaSun className="h-5 w-5 text-yellow-400" />
          )}
        </button>

        {loading ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : user ? (
          <div className="dropdown dropdown-end">
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar hover:ring-2 hover:ring-primary transition-all duration-300"
            >
              <div className="w-10 rounded-full ring-2 ring-primary ring-offset-2 ring-offset-base-100">
                <img
                  alt="User Avatar"
                  src={
                    user.photoURL
                      ? user.photoURL
                      : "https://i.ibb.co/xtxz1tdS/default-User.jpg"
                  }
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-10 p-2 shadow-xl bg-base-100 rounded-xl w-60 border border-base-300 dark:border-base-700"
            >
              <li className="menu-title">
                <span className="text-base-content/70">Account</span>
              </li>
              <li className="p-2 border-b border-base-200 dark:border-base-700">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-10 rounded-full">
                      <img
                        alt="User Avatar"
                        src={
                          user.photoURL
                            ? user.photoURL
                            : "https://i.ibb.co/xtxz1tdS/default-User.jpg"
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <div className="font-bold">
                      {user.displayName || "User"}
                    </div>
                    <div className="text-xs text-base-content/70 truncate">
                      {user.email}
                    </div>
                  </div>
                </div>
              </li>
              <li>
                <a
                  onClick={handleLogout}
                  className="text-error hover:bg-error hover:text-error-content transition-all duration-300 flex items-center gap-2"
                >
                  <FaSignOutAlt className="text-sm" />
                  Log out
                </a>
              </li>
            </ul>
          </div>
        ) : (
          <div className="flex gap-2">
            <Link
              to="/login"
              className="btn btn-primary btn-sm shadow-md hover:shadow-lg transition-all duration-300"
            >
              Login
            </Link>
            <Link
              to="/register"
              className="btn btn-outline btn-sm border-primary text-primary hover:bg-primary hover:text-primary-content transition-all duration-300"
            >
              Register
            </Link>
          </div>
        )}
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden absolute top-16 left-0 right-0 bg-base-100 shadow-xl z-40 p-4 border-t border-base-200 dark:border-base-700">
          <ul className="menu menu-vertical gap-2">{navLinks}</ul>
        </div>
      )}
    </div>
  );
};

export default Navbar;
