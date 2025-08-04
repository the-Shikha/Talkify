import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-gray-600 gap-2 sm:gap-0">
        
        {/* Left Side */}
        <div className="text-center sm:text-left">
          © {new Date().getFullYear()} <span className="font-semibold text-slate-800">Talkify</span>. All rights reserved.
        </div>

        {/* Right Side Links */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <a href="/privacy" className="hover:text-indigo-600 transition">Privacy</a>
          <a href="/terms" className="hover:text-indigo-600 transition">Terms</a>
          <a href="/about" className="hover:text-indigo-600 transition">About</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


