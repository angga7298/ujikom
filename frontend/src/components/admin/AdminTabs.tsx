import { ImageIcon, Folder, Users, BarChart3, Zap, MessageSquare } from 'lucide-react';

interface AdminTabsProps {
  activeTab: 'galleries' | 'categories' | 'users' | 'stats' | 'comments';
  onTabChange: (tab: 'galleries' | 'categories' | 'users' | 'stats' | 'comments') => void;
  galleriesCount: number;
  categoriesCount: number;
  usersCount: number;
  commentsCount: number;
}

const AdminTabs = ({ 
  activeTab, 
  onTabChange,
  galleriesCount,
  categoriesCount,
  usersCount,
  commentsCount
}: AdminTabsProps) => {
  const tabs = [
    { id: 'galleries' as const, label: 'galleries', icon: ImageIcon, count: galleriesCount, color: 'red' },
    { id: 'categories' as const, label: 'categories', icon: Folder, count: categoriesCount, color: 'blue' },
    { id: 'stats' as const, label: 'stats', icon: BarChart3, count: null, color: 'green' }, // Pindah ke tengah
    { id: 'users' as const, label: 'users', icon: Users, count: usersCount, color: 'purple' },
    { id: 'comments' as const, label: 'comments', icon: MessageSquare, count: commentsCount, color: 'yellow' },
  ];

  const getColorClass = (color: string) => {
    switch (color) {
      case 'red': return 'bg-red-600 shadow-red-600/25';
      case 'blue': return 'bg-blue-600 shadow-blue-600/25';
      case 'purple': return 'bg-purple-600 shadow-purple-600/25';
      case 'green': return 'bg-green-600 shadow-green-600/25';
      case 'yellow': return 'bg-yellow-600 shadow-yellow-600/25';
      default: return 'bg-red-600 shadow-red-600/25';
    }
  };

  return (
    <div className="mb-8">
      <div className="flex flex-wrap gap-2 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex-1 min-w-[200px] justify-center ${
              activeTab === tab.id
                ? `${getColorClass(tab.color)} text-white shadow-lg`
                : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
            }`}
          >
            <tab.icon className="w-6 h-6" />
            <span className="uppercase tracking-wider">
              {tab.label}
              {tab.count !== null && `(${tab.count})`}
            </span>
            {activeTab === tab.id && <Zap className="w-4 h-4 ml-1" />}
          </button>
        ))}
      </div>
    </div>
  );
}; 

export default AdminTabs;