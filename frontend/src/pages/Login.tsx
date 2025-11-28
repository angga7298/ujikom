import { useState, } from 'react';
import type {FormEvent, ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogIn, Loader } from 'lucide-react';
import type { LoginCredentials } from '../types';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginCredentials>({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.username, formData.password);

    if (result.success) {
      navigate('/');
    } else {
      setError(result.message || 'Login failed');
    }

    setLoading(false);
  };

  return (
 <div className="min-h-screen flex items-center justify-center py-12 px-4 bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
  {/* Animated background effects */}
  <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(239,68,68,0.1),transparent_50%)]"></div>
  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rally-red to-transparent animate-pulse"></div>
  
  <div className="max-w-md w-full relative z-10">
    <div className="text-center mb-8">
      <div className="flex justify-center mb-6">
        {/* Modern racing helmet icon */}
        <div className="relative">
          <div className="w-24 h-24 bg-gradient-to-br from-rally-red to-red-600 rounded-full flex items-center justify-center shadow-2xl shadow-rally-red/50 border-4 border-gray-800">
            <svg className="w-14 h-14 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/>
              <path d="M12 12h.01"/>
            </svg>
          </div>
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-rally-amber text-black text-xs font-black px-3 py-1 rounded-full shadow-lg">
            MOTORSPORT
          </div>
        </div>
      </div>
      
      <h2 className="text-5xl font-black text-white mb-3 tracking-tighter">
        RALLY<span className="text-rally-red">GALLERY</span>
      </h2>
      <div className="flex items-center justify-center space-x-2 mb-2">
        <div className="h-px w-12 bg-gradient-to-r from-transparent to-rally-red"></div>
        <p className="text-rally-amber text-sm font-bold uppercase tracking-widest">
          PRO ACCESS
        </p>
        <div className="h-px w-12 bg-gradient-to-l from-transparent to-rally-red"></div>
      </div>
      <p className="text-gray-400 text-sm">
        High-performance racing platform
      </p>
    </div>

    <div className="bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl p-8 border border-gray-800 backdrop-blur-xl relative overflow-hidden">
      {/* Geometric patterns */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-rally-red/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-rally-amber/5 rounded-full blur-3xl"></div>
      
      {/* Speed lines decoration */}
      <div className="absolute top-4 right-4 flex flex-col space-y-1 opacity-20">
        <div className="h-0.5 w-16 bg-gradient-to-r from-rally-red to-transparent"></div>
        <div className="h-0.5 w-12 bg-gradient-to-r from-rally-red to-transparent"></div>
        <div className="h-0.5 w-8 bg-gradient-to-r from-rally-red to-transparent"></div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
        {error && (
          <div className="bg-red-500/10 border-l-4 border-red-500 text-red-400 px-4 py-3 rounded-r-lg flex items-center space-x-3 backdrop-blur-sm">
            <div className="flex-shrink-0">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd"/>
              </svg>
            </div>
            <span className="font-medium">{error}</span>
          </div>
        )}

        <div className="space-y-2">
          <label htmlFor="username" className="block text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
            <span className="w-1 h-4 bg-rally-red"></span>
            <span>Driver ID</span>
          </label>
          <div className="relative group">
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full bg-black/50 border-2 border-gray-800 focus:border-rally-red text-white px-4 py-3.5 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-rally-red/20 placeholder-gray-600 font-medium group-hover:border-gray-700"
              placeholder="Enter username"
              disabled={loading}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="w-2 h-2 bg-rally-amber rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="block text-xs font-black text-gray-400 uppercase tracking-widest flex items-center space-x-2">
            <span className="w-1 h-4 bg-rally-red"></span>
            <span>Security Key</span>
          </label>
          <div className="relative group">
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-black/50 border-2 border-gray-800 focus:border-rally-red text-white px-4 py-3.5 rounded-lg transition-all duration-300 focus:ring-2 focus:ring-rally-red/20 placeholder-gray-600 font-medium group-hover:border-gray-700"
              placeholder="Enter password"
              disabled={loading}
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
              </svg>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full group relative overflow-hidden bg-gradient-to-r from-rally-red via-red-600 to-rally-red hover:from-red-600 hover:via-rally-red hover:to-red-600 text-white font-black py-4 px-6 rounded-lg shadow-lg shadow-rally-red/30 transform transition-all duration-300 hover:shadow-rally-red/50 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none uppercase tracking-wider text-sm"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></div>
          {loading ? (
            <span className="flex items-center justify-center space-x-3 relative z-10">
              <Loader className="w-5 h-5 animate-spin" />
              <span>INITIALIZING SYSTEM...</span>
            </span>
          ) : (
            <span className="flex items-center justify-center space-x-3 relative z-10">
              <LogIn className="w-5 h-5" />
              <span>LAUNCH SESSION</span>
              <svg className="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </span>
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-400 text-sm">
          New driver?{' '}
          <Link to="/register" className="text-rally-amber hover:text-rally-red font-bold transition-colors inline-flex items-center group">
            Register Now
            <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"/>
            </svg>
          </Link>
        </p>
      </div>

      {/* Demo accounts - Modern style */}
      
      {/* Performance stats decoration */}
      <div className="mt-6 flex items-center justify-center space-x-6 text-gray-700 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
          <span>SECURE</span>
        </div>
        <div className="w-px h-3 bg-gray-800"></div>
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 bg-rally-amber rounded-full animate-pulse"></div>
          <span>ONLINE</span>
        </div>
        <div className="w-px h-3 bg-gray-800"></div>
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
          <span>FAST</span>
        </div>
      </div>
    </div>

    {/* Bottom tagline */}
    <div className="mt-8 text-center">
      <p className="text-gray-600 text-xs font-medium">
        Powered by <span className="text-rally-red font-black">RALLY GALLERY</span> Technology
      </p>
      <p className="text-gray-700 text-xs mt-1 italic">
        "Speed. Precision. Performance."
      </p>
    </div>
  </div>
</div>)}
export default Login;