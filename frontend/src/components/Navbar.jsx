import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from "../assets/talkify_icon_transparent.png";
import { BASE_URL } from '../utils/constant';

const Navbar = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const logoutHandler = async () => {
    try {
      await axios.post(BASE_URL+"/logout", {}, { withCredentials: true });
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50 font-inter">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        {/* Logo and Title */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="Talkify Logo" className="h-9 w-auto object-contain" />
          <span className="text-2xl font-semibold text-slate-800 tracking-wide hidden sm:inline">
            Talkify
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden sm:flex items-center gap-6">
          <Link
            to="/login"
            className="text-slate-700 font-medium hover:text-indigo-600 transition duration-200"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="text-slate-700 font-medium hover:text-indigo-600 transition duration-200"
          >
            Signup
          </Link>
          <button
            onClick={logoutHandler}
            className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition border"
          >
            Logout
          </button>
        </div>

        {/* Mobile Toggle */}
        <button
          className="sm:hidden text-slate-700 focus:outline-none"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="sm:hidden px-4 pb-4 flex flex-col gap-3">
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="text-slate-700 font-medium hover:text-indigo-600 transition"
          >
            Login
          </Link>
          <Link
            to="/signup"
            onClick={() => setMenuOpen(false)}
            className="text-slate-700 font-medium hover:text-indigo-600 transition"
          >
            Signup
          </Link>
          <button
            onClick={() => {
              logoutHandler();
              setMenuOpen(false);
            }}
            className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700 transition border"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;



