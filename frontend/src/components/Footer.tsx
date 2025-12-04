import { Link } from 'react-router-dom';
import test5 from '../assets/test5.png'; // Pakai logo yang sama

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-black border-t border-gray-900">
      {/* RPM Bar Animation */}
      <div className="h-1 bg-gray-900 overflow-hidden">
        <div className="h-full w-1/3 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-[slide_3s_linear_infinite]"></div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Main Footer Content */}
        <div className="flex flex-col lg:flex-row justify-between items-center mb-12">
          
          {/* Left: Logo/Brand */}
          <div className="flex items-center space-x-4 mb-8 lg:mb-0">
            <div className="relative">
              <img
                src={test5}
                alt="Rally Gallery Logo"
                className="w-16 h-16 object-contain"
              />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h3 className="text-white font-black text-2xl tracking-tight leading-none">
                RALLY<span className="text-red-600">GALLERY</span>
              </h3>
              <p className="text-gray-500 text-xs tracking-wider mt-1">
                MOTORSPORT PRO
              </p>
            </div>
          </div>

          {/* Center: Quick Links */}
          <div className="flex flex-wrap justify-center gap-8 mb-8 lg:mb-0">
            <Link 
              to="/" 
              className="group text-gray-400 hover:text-white transition-all duration-300 font-semibold text-sm tracking-wider relative"
            >
              GALLERY
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/about" 
              className="group text-gray-400 hover:text-white transition-all duration-300 font-semibold text-sm tracking-wider relative"
            >
              ABOUT
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <a 
              href="#" 
              className="group text-gray-400 hover:text-white transition-all duration-300 font-semibold text-sm tracking-wider relative"
            >
              CARS
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
            </a>
            <a 
              href="#" 
              className="group text-gray-400 hover:text-white transition-all duration-300 font-semibold text-sm tracking-wider relative"
            >
              EVENTS
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-red-600 group-hover:w-full transition-all duration-300"></span>
            </a>
          </div>

          {/* Right: Social Media */}
          <div className="flex space-x-4">
            <a 
              href="#" 
              className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 hover:border-red-600/50 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="Twitter"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
            <a 
              href="#" 
              className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 hover:border-red-600/50 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="Instagram"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm4.965-10.405a1.44 1.44 0 112.881.001 1.44 1.44 0 01-2.881-.001z"/>
              </svg>
            </a>
            <a 
              href="#" 
              className="w-10 h-10 rounded-full bg-gray-900 border border-gray-800 hover:border-red-600/50 flex items-center justify-center text-gray-400 hover:text-white transition-all duration-300 hover:scale-110"
              aria-label="YouTube"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.279 16.736 5.02 15.705 5 12c.02-3.705.279-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.979 8.295 19 12c-.021 3.705-.279 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-900">
          <div className="flex flex-col md:flex-row justify-between items-center">
            
            {/* Copyright */}
            <div className="text-gray-600 text-sm mb-4 md:mb-0">
              <p className="flex items-center flex-wrap gap-2">
                <span className="text-red-500">⚫</span>
                <span>© 2024 RALLYGALLERY. ALL RIGHTS RESERVED.</span>
                <span className="hidden md:inline text-gray-700">|</span>
                <span className="text-gray-500">MOTORSPORT PASSION</span>
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-4 md:mb-0">
              <a 
                href="#" 
                className="text-gray-500 hover:text-white text-xs tracking-wider transition-colors duration-300"
              >
                PRIVACY
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-white text-xs tracking-wider transition-colors duration-300"
              >
                TERMS
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-white text-xs tracking-wider transition-colors duration-300"
              >
                COOKIES
              </a>
              <a 
                href="#" 
                className="text-gray-500 hover:text-white text-xs tracking-wider transition-colors duration-300"
              >
                CONTACT
              </a>
            </div>

            {/* Back to Top */}
            <button 
              onClick={scrollToTop}
              className="flex items-center space-x-2 text-gray-500 hover:text-red-500 text-xs tracking-wider transition-colors duration-300 group"
            >
              <span>BACK TO TOP</span>
              <svg 
                className="w-4 h-4 transform group-hover:-translate-y-1 transition-transform duration-300" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>

        {/* RPM Labels */}
        <div className="flex justify-between mt-2 px-2">
          <span className="text-gray-700 text-xs">IDLE</span>
          <span className="text-gray-700 text-xs">REDLINE</span>
        </div>
      </div>

      {/* CSS Animation */}
    
    </footer>
  );
};

export default Footer;