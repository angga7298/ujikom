import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
   <nav className="bg-gradient-to-r from-black via-gray-900 to-black shadow-2xl sticky top-0 z-50 border-b border-gray-800 backdrop-blur-xl">
  {/* Top accent line */}
  <div className="h-1 bg-gradient-to-r from-transparent via-rally-red to-transparent"></div>
  
  <div className="container-custom">
    <div className="flex justify-between items-center py-4">
      {/* Logo Section */}
      <Link to="/" className="flex items-center space-x-3 group">
        <div className="relative">
          <div className="w-10 h-10 bg-gradient-to-br from-rally-red to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-rally-red/30 transform group-hover:scale-110 transition-transform duration-300">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-rally-amber rounded-full animate-pulse"></div>
        </div>
        <div className="flex flex-col">
          <span className="text-2xl font-black text-white tracking-tighter leading-none">
            RALLY<span className="text-rally-red">GALLERY</span>
          </span>
          <span className="text-[10px] text-rally-amber font-bold uppercase tracking-widest">
            Motorsport Pro
          </span>
        </div>
      </Link>

      {/* Navigation Items */}
      <div className="flex items-center space-x-8">
        {/* Gallery Link */}
        <Link
          to="/"
          className="relative group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 font-bold text-sm uppercase tracking-wider"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
          </svg>
          <span>Gallery</span>
          <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rally-red to-rally-amber group-hover:w-full transition-all duration-300"></div>
        </Link>

        {user ? (
          <>
            {/* Admin Link */}
            {isAdmin() && (
              <Link
                to="/admin"
                className="relative group flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-rally-amber/10 to-yellow-600/10 border border-rally-amber/30 rounded-lg hover:from-rally-amber/20 hover:to-yellow-600/20 transition-all duration-300"
              >
                <LayoutDashboard className="w-4 h-4 text-rally-amber" />
                <span className="text-rally-amber font-black text-xs uppercase tracking-widest">Admin</span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-rally-amber/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700 rounded-lg"></div>
              </Link>
            )}

            {/* User Info & Logout Section */}
            <div className="flex items-center space-x-4">
              {/* User Profile */}
              <div className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-gray-800/50 to-black/50 border border-gray-700 rounded-lg backdrop-blur-sm">
                <div className="relative">
                  <div className="w-8 h-8 bg-gradient-to-br from-rally-red to-red-600 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                  <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-white font-bold text-sm leading-none">{user.username}</span>
                  {isAdmin() ? (
                    <span className="text-[10px] text-rally-amber font-black uppercase tracking-wider mt-0.5">
                      Team Principal
                    </span>
                  ) : (
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mt-0.5">
                      Pro Driver
                    </span>
                  )}
                </div>
                {isAdmin() && (
                  <span className="px-2 py-1 bg-rally-red text-white text-[10px] font-black rounded uppercase tracking-wider shadow-lg shadow-rally-red/30">
                    Admin
                  </span>
                )}
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="group flex items-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-rally-red/20 border border-gray-700 hover:border-rally-red/50 rounded-lg transition-all duration-300"
              >
                <LogOut className="w-4 h-4 text-gray-400 group-hover:text-rally-red transition-colors" />
                <span className="text-gray-400 group-hover:text-rally-red font-bold text-sm uppercase tracking-wider transition-colors">
                  Logout
                </span>
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Login Link */}
            <Link
              to="/login"
              className="relative group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 font-bold text-sm uppercase tracking-wider"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
              </svg>
              <span>Login</span>
              <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rally-red to-rally-amber group-hover:w-full transition-all duration-300"></div>
            </Link>

            {/* Register Button */}
            <Link 
              to="/register" 
              className="group relative overflow-hidden px-6 py-2.5 bg-gradient-to-r from-rally-red via-red-600 to-rally-red hover:from-red-600 hover:via-rally-red hover:to-red-600 text-white font-black rounded-lg shadow-lg shadow-rally-red/30 hover:shadow-rally-red/50 transform hover:scale-105 transition-all duration-300 text-sm uppercase tracking-wider"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
              <span className="relative z-10 flex items-center space-x-2">
                <span>Register</span>
                <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                </svg>
              </span>
            </Link>
          </>
        )}
      </div>
    </div>
  </div>

  {/* Bottom decorative line with speed effect */}
  <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
</nav>)}

export default Navbar;