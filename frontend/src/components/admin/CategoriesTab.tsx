import { Folder, Plus, Trash2 } from 'lucide-react';
import type { Category } from '../../types';

interface CategoriesTabProps {
  categories: Category[];
  onDelete: (id: number) => Promise<void>;
  onCreateClick: () => void;
}

const CategoriesTab = ({ categories, onDelete, onCreateClick }: CategoriesTabProps) => {
  if (categories.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700">
        <Folder className="w-20 h-20 text-gray-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">No Categories Found</h3>
        <p className="text-gray-400 mb-6">Create your first category to organize galleries</p>
        <button
          onClick={onCreateClick}
          className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50 flex items-center gap-3 mx-auto"
        >
          <Plus className="w-5 h-5" />
          <span className="uppercase tracking-wider">Create First Category</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {categories.map((category) => (
        <div
          key={category.id}
          className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">
                {category.name}
              </h3>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                category.type === 'year' 
                  ? 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                  : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
              }`}>
                {category.type}
              </span>
            </div>
            <button
              onClick={() => onDelete(category.id)}
              className="opacity-0 group-hover:opacity-100 p-2 bg-red-600/20 hover:bg-red-600 rounded-lg text-red-400 hover:text-white transition-all"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
          
          {category.description && (
            <p className="text-gray-400 text-sm mb-4">
              {category.description}
            </p>
          )}
          
          <div className="text-xs text-gray-500">
            Created: {category.created_at ? new Date(category.created_at).toLocaleDateString() : 'N/A'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoriesTab;