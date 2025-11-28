import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import CommentSection from '../components/CommentSection';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Calendar, Tag, User, Edit, Trash2, Loader } from 'lucide-react';
import { format } from 'date-fns';
import type { Gallery, ApiResponse } from '../types';

const GalleryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    if (id) {
      fetchGallery();
    }
  }, [id]);

  const fetchGallery = async (): Promise<void> => {
    try {
      const response = await api.get<ApiResponse<Gallery>>(`/api/galleries/${id}`);
      if (response.data.success && response.data.data) {
        setGallery(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
      alert('Gallery not found');
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (): Promise<void> => {
    if (!confirm('Are you sure you want to delete this gallery?')) return;

    try {
      const response = await api.delete<ApiResponse>(`/api/galleries/${id}`);
      if (response.data.success) {
        alert('Gallery deleted successfully');
        navigate('/');
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete gallery');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-12 h-12 text-rally-red animate-spin" />
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-400">Gallery not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container-custom">
        <Link
          to="/"
          className="inline-flex items-center space-x-2 text-rally-light hover:text-rally-red transition-colors mb-6"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Gallery</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-rally-gray rounded-lg overflow-hidden shadow-2xl">
            <img
              src={`${API_URL}${gallery.image_path}`}
              alt={gallery.title}
              className="w-full h-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Rally+Car';
              }}
            />
          </div>

          <div>
            <div className="bg-rally-gray rounded-lg p-8">
              <div className="inline-block bg-rally-red text-white text-sm font-bold px-4 py-2 rounded-full mb-4">
                {gallery.category_name}
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">
                {gallery.title}
              </h1>

              {gallery.car_model && (
                <div className="mb-4">
                  <h2 className="text-2xl text-rally-amber font-semibold">
                    {gallery.car_model}
                  </h2>
                </div>
              )}

              {gallery.driver_name && (
                <div className="flex items-center space-x-2 text-gray-300 mb-6">
                  <User className="w-5 h-5" />
                  <span className="text-lg">Driver: {gallery.driver_name}</span>
                </div>
              )}

              <div className="mb-6">
                <p className="text-gray-300 text-lg leading-relaxed">
                  {gallery.description || 'No description available'}
                </p>
              </div>

              <div className="border-t border-gray-700 pt-6 space-y-3">
                <div className="flex items-center justify-between text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Tag className="w-4 h-4" />
                    <span>Type:</span>
                  </div>
                  <span className="text-white font-semibold capitalize">
                    {gallery.category_type}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-400">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span>Uploaded by:</span>
                  </div>
                  <span className="text-white font-semibold">
                    {gallery.username}
                  </span>
                </div>

                <div className="flex items-center justify-between text-gray-400">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Date:</span>
                  </div>
                  <span className="text-white font-semibold">
                    {format(new Date(gallery.created_at), 'MMMM dd, yyyy')}
                  </span>
                </div>
              </div>

              {isAdmin() && (
                <div className="border-t border-gray-700 pt-6 mt-6">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate(`/admin/edit/${gallery.id}`)}
                      className="flex-1 flex items-center justify-center space-x-2 bg-rally-amber hover:bg-yellow-500 text-rally-dark font-bold py-3 rounded-lg transition-colors"
                    >
                      <Edit className="w-5 h-5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={handleDelete}
                      className="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <CommentSection galleryId={id!} />
      </div>
    </div>
  );
};

export default GalleryDetail;