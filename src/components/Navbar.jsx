import React, { use } from "react";
import { Link, NavLink } from "react-router";
import { AuthContext } from "../context/AuthContext";
// Assume you have an AuthContext file like this

const Navbar = () => {
  // Get authentication state and functions from context
  const { user, loading, signOutUser } = use(AuthContext);

  // Handle the logout process
  const handleLogout = () => {
    signOutUser()
      .then(() => {
        // You can show a success toast here
        console.log("User logged out successfully");
      })
      .catch((error) => {
        // You can show an error toast here
        console.error("Logout error:", error);
      });
  };

  // Navigation links for reuse in mobile and desktop menus
  const navLinks = (
    <>
      <li>
        <NavLink to="/">Home</NavLink>
      </li>
      <li>
        <NavLink to="/browse-public">Browse Public Habits</NavLink>
      </li>
      {user && (
        <>
          <li>
            <NavLink to="/add-habit">Add Habit</NavLink>
          </li>
          <li>
            <NavLink to="/my-habits">My Habits</NavLink>
          </li>
        </>
      )}
    </>
  );

  return (
    <div className="navbar bg-base-100 shadow-md px-4">
      {/* 1. Navbar Start (Logo + Mobile Hamburger) */}
      <div className="navbar-start">
        {/* Mobile Dropdown Menu */}
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-10 p-2 shadow bg-base-100 rounded-box w-52"
          >
            {navLinks}
          </ul>
        </div>

        {/* Website Name / Logo */}
        <Link to="/" className="btn btn-ghost text-xl font-bold">
          HabitTracker
        </Link>
      </div>

      {/* 2. Navbar Center (Desktop Links) */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">{navLinks}</ul>
      </div>

      {/* 3. Navbar End (User/Login Buttons) */}
      <div className="navbar-end">
        {/* Show a spinner while auth state is loading */}
        {loading ? (
          <span className="loading loading-spinner loading-md"></span>
        ) : user ? (
          // If user is logged IN, show avatar dropdown
          <div className="dropdown dropdown-end">
            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
              <div className="w-10 rounded-full">
                <img
                  alt="User Avatar"
                  src={
                    user.photoURL
                      ? user.photoURL
                      : "https://i.ibb.co.com/xtxz1tdS/default-User.jpg"
                  }
                />
              </div>
            </label>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 z-10 p-2 shadow bg-base-100 rounded-box w-52"
            >
              <li className="p-2">
                <div className="font-bold">{user.displayName || "User"}</div>
                <div className="text-xs text-base-content/70">{user.email}</div>
              </li>
              <li>
                <a onClick={handleLogout} className="text-error font-bold">
                  Log out
                </a>
              </li>
            </ul>
          </div>
        ) : (
          // If user is logged OUT, show Login/Signup
          <div className="flex gap-2">
            <Link to="/login" className="btn btn-primary btn-sm">
              Login
            </Link>
            <Link to="/register" className="btn btn-ghost btn-sm">
              Register
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
