import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/talkify_icon_transparent.png";
import { BASE_URL } from "../utils/constant";
import { removeUser } from "../utils/userSlice";
import React, { useState } from "react";

const Navbar = () => {
  const user = useSelector((store) => store.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [menuOpen, setMenuOpen] = useState(false);

  // Navigate to feed if user clicks logo and is logged in
  const handleLogoClick = () => {
    if (user) {
      navigate("/feed");
    }
  };

  // Logout handler calls API, clears user, redirects to login
  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="bg-white border-b border-sky-600/10 shadow-[0_2px_6px_rgba(0,0,0,0.05)] sticky top-0 z-50 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        
        {/* Logo and title with clickable behavior */}
        <div
          onClick={handleLogoClick}
          className={`flex items-center gap-3 cursor-pointer select-none ${
            user ? "hover:scale-105 transition-transform duration-200 ease-out" : ""
          }`}
          role={user ? "button" : undefined}
          tabIndex={user ? 0 : undefined}
          onKeyDown={(e) => {
            if (user && (e.key === "Enter" || e.key === " ")) handleLogoClick();
          }}
          aria-disabled={user ? "false" : "true"}
        >
          <img
            src={logo}
            alt="Talkify Logo"
            className="h-9 w-auto object-contain transition-transform duration-200"
          />
          <span className="text-xl font-bold text-sky-600 tracking-tight ">
            Talkify
          </span>
        </div>

        {/* Desktop navigation */}
        {user ? (
          <div className="hidden sm:flex items-center gap-10">
            <Link
              to="/feed"
              className="relative text-black font-normal text-sm hover:text-sky-600 transition-colors duration-200"
            >
              Home
              <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-sky-600 transition-all duration-300 ease-in-out hover:w-full"></span>
            </Link>
            <Link
              to="/profile"
              className="relative text-black font-normal text-sm hover:text-sky-600 transition-colors duration-200"
            >
              Profile
              <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-sky-600 transition-all duration-300 ease-in-out hover:w-full"></span>
            </Link>
            <Link
              to="/connections"
              className="relative text-black font-normal text-sm hover:text-sky-600 transition-colors duration-200"
            >
              Connections
              <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-sky-600 transition-all duration-300 ease-in-out hover:w-full"></span>
            </Link>
            <Link
              to="/requests"
              className="relative text-black font-normal text-sm hover:text-sky-600 transition-colors duration-200"
            >
              Requests
              <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-sky-600 transition-all duration-300 ease-in-out hover:w-full"></span>
            </Link>
            <button
              onClick={handleLogout}
              className="bg-sky-600 text-white px-5 py-2 rounded-lg font-normal text-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50 shadow-sm hover:shadow-md transition-all duration-200"
              aria-label="Logout"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="hidden sm:flex items-center gap-10">
            <Link
              to="/login"
              className="relative bg-sky-600 text-white px-5 py-2 rounded-lg font-normal text-sm hover:bg-sky-700 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Login
              <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-white transition-all duration-300 ease-in-out hover:w-full"></span>
            </Link>
            <Link
              to="/signup"
              className="relative bg-sky-600 text-white px-5 py-2 rounded-lg font-normal text-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50 shadow-sm hover:shadow-md transition-all duration-200"
            >
              Signup
              <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-white transition-all duration-300 ease-in-out hover:w-full"></span>
            </Link>
          </div>
        )}

        {/* Mobile menu toggle button */}
        <button
          className="sm:hidden text-black focus:outline-none focus:ring-2 focus:ring-sky-600 rounded-md p-2 hover:bg-sky-50 transition-colors duration-200"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="sm:hidden bg-white border-t border-sky-600/10 px-4 py-6 flex flex-col gap-4 shadow-[0_4px_10px_rgba(0,0,0,0.08)] animate-slide-in">
          {user ? (
            <>
            <Link
                to="/feed"
                onClick={() => setMenuOpen(false)}
                className="relative block text-black font-normal text-sm hover:text-sky-600 transition-colors duration-200"
              >
                Home
                <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-sky-600 transition-all duration-300 ease-in-out hover:w-full"></span>
              </Link>
              <Link
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className="relative block text-black font-normal text-sm hover:text-sky-600 transition-colors duration-200"
              >
                Profile
                <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-sky-600 transition-all duration-300 ease-in-out hover:w-full"></span>
              </Link>
              <Link
                to="/connections"
                onClick={() => setMenuOpen(false)}
                className="relative block text-black font-normal text-sm hover:text-sky-600 transition-colors duration-200"
              >
                Connections
                <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-sky-600 transition-all duration-300 ease-in-out hover:w-full"></span>
              </Link>
              <Link
                to="/requests"
                onClick={() => setMenuOpen(false)}
                className="relative block text-black font-normal text-sm hover:text-sky-600 transition-colors duration-200"
              >
                Requests
                <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-sky-600 transition-all duration-300 ease-in-out hover:w-full"></span>
              </Link>
              <button
                onClick={() => {
                  handleLogout();
                  setMenuOpen(false);
                }}
                className="bg-sky-600 text-white py-2 rounded-lg font-normal text-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50 shadow-sm hover:shadow-md flex-1 transition-all duration-200"
                aria-label="Logout"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                onClick={() => setMenuOpen(false)}
                className="relative block bg-sky-600 text-white py-2 rounded-lg font-normal text-sm hover:bg-sky-700 transition-all duration-200 shadow-sm hover:shadow-md text-center"
              >
                Login
                <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-white transition-all duration-300 ease-in-out hover:w-full"></span>
              </Link>
              <Link
                to="/signup"
                onClick={() => setMenuOpen(false)}
                className="relative block bg-sky-600 text-white py-2 rounded-lg font-normal text-sm hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-50 transition-all duration-200 shadow-sm hover:shadow-md text-center"
              >
                Signup
                <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-white transition-all duration-300 ease-in-out hover:w-full"></span>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
