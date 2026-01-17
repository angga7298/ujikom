import { ImageIcon, Folder, Users, Activity, BarChart3, Loader } from 'lucide-react';
import type { Gallery } from '../../types';

interface StatsTabProps {
  stats: {
    totalGalleries: number;
    totalCategories: number;
    totalUsers: number;
    totalComments: number;
  };
  loading: boolean;
  galleries: Gallery[];
}

const StatsTab = ({ stats, loading, galleries }: StatsTabProps) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-red-600/20 to-red-900/10 backdrop-blur-sm border border-red-500/30 rounded-2xl p-6 hover:border-red-500/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide">Galleries</p>
              <h3 className="text-3xl font-black text-white mt-2">{stats.totalGalleries}</h3>
            </div>
            <ImageIcon className="w-10 h-10 text-red-500" />
          </div>
          <div className="mt-4 h-2 bg-red-900/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-red-500 to-orange-500 rounded-full"
              style={{ width: `${Math.min(stats.totalGalleries * 10, 100)}%` }}
            />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-600/20 to-blue-900/10 backdrop-blur-sm border border-blue-500/30 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide">Categories</p>
              <h3 className="text-3xl font-black text-white mt-2">{stats.totalCategories}</h3>
            </div>
            <Folder className="w-10 h-10 text-blue-500" />
          </div>
          <div className="mt-4 h-2 bg-blue-900/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full"
              style={{ width: `${Math.min(stats.totalCategories * 25, 100)}%` }}
            />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-purple-600/20 to-purple-900/10 backdrop-blur-sm border border-purple-500/30 rounded-2xl p-6 hover:border-purple-500/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide">Users</p>
              <h3 className="text-3xl font-black text-white mt-2">{stats.totalUsers}</h3>
            </div>
            <Users className="w-10 h-10 text-purple-500" />
          </div>
          <div className="mt-4 h-2 bg-purple-900/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
              style={{ width: `${Math.min(stats.totalUsers * 10, 100)}%` }}
            />
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-600/20 to-green-900/10 backdrop-blur-sm border border-green-500/30 rounded-2xl p-6 hover:border-green-500/50 transition-all duration-300">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm font-semibold uppercase tracking-wide">Comments</p>
              <h3 className="text-3xl font-black text-white mt-2">{stats.totalComments}</h3>
            </div>
            <Activity className="w-10 h-10 text-green-500" />
          </div>
          <div className="mt-4 h-2 bg-green-900/50 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
              style={{ width: `${Math.min(stats.totalComments / 10, 100)}%` }}
            />
          </div>
        </div>
      </div>
      
      {/* Recent Activity */}
      <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 hover:border-gray-600 transition-all duration-300">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-6 h-6 text-green-500" />
          <h3 className="text-xl font-bold text-white">Recent Activity</h3>
        </div>
        <div className="space-y-4">
          {galleries.slice(0, 5).map((gallery) => (
            <div key={gallery.id} className="flex items-center justify-between p-4 bg-gray-800/20 rounded-xl hover:bg-gray-800/40 transition-colors">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-lg bg-gray-700 overflow-hidden">
                  <img 
                    src={`${API_URL}${gallery.image_path}`} 
                    alt={gallery.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/111827/DC2626?text=RALLY';
                    }}
                  />
                </div>
                <div>
                  <h4 className="font-bold text-white">{gallery.title}</h4>
                  <p className="text-gray-400 text-sm">
                    Added by {gallery.username} • {new Date(gallery.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <span className="px-3 py-1 bg-red-600/20 text-red-400 text-xs font-bold rounded-full">
                Gallery
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StatsTab;