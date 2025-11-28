import { Link } from 'react-router-dom';
import { Calendar, Tag, User } from 'lucide-react';
import { format } from 'date-fns';
import type { GalleryCardProps } from '../types'

const GalleryCard = ({ gallery }: GalleryCardProps) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  return (
    <Link to={`/gallery/${gallery.id}`}>
      <div className="card group cursor-pointer">
        <div className="relative overflow-hidden h-64">
          <img
            src={`${API_URL}${gallery.image_path}`}
            alt={gallery.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Rally+Car';
            }}
          />
          
          <div className="absolute top-3 right-3">
            <span className="bg-rally-red text-white text-xs font-bold px-3 py-1 rounded-full">
              {gallery.category_name}
            </span>
          </div>
        </div>

        <div className="p-5">
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rally-red transition-colors duration-200">
            {gallery.title}
          </h3>

          {gallery.car_model && (
            <p className="text-rally-amber font-semibold mb-1">
              {gallery.car_model}
            </p>
          )}
          
          {gallery.driver_name && (
            <div className="flex items-center text-gray-400 text-sm mb-3">
              <User className="w-4 h-4 mr-1" />
              <span>{gallery.driver_name}</span>
            </div>
          )}

          <p className="text-gray-300 text-sm mb-4 line-clamp-2">
            {gallery.description || 'No description available'}
          </p>

          <div className="flex items-center justify-between text-xs text-gray-400">
            <div className="flex items-center">
              <Tag className="w-3 h-3 mr-1" />
              <span>{gallery.category_type}</span>
            </div>
            
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>{format(new Date(gallery.created_at), 'MMM dd, yyyy')}</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default GalleryCard;