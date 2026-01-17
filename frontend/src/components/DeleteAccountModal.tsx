import { useState } from 'react';
import { AlertTriangle, Loader, Lock, X } from 'lucide-react';
import api from '../api/axios';

interface DeleteAccountModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const DeleteAccountModal = ({ isOpen, onClose, onSuccess }: DeleteAccountModalProps) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleDelete = async () => {
    if (!password) {
      setError('Please enter your password to confirm');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await api.delete('/api/auth/user', {
        data: { password }
      });

      if (response.data.success) {
        onSuccess();
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-900/30 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Delete Account</h3>
              <p className="text-gray-400 text-sm">This action cannot be undone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-6">
            <p className="text-gray-300 mb-4">
              Are you absolutely sure? This will permanently delete your account and remove all your data from our servers.
            </p>
            
            <div className="bg-red-900/10 border border-red-800/30 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-bold text-red-400 mb-1">Warning</h4>
                  <ul className="text-red-300/80 text-sm space-y-1">
                    <li>• All your galleries and comments will be deleted</li>
                    <li>• Your username will become unavailable</li>
                    <li>• This action is irreversible</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-gray-300 text-sm font-medium mb-3">
              Confirm your password to continue
            </label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>
            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <button
              onClick={handleDelete}
              disabled={loading || !password}
              className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-red-900 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Account'
              )}
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-bold rounded-xl transition-all duration-300"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;