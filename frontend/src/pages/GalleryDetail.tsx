import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import CommentSection from '../components/CommentSection';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Calendar, Tag, User, Edit, Trash2, Loader, Heart } from 'lucide-react';
import { format } from 'date-fns';
import Swal from 'sweetalert2'; // Import SweetAlert2
import type { Gallery, ApiResponse } from '../types';

const GalleryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  
  // State Gallery Utama
  const [gallery, setGallery] = useState<Gallery | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [deleteLoading, setDeleteLoading] = useState<boolean>(false);
  
  // --- State Baru untuk Fitur Likes ---
  const [liked, setLiked] = useState<boolean>(false);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [likeLoading, setLikeLoading] = useState<boolean>(false);
  // ----------------------------------

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
        const data = response.data.data;
        setGallery(data);
        
        // Set state likes berdasarkan response dari backend
        setLiked(data.user_liked || false);
        setLikesCount(data.likes_count || 0);
      }
    } catch (error) {
      console.error('Failed to fetch gallery:', error);
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  // --- Handler Like ---
  const handleLike = async (): Promise<void> => {
    if (!user) {
      // Ganti alert jadi Swal
      Swal.fire({
        icon: 'warning',
        title: 'Login Required',
        text: 'Silakan login terlebih dahulu untuk menyukai foto ini.',
        background: '#111827',
        color: '#fff',
        confirmButtonColor: '#dc2626',
      });
      return;
    }
    if (likeLoading) return;

    setLikeLoading(true);
    
    // Optimistic UI Update
    const newLikedStatus = !liked;
    setLiked(newLikedStatus);
    setLikesCount(prev => newLikedStatus ? prev + 1 : prev - 1);

    try {
      await api.post(`/api/galleries/${id}/like`);
    } catch (error) {
      // Revert on error
      setLiked(!newLikedStatus);
      setLikesCount(prev => newLikedStatus ? prev - 1 : prev + 1);
      console.error('Failed to toggle like', error);
    } finally {
      setLikeLoading(false);
    }
  };
  // --------------------

  const handleDelete = async (): Promise<void> => {
    // Ganti confirm() jadi Swal.fire dengan option showCancelButton
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#4b5563', // gray-600
      confirmButtonText: 'Yes, delete it!',
      background: '#111827',
      color: '#fff',
    });

    if (!result.isConfirmed) return;

    setDeleteLoading(true);
    try {
      const response = await api.delete<ApiResponse>(`/api/galleries/${id}`);
      if (response.data.success) {
        // Success Alert
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Gallery has been deleted.',
          timer: 1500,
          showConfirmButton: false,
          background: '#111827',
          color: '#fff',
        });
        navigate('/');
      }
    } catch (error: any) {
      // Error Alert
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error.response?.data?.message || 'Failed to delete gallery',
        background: '#111827',
        color: '#fff',
        confirmButtonColor: '#dc2626',
      });
    } finally {
      setDeleteLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader className="w-12 h-12 text-rally-red animate-spin" />
      </div>
    );
  }

  if (!gallery) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold text-white mb-3">Gallery Not Found</h2>
          <p className="text-gray-400 mb-6">The requested gallery could not be found</p>
          <Link
            to="/"
            className="inline-flex items-center space-x-2 bg-rally-red hover:bg-red-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Galleries</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link
            to="/"
            className="inline-flex items-center space-x-2 text-gray-300 hover:text-rally-red transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Galleries</span>
          </Link>
        </div>

        {/* Main content grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Image section */}
          <div className="lg:col-span-2">
            <div className="relative group">
              <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl border border-gray-700">
                <div className="relative">
                  <img
                    src={`${API_URL}${gallery.image_path}`}
                    alt={gallery.title}
                    className="w-full h-auto"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/800x600?text=Rally+Car';
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Comment Section Component */}
            {id && (
              <div className="mt-8">
                <CommentSection galleryId={id} />
              </div>
            )}
          </div>

          {/* Info sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700 sticky top-8">
              <div className="relative z-10">
                <div className="inline-flex items-center bg-gradient-to-r from-rally-red to-red-700 text-white text-sm font-bold px-4 py-2 rounded-full mb-4 shadow-lg">
                  <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                  {gallery.category_name}
                </div>

                <h1 className="text-3xl font-bold text-white mb-4">
                  {gallery.title}
                </h1>

                {gallery.car_model && (
                  <div className="mb-4">
                    <h2 className="text-xl text-amber-400 font-semibold">
                      {gallery.car_model}
                    </h2>
                  </div>
                )}

                {gallery.driver_name && (
                  <div className="flex items-center space-x-2 text-gray-300 mb-6 bg-gray-700/30 rounded-lg p-3">
                    <User className="w-5 h-5 text-amber-400" />
                    <span className="text-lg">Driver: {gallery.driver_name}</span>
                  </div>
                )}

                {/* --- TOMBOL LIKE --- */}
                <div className="mb-6">
                  <button
                    onClick={handleLike}
                    disabled={likeLoading}
                    className={`
                      w-full flex items-center justify-between px-4 py-3 rounded-lg font-bold transition-all duration-300
                      hover:scale-[1.02] active:scale-95 border
                      ${liked 
                        ? 'bg-red-500/20 text-red-500 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)]' 
                        : 'bg-gray-700/50 text-gray-400 border-gray-600 hover:bg-gray-700 hover:text-white hover:border-gray-500'}
                    `}
                  >
                    <div className="flex items-center space-x-3">
                      <Heart 
                        className={`w-6 h-6 transition-transform duration-300 ${liked ? 'fill-rally-red text-rally-red scale-110' : ''}`} 
                      />
                      <span>{liked ? 'Liked' : 'Like This Photo'}</span>
                    </div>
                    <span className={`px-2 py-1 rounded-md text-sm font-bold ${liked ? 'bg-rally-red text-white' : 'bg-gray-600 text-gray-300'}`}>
                      {likesCount}
                    </span>
                  </button>
                </div>
                {/* -------------------- */}

                <div className="mb-6">
                  <p className="text-gray-300 leading-relaxed bg-gray-700/20 rounded-lg p-4">
                    {gallery.description || 'No description available'}
                  </p>
                </div>

                <div className="border-t border-gray-700 pt-6 space-y-3">
                  <div className="flex items-center justify-between text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Tag className="w-4 h-4 text-amber-400" />
                      <span>Type:</span>
                    </div>
                    <span className="text-white font-semibold capitalize">
                      {gallery.category_type}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-400">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-amber-400" />
                      <span>Uploaded by:</span>
                    </div>
                    <span className="text-white font-semibold">
                      {gallery.username}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-gray-400">
                    <div className="flex items-center space-x-2">
                      <Calendar className="w-4 h-4 text-amber-400" />
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
                        className="flex-1 flex items-center justify-center space-x-2 bg-amber-500 hover:bg-amber-600 text-gray-900 font-bold py-3 rounded-lg transition-all duration-300"
                      >
                        <Edit className="w-5 h-5" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={handleDelete}
                        disabled={deleteLoading}
                        className="flex-1 flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-700 text-white font-bold py-3 rounded-lg transition-all duration-300"
                      >
                        {deleteLoading ? (
                          <Loader className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <Trash2 className="w-5 h-5" />
                            <span>Delete</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GalleryDetail;