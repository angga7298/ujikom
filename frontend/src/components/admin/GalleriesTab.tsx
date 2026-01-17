import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImageIcon, Trash2, Eye, Upload } from 'lucide-react';
import type { Gallery } from '../../types';

interface GalleriesTabProps {
  galleries: Gallery[];
  loading: boolean;
  onDelete: (id: number) => Promise<void>;
  onRefresh: () => Promise<void>;
  onUploadClick: () => void;
}

const GalleriesTab = ({ galleries, loading, onDelete, onRefresh, onUploadClick }: GalleriesTabProps) => {
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (galleries.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700">
        <ImageIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">No Galleries Found</h3>
        <p className="text-gray-400 mb-6">Start by uploading your first rally gallery</p>
        <button
          onClick={onUploadClick}
          className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-red-500/50 flex items-center gap-3 mx-auto"
        >
          <Upload className="w-5 h-5" />
          <span className="uppercase tracking-wider">Upload First Gallery</span>
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {galleries.map((gallery) => (
        <div
          key={gallery.id}
          className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl overflow-hidden hover:border-red-500/50 transition-all duration-300 hover:shadow-2xl hover:shadow-red-500/20"
        >
          <div className="relative h-48 overflow-hidden">
            <img
              src={`${API_URL}${gallery.image_path}`}
              alt={gallery.title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300/111827/DC2626?text=RALLY+CAR';
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            <div className="absolute top-3 right-3">
              <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide">
                {gallery.category_name}
              </span>
            </div>
          </div>
          
          <div className="p-4">
            <h3 className="font-bold text-white text-lg mb-2 line-clamp-2">
              {gallery.title}
            </h3>
            {gallery.car_model && (
              <p className="text-orange-400 text-sm font-semibold mb-2">
                {gallery.car_model}
              </p>
            )}
            <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
              <span>By: {gallery.username}</span>
              <span>{new Date(gallery.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate(`/gallery/${gallery.id}`)}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              >
                <Eye className="w-4 h-4" />
                View
              </button>
              <button
                onClick={() => onDelete(gallery.id)}
                className="p-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GalleriesTab;