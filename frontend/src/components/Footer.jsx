import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-white border-t border-blue-500/10 shadow-[0_2px_6px_rgba(0,0,0,0.05)] py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-6 sm:gap-0">
        {/* Left Side */}
        <div className="text-center sm:text-left text-black font-normal text-sm">
          © {new Date().getFullYear()} <span className="font-medium text-sky-600 ">Talkify</span>. All rights reserved.
        </div>

        {/* Right Side Links */}
        <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
          <a
            href="#"
            className="relative text-black font-normal text-sm hover:text-sky-700  transition-colors duration-200"
          >
            Privacy
            <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-sky-600  transition-all duration-300 ease-in-out hover:w-full"></span>
          </a>
          <a
            href="#"
            className="relative text-black font-normal text-sm hover:text-sky-700  transition-colors duration-200"
          >
            Terms
            <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-sky-600  transition-all duration-300 ease-in-out hover:w-full"></span>
          </a>
          <a
            href="#"
            className="relative text-black font-normal text-sm hover:text-sky-700  transition-colors duration-200"
          >
            About
            <span className="absolute left-0 bottom-[-4px] w-0 h-[2px] bg-sky-600  transition-all duration-300 ease-in-out hover:w-full"></span>
          </a>
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-sky-700  transition-colors duration-200"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-sky-700  transition-colors duration-200"
              aria-label="Facebook"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
              </svg>
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-black hover:text-sky-700  transition-colors duration-200"
              aria-label="LinkedIn"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.155z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


