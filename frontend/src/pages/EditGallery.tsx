import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Loader, Check, X, Upload as UploadIcon } from 'lucide-react';
import type { Gallery, Category, ApiResponse } from '../types';
import Swal from 'sweetalert2'; // 1. Import SweetAlert2

const EditGallery = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState<boolean>(true);
  const [updating, setUpdating] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  
  const [formData, setFormData] = useState({
    category_id: '',
    title: '',
    car_model: '',
    driver_name: '',
    description: '',
  });
  
  const [currentImage, setCurrentImage] = useState<string>('');
  const [newImage, setNewImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async (): Promise<void> => {
    try {
      const [galleryRes, categoriesRes] = await Promise.all([
        api.get<ApiResponse<Gallery>>(`/api/galleries/${id}`),
        api.get<ApiResponse<Category[]>>('/api/categories')
      ]);

      if (galleryRes.data.success && galleryRes.data.data) {
        const gallery = galleryRes.data.data;
        setFormData({
          category_id: gallery.category_id.toString(),
          title: gallery.title,
          car_model: gallery.car_model || '',
          driver_name: gallery.driver_name || '',
          description: gallery.description || '',
        });
        setCurrentImage(gallery.image_path);
      }

      if (categoriesRes.data.success && categoriesRes.data.data) {
        setCategories(categoriesRes.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      // 2. Ganti alert jadi Swal.fire
      Swal.fire({
        icon: 'error',
        title: 'Failed to load',
        text: 'Gagal memuat data gallery. Kembali ke halaman admin...',
        background: '#111827', // gray-900
        color: '#fff',
        confirmButtonColor: '#dc2626', // red-600
      });
      navigate('/admin');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setNewImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setUpdating(true);

    const data = new FormData();
    data.append('category_id', formData.category_id);
    data.append('title', formData.title);
    data.append('car_model', formData.car_model);
    data.append('driver_name', formData.driver_name);
    data.append('description', formData.description);
    
    if (newImage) {
      data.append('image', newImage);
    }

    try {
      const response = await api.put<ApiResponse>(`/api/galleries/${id}`, data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        // 3. Success Alert
        Swal.fire({
          icon: 'success',
          title: 'Berhasil!',
          text: 'Data gallery berhasil diperbarui.',
          timer: 2000,
          showConfirmButton: false,
          background: '#111827',
          color: '#fff',
        });
        navigate(`/gallery/${id}`);
      }
    } catch (error: any) {
      // 4. Error Alert
      Swal.fire({
        icon: 'error',
        title: 'Update Gagal',
        text: error.response?.data?.message || 'Terjadi kesalahan saat mengupdate gallery.',
        background: '#111827',
        color: '#fff',
        confirmButtonColor: '#dc2626',
      });
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader className="w-12 h-12 text-rally-red animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        
        {/* Header & Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate(`/gallery/${id}`)}
            className="inline-flex items-center space-x-2 text-gray-300 hover:text-rally-red transition-all duration-300 group"
          >
            <ArrowLeft className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" />
            <span className="font-medium">Back to Gallery</span>
          </button>
          
          <div className="bg-gray-800 rounded-full px-4 py-2 border border-gray-700">
             <span className="text-gray-400 text-sm font-semibold">EDIT MODE</span>
          </div>
        </div>

        {/* Main Form Container */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-gray-800 rounded-xl p-6 sm:p-8 shadow-2xl border border-gray-700">
            
            {/* Form Header */}
            <div className="border-b border-gray-700 pb-6 mb-6">
              <h1 className="text-3xl font-bold text-white mb-2">Edit Gallery Details</h1>
              <p className="text-gray-400">Update information about this rally machine.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Image Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Current Image */}
                <div>
                  <label className="block text-gray-300 font-bold uppercase text-sm mb-3">
                    Current Image
                  </label>
                  <div className="rounded-lg overflow-hidden border border-gray-700 bg-gray-900/50">
                    <img
                      src={previewImage || `${API_URL}${currentImage}`}
                      alt="Current"
                      className="w-full h-48 object-cover"
                      onError={(e) => (e.currentTarget.src = 'https://via.placeholder.com/800x600?text=No+Image')}
                    />
                  </div>
                </div>

                {/* Upload New */}
                <div>
                  <label className="block text-gray-300 font-bold uppercase text-sm mb-3">
                    Replace Image (Optional)
                  </label>
                  <div className="relative h-full min-h-[192px] border-2 border-dashed border-gray-600 hover:border-rally-red bg-gray-700/30 rounded-lg flex flex-col items-center justify-center transition-colors">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      id="image-upload"
                    />
                    <label htmlFor="image-upload" className="cursor-pointer text-center p-4">
                      <UploadIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-300 text-sm font-medium">
                        {newImage ? newImage.name : 'Click to upload new image'}
                      </p>
                      <p className="text-gray-500 text-xs mt-1">JPG, PNG, GIF up to 5MB</p>
                    </label>
                  </div>
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-gray-300 font-bold uppercase text-sm mb-3">
                  Category <span className="text-rally-red">*</span>
                </label>
                <select
                  name="category_id"
                  value={formData.category_id}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white focus:ring-2 focus:ring-rally-red focus:border-transparent outline-none transition-all"
                >
                  <option value="" className="text-gray-400">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name} ({cat.type})
                    </option>
                  ))}
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="block text-gray-300 font-bold uppercase text-sm mb-3">
                  Title <span className="text-rally-red">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  required
                  placeholder="E.g., AUDI QUATTRO S1 E2"
                  className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-rally-red focus:border-transparent outline-none transition-all"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Car Model */}
                <div>
                  <label className="block text-gray-300 font-bold uppercase text-sm mb-3">
                    Car Model
                  </label>
                  <input
                    type="text"
                    name="car_model"
                    value={formData.car_model}
                    onChange={handleChange}
                    placeholder="E.g., AUDI QUATTRO S1"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-rally-red focus:border-transparent outline-none transition-all"
                  />
                </div>

                {/* Driver Name */}
                <div>
                  <label className="block text-gray-300 font-bold uppercase text-sm mb-3">
                    Driver Name
                  </label>
                  <input
                    type="text"
                    name="driver_name"
                    value={formData.driver_name}
                    onChange={handleChange}
                    placeholder="E.g., Michele Mouton"
                    className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-rally-red focus:border-transparent outline-none transition-all"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-gray-300 font-bold uppercase text-sm mb-3">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Describe the legendary machine..."
                  className="w-full px-4 py-3 rounded-lg bg-gray-700/50 border border-gray-600 text-white placeholder-gray-500 focus:ring-2 focus:ring-rally-red focus:border-transparent outline-none transition-all min-h-[120px]"
                />
              </div>

              {/* Action Buttons */}
              <div className="pt-6 border-t border-gray-700 flex space-x-4">
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 flex items-center justify-center space-x-2 bg-gradient-to-r from-rally-red to-red-700 hover:from-red-600 hover:to-red-800 text-white font-bold py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {updating ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5" />
                      <span>Update Gallery</span>
                    </>
                  )}
                </button>
                
                <button
                  type="button"
                  onClick={() => navigate(`/gallery/${id}`)}
                  className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg transition-all duration-300"
                >
                  <X className="w-5 h-5" />
                  <span>Cancel</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditGallery;