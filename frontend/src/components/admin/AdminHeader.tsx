import { Settings, Trophy, Flag, Users, Activity } from 'lucide-react';

interface AdminHeaderProps {
  stats: {
    totalGalleries: number;
    totalCategories: number;
    totalUsers: number;
    totalComments: number;
  };
  galleries: any[];
  categories: any[];
  users: any[];
}

const AdminHeader = ({ stats, galleries, categories, users }: AdminHeaderProps) => {
  return (
    <div className="mb-12 text-center lg:text-left border-b border-gray-800 pb-8">
      <div className="flex items-center justify-center lg:justify-start gap-4 mb-4">
        <div className="p-3 bg-red-600 rounded-2xl">
          <Settings className="w-8 h-8 text-white" />
        </div>
        <div>
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter">
            RALLY<span className="text-red-600">CONTROL</span>
          </h1>
          <p className="text-lg text-gray-400 font-semibold tracking-wider">
            ADMINISTRATION PANEL
          </p>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 justify-center lg:justify-start mt-6">
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full">
          <Trophy className="w-4 h-4 text-yellow-500" />
          <span className="text-sm font-bold text-white">{stats.totalGalleries || galleries.length} GALLERIES</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full">
          <Flag className="w-4 h-4 text-green-500" />
          <span className="text-sm font-bold text-white">{stats.totalCategories || categories.length} CATEGORIES</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full">
          <Users className="w-4 h-4 text-purple-500" />
          <span className="text-sm font-bold text-white">{stats.totalUsers || users.length} USERS</span>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full">
          <Activity className="w-4 h-4 text-blue-500" />
          <span className="text-sm font-bold text-white">{stats.totalComments} COMMENTS</span>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;