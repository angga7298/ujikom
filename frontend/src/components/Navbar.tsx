import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, User, LayoutDashboard, Menu, X } from 'lucide-react';
import test5 from '../assets/test5.png';
import Swal from 'sweetalert2';

const Navbar = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const controlNavbar = () => {
    if (typeof window !== 'undefined') {
      if (window.scrollY > lastScrollY && window.scrollY > 100) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }
      setLastScrollY(window.scrollY);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', controlNavbar);
      return () => {
        window.removeEventListener('scroll', controlNavbar);
      };
    }
  }, [lastScrollY]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  // --- FUNGSI BARU: Handle Klik Profile dengan SweetAlert2 ---
  const handleProfileClick = () => {
    Swal.fire({
      title: 'Change Profile?',
      text: 'Do you want to change your profile?',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, change it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/EditProfile");
        setIsMenuOpen(false);
      }
    });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'}`}>
      <div className="bg-gradient-to-r from-black via-gray-900 to-black shadow-2xl w-full border-b border-gray-800 backdrop-blur-xl">
        <div className="h-1 bg-gradient-to-r from-transparent via-rally-red to-transparent"></div>
        
        <div className="container-custom">
          <div className="flex justify-between items-center py-4">
            {/* Logo Section */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="w-12 h-12 bg-gradient-to-br from-rally-red to-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-rally-red/30 transform group-hover:scale-110 transition-transform duration-300">
                  <img
                    src={test5}
                    alt="Rally Logo"
                    className="w-14 h-14 object-contain group-hover:scale-110 transition-transform duration-300"
                  />
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

            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-300 hover:text-white focus:outline-none"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            <div className={`${isMenuOpen ? 'block' : 'hidden'} lg:flex lg:items-center lg:space-x-8 absolute lg:relative top-full left-0 right-0 lg:top-auto lg:left-auto lg:right-auto bg-gray-900 lg:bg-transparent border-t border-gray-800 lg:border-t-0`}>
              
              <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-8 p-4 lg:p-0 w-full lg:w-auto">
                <Link
                  to="/"
                  onClick={() => setIsMenuOpen(false)}
                  className="relative group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 font-bold text-sm uppercase tracking-wider py-2 lg:py-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                  </svg>
                  <span>Gallery</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rally-red to-rally-amber group-hover:w-full transition-all duration-300"></div>
                </Link>

                <Link
                  to="/About"
                  onClick={() => setIsMenuOpen(false)}
                  className="relative group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 font-bold text-sm uppercase tracking-wider py-2 lg:py-0"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span>About</span>
                  <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rally-red to-rally-amber group-hover:w-full transition-all duration-300"></div>
                </Link>

                {user ? (
                  <>
                    {isAdmin() && (
                      <Link
                        to="/admin"
                        onClick={() => setIsMenuOpen(false)}
                        className="relative group flex items-center space-x-2 px-6 py-3 my-2 lg:my-0 bg-gradient-to-r from-yellow-400/10 via-yellow-500/10 to-yellow-400/10 border-2 border-yellow-500/50 rounded-lg hover:from-yellow-400/20 hover:via-yellow-500/20 hover:to-yellow-400/20 hover:border-yellow-500/70 hover:shadow-[0_0_20px_rgba(255,255,0,0.5)] transition-all duration-500 overflow-hidden"
                      >
                        <LayoutDashboard className="w-5 h-5 text-yellow-500 drop-shadow-lg" />
                        <span className="text-yellow-500 font-black text-sm uppercase tracking-widest drop-shadow-md">Admin</span>
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-500/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000 rounded-lg"></div>
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-yellow-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-lg"></div>
                      </Link>
                    )}

                    <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 pt-4 lg:pt-0 border-t border-gray-800 lg:border-t-0">
                      
                      {/* --- UPDATE: User Profile Button --- */}
                     <button
                      onClick={handleProfileClick}
                        className="flex items-center space-x-3 px-4 py-2 bg-gradient-to-r from-gray-800/50 to-black/50 border border-gray-700 rounded-lg backdrop-blur-sm hover:border-rally-red hover:bg-gray-700/50 transition-all duration-300 cursor-pointer group"
                        >
                        <div className="relative">
                          <div className="w-8 h-8 bg-gradient-to-br from-rally-red to-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                            <User className="w-4 h-4 text-white" />
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-gray-900 rounded-full"></div>
                        </div>
                        <div className="flex flex-col text-left">
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
                     </button>
                      {/* --------------------------------- */}

                      <button
                        onClick={handleLogout}
                        className="group flex items-center justify-center space-x-2 px-4 py-2 bg-gray-800/50 hover:bg-rally-red/20 border border-gray-700 hover:border-rally-red/50 rounded-lg transition-all duration-300"
                      >
                        <LogOut className="w-4 h-4 text-gray-400 group-hover:text-rally-red transition-colors" />
                        <span className="text-gray-400 group-hover:text-rally-red font-bold text-sm uppercase tracking-wider transition-colors">
                          Logout
                        </span>
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col lg:flex-row lg:items-center space-y-4 lg:space-y-0 lg:space-x-4 pt-4 lg:pt-0 border-t border-gray-800 lg:border-t-0">
                    <Link
                      to="/login"
                      onClick={() => setIsMenuOpen(false)}
                      className="relative group flex items-center space-x-2 text-gray-300 hover:text-white transition-all duration-300 font-bold text-sm uppercase tracking-wider"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"/>
                      </svg>
                      <span>Login</span>
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-rally-red to-rally-amber group-hover:w-full transition-all duration-300"></div>
                    </Link>

                    <Link 
                      to="/register"
                      onClick={() => setIsMenuOpen(false)}
                      className="group relative overflow-hidden px-6 py-2.5 bg-gradient-to-r from-rally-red via-red-600 to-rally-red hover:from-red-600 hover:via-rally-red hover:to-red-600 text-white font-black rounded-lg shadow-lg shadow-rally-red/30 hover:shadow-rally-red/50 transform hover:scale-105 transition-all duration-300 text-sm uppercase tracking-wider"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
                      <span className="relative z-10 flex items-center justify-center space-x-2">
                        <span>Register</span>
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                        </svg>
                      </span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent"></div>
      </div>
    </nav>
  );
};

export default Navbar;