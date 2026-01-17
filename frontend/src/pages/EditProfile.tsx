import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { 
  ArrowLeft, User, Mail, Lock, Loader, Check, 
  ShieldAlert, Trash2 
} from 'lucide-react';
import Swal from 'sweetalert2';

// Import Delete Modal
import DeleteAccountModal from '../components/DeleteAccountModal';

const EditProfile = () => {
  const navigate = useNavigate();
  const { user: authUser, setUser, logout } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const [formData, setFormData] = useState({
    username: '',
    email: ''
  });

  const [passwordData, setPasswordData] = useState({
    current_password: '',
    new_password: '',
  });

  useEffect(() => {
    if (authUser) {
      setFormData({
        username: authUser.username,
        email: authUser.email
      });
      setLoading(false);
    } else {
      navigate('/login');
    }
  }, [authUser, navigate]);

  const handleProfileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setUpdating(true);

    try {
      const payload: any = {};
      
      if (formData.username !== authUser?.username) {
        payload.username = formData.username;
      }
      
      if (formData.email !== authUser?.email) {
        payload.email = formData.email;
      }
      
      if (passwordData.new_password) {
        if (!passwordData.current_password) {
          throw new Error('Current password is required');
        }
        payload.current_password = passwordData.current_password;
        payload.new_password = passwordData.new_password;
      }

      if (Object.keys(payload).length === 0) {
        Swal.fire({
          icon: 'info',
          title: 'No Changes',
          text: 'Anda tidak melakukan perubahan apapun.',
          background: '#111827',
          color: '#fff',
          confirmButtonColor: '#dc2626',
        });
        setUpdating(false);
        return;
      }
      
      const response = await api.put('/api/auth/profile', payload);

      if (response.data.success) {
        // Update user di context
        if (setUser && response.data.user) {
          setUser(response.data.user);
        }
        
        setPasswordData({ current_password: '', new_password: '' });
        
        // SweetAlert Success + Redirect ke Home (/)
        Swal.fire({
          icon: 'success',
          title: 'Updated!',
          text: 'Profil berhasil diperbarui. Mengalihkan...',
          timer: 1500, // Muncul 1.5 detik aja
          showConfirmButton: false,
          background: '#111827',
          color: '#fff',
        }).then(() => {
          navigate('/'); // BALIK KE HALAMAN AWAL
        });
      }
    } catch (err: any) {
      console.error('Update error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Update Failed',
        text: err.response?.data?.message || err.message || 'Gagal memperbarui profil.',
        background: '#111827',
        color: '#fff',
        confirmButtonColor: '#dc2626',
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDeleteSuccess = async () => {
    await logout();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <Loader className="w-12 h-12 text-rally-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/')} // Jika klik Back, juga balik ke Home
            className="inline-flex items-center space-x-2 text-gray-300 hover:text-rally-red transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Home</span>
          </button>
          
          <div className="bg-gray-800 rounded-full px-4 py-2 border border-gray-700 flex items-center space-x-2">
            <ShieldAlert className="w-4 h-4 text-amber-400" />
            <span className="text-gray-300 text-sm font-semibold">EDIT PROFILE</span>
          </div>
        </div>

        {/* Form Container */}
        <div className="max-w-3xl mx-auto">
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-gray-700/50 shadow-2xl">
            
            {/* Profile Header */}
            <div className="flex flex-col items-center mb-8 pb-8 border-b border-gray-700/50">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center mb-4 border-4 border-gray-600 shadow-xl">
                <User className="w-12 h-12 text-gray-300" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">{formData.username}</h2>
              <p className="text-gray-400 text-sm">{formData.email}</p>
              <div className="mt-2">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${authUser?.role === 'admin' ? 'bg-purple-900/30 text-purple-400' : 'bg-blue-900/30 text-blue-400'}`}>
                  {authUser?.role?.toUpperCase()}
                </span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Personal Information Section */}
              <div>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                  <span className="w-1.5 h-8 bg-gradient-to-b from-rally-red to-red-600 mr-3 rounded-full"></span>
                  Personal Information
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Username */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 font-medium text-sm mb-3">
                      Username
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <User className="w-5 h-5" />
                      </div>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleProfileChange}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-rally-red focus:border-transparent outline-none transition-all"
                        placeholder="Enter new username"
                        required
                        minLength={3}
                        maxLength={30}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div className="md:col-span-2">
                    <label className="block text-gray-300 font-medium text-sm mb-3">
                      Email Address
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <Mail className="w-5 h-5" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleProfileChange}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-rally-red focus:border-transparent outline-none transition-all"
                        placeholder="Enter new email"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Password Change Section */}
              <div>
                <h3 className="text-lg font-bold text-white mb-6 flex items-center">
                  <span className="w-1.5 h-8 bg-gradient-to-b from-rally-red to-red-600 mr-3 rounded-full"></span>
                  Change Password
                </h3>
                <p className="text-gray-400 text-sm mb-6">Leave blank if you don't want to change your password</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Current Password */}
                  <div>
                    <label className="block text-gray-300 font-medium text-sm mb-3">
                      Current Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type="password"
                        name="current_password"
                        value={passwordData.current_password}
                        onChange={handlePasswordChange}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-rally-red focus:border-transparent outline-none transition-all"
                        placeholder="Enter current password"
                        minLength={6}
                      />
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-gray-300 font-medium text-sm mb-3">
                      New Password
                    </label>
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">
                        <Lock className="w-5 h-5" />
                      </div>
                      <input
                        type="password"
                        name="new_password"
                        value={passwordData.new_password}
                        onChange={handlePasswordChange}
                        className="w-full pl-12 pr-4 py-3.5 rounded-xl bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:ring-2 focus:ring-rally-red focus:border-transparent outline-none transition-all"
                        placeholder="Enter new password"
                        minLength={6}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-700/50 flex flex-col sm:flex-row gap-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-rally-red to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-3.5 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate('/')}
                  className="px-8 py-3.5 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-300"
                >
                  Cancel
                </button>
              </div>

              {/* Delete Account Section */}
              <div className="pt-8 mt-8 border-t border-gray-700/50">
                <div className="bg-red-900/10 border border-red-800/30 rounded-xl p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-red-900/30 rounded-lg">
                      <Trash2 className="w-6 h-6 text-red-500" />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-white">Danger Zone</h4>
                      <p className="text-gray-400 text-sm">Permanent account deletion</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-300 mb-6">
                    Once you delete your account, there is no going back. All your data will be permanently removed.
                  </p>
                  
                  <button
                    type="button"
                    onClick={() => setShowDeleteModal(true)}
                    className="bg-red-900/30 hover:bg-red-800/40 text-red-400 hover:text-red-300 border border-red-800 hover:border-red-700 font-bold py-3 px-6 rounded-xl transition-all duration-300 flex items-center gap-2"
                  >
                    <Trash2 className="w-5 h-5" />
                    Delete My Account
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Delete Account Modal */}
      <DeleteAccountModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onSuccess={handleDeleteSuccess}
      />
    </div>
  );
};

export default EditProfile;