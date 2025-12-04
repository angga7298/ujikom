import { Link } from 'react-router-dom';
import { Calendar, Tag, User, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import type { GalleryCardProps } from '../types'

const GalleryCard = ({ gallery }: GalleryCardProps) => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  return (
    <Link to={`/gallery/${gallery.id}`}>
      <div className="group cursor-pointer">
        {/* Main Card Container */}
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-900 border border-gray-800 rounded-xl overflow-hidden hover:border-rally-red/50 hover:shadow-[0_0_30px_rgba(220,38,38,0.2)] transition-all duration-300 hover:-translate-y-1">
          
          {/* Image Section */}
          <div className="relative overflow-hidden h-64">
            <img
              src={`${API_URL}${gallery.image_path}`}
              alt={gallery.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1566474761653-b9e3ca1d5c2a?w=800&auto=format&fit=crop';
              }}
            />
            
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
            
            {/* Category Badge */}
            <div className="absolute top-4 right-4">
              <span className="bg-gradient-to-r from-rally-red to-red-700 text-white text-xs font-black px-4 py-1.5 rounded-full uppercase tracking-wider shadow-lg shadow-rally-red/30">
                {gallery.category_name}
              </span>
            </div>
            
            {/* View Details Overlay */}
            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <div className="flex items-center space-x-2 text-white font-bold text-sm uppercase tracking-wider">
                <span>VIEW DETAILS</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Content Section */}
          <div className="p-6">
            {/* Title */}
            <h3 className="text-xl font-black text-white mb-3 group-hover:text-rally-red transition-colors duration-200">
              {gallery.title}
            </h3>

            {/* Car Model with Icon */}
            {gallery.car_model && (
              <div className="flex items-center mb-3">
                <div className="w-8 h-8 bg-rally-red/20 rounded-lg flex items-center justify-center mr-3">
                  <svg className="w-4 h-4 text-rally-red" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                  </svg>
                </div>
                <p className="text-rally-amber font-bold text-lg">
                  {gallery.car_model}
                </p>
              </div>
            )}
            
            {/* Driver Info */}
            {gallery.driver_name && (
              <div className="flex items-center text-gray-300 text-sm mb-4">
                <div className="flex items-center bg-gray-800/50 px-3 py-1.5 rounded-lg">
                  <User className="w-4 h-4 mr-2 text-gray-400" />
                  <span className="font-medium">{gallery.driver_name}</span>
                </div>
              </div>
            )}

            {/* Description */}
            <p className="text-gray-300 text-sm mb-6 line-clamp-2 leading-relaxed">
              {gallery.description || 'Experience the thrill of rally racing at its finest.'}
            </p>

            {/* Footer Info */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-800">
              {/* Category Type */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-gray-400 text-xs">
                  <Tag className="w-3 h-3 mr-1.5" />
                  <span className="uppercase tracking-wider">{gallery.category_type}</span>
                </div>
                
                {/* Optional Location */}
              
              </div>
              
              {/* Date */}
              <div className="flex items-center text-gray-500 text-xs">
                <Calendar className="w-3 h-3 mr-1.5" />
                <span className="uppercase tracking-wider">
                  {format(new Date(gallery.created_at), 'MMM dd, yyyy')}
                </span>
              </div>
            </div>

            {/* Progress Bar (Optional Visual) */}
            <div className="mt-4">
              <div className="h-1 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full w-1/2 bg-gradient-to-r from-rally-red to-red-600"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};      

export default GalleryCard;