import { useState, useEffect } from 'react';
import type {FormEvent, ChangeEvent} from 'react'
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { ArrowLeft, Loader, Check, X, Upload as UploadIcon } from 'lucide-react';
import type { Gallery, Category, ApiResponse } from '../types';

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
      alert('Failed to load gallery');
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
        alert('✅ Gallery updated successfully!');
        navigate(`/gallery/${id}`);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to update gallery');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900">
        <div className="w-20 h-20 mb-4 relative">
          <div className="absolute inset-0 rounded-full border-t-4 border-r-4 border-red-600 animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-b-4 border-l-4 border-white animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
        <Loader className="w-12 h-12 text-red-600 animate-spin" />
        <p className="text-white font-bold text-xl mt-4 uppercase tracking-wider">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate(`/gallery/${id}`)}
            className="inline-flex items-center space-x-3 bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all mb-6 font-bold uppercase tracking-wide"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back</span>
          </button>

          <div className="bg-gradient-to-r from-red-600 to-red-800 p-6 rounded-lg shadow-2xl">
            <h1 className="text-5xl font-black text-white uppercase tracking-wider" style={{ fontFamily: 'Racing Sans One, Impact, sans-serif' }}>
              Edit Gallery
            </h1>
            <p className="text-white font-bold mt-2 uppercase tracking-wide">
              Update classic rally car details
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-red-600 to-red-800 h-2"></div>
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            {/* Current Image */}
            <div>
              <label className="block text-gray-800 font-bold uppercase tracking-wide mb-3 text-sm">
                Current Image
              </label>
              <div className="rounded-lg overflow-hidden shadow-lg">
                <img
                  src={previewImage || `${API_URL}${currentImage}`}
                  alt="Current"
                  className="w-full h-64 object-cover"
                />
              </div>
            </div>

            {/* New Image Upload */}
            <div>
              <label className="block text-gray-800 font-bold uppercase tracking-wide mb-3 text-sm">
                Upload New Image (Optional)
              </label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                  id="image-upload"
                />
                <label
                  htmlFor="image-upload"
                  className="flex items-center justify-center space-x-3 bg-gray-800 hover:bg-gray-700 text-white px-6 py-4 rounded-lg cursor-pointer transition-all font-bold uppercase tracking-wide"
                >
                  <UploadIcon className="w-5 h-5" />
                  <span>{newImage ? newImage.name : 'Choose New Image'}</span>
                </label>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-gray-800 font-bold uppercase tracking-wide mb-3 text-sm">
                Category *
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
              >
                <option value="">SELECT CATEGORY</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name} ({cat.type})
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className="block text-gray-800 font-bold uppercase tracking-wide mb-3 text-sm">
                Title *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                placeholder="E.G., AUDI QUATTRO S1 E2"
              />
            </div>

            {/* Car Model */}
            <div>
              <label className="block text-gray-800 font-bold uppercase tracking-wide mb-3 text-sm">
                Car Model
              </label>
              <input
                type="text"
                name="car_model"
                value={formData.car_model}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                placeholder="E.G., AUDI QUATTRO S1 E2"
              />
            </div>

            {/* Driver Name */}
            <div>
              <label className="block text-gray-800 font-bold uppercase tracking-wide mb-3 text-sm">
                Driver Name
              </label>
              <input
                type="text"
                name="driver_name"
                value={formData.driver_name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all"
                placeholder="E.G., MICHELE MOUTON"
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-gray-800 font-bold uppercase tracking-wide mb-3 text-sm">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-red-600 focus:border-transparent transition-all min-h-[150px]"
                placeholder="DESCRIBE THE LEGENDARY MACHINE..."
              />
            </div>

            {/* Racing Stripes Divider */}
            <div className="h-2 bg-gradient-to-r from-red-600 via-white to-red-600"></div>

            {/* Buttons */}
            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={updating}
                className="flex-1 flex items-center justify-center space-x-3 bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-bold py-4 rounded-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest"
              >
                {updating ? (
                  <>
                    <Loader className="w-6 h-6 animate-spin" />
                    <span>Updating...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-6 h-6" />
                    <span>Update Gallery</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => navigate(`/gallery/${id}`)}
                className="flex items-center justify-center space-x-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 px-8 rounded-lg shadow-lg hover:shadow-xl transition-all uppercase tracking-wide"
              >
                <X className="w-6 h-6" />
                <span>Cancel</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditGallery;