import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, Plus, Trash2, Image as ImageIcon, 
  Folder, Loader, X, Check, Settings,
  Trophy, Flag, Zap
} from 'lucide-react';
import type { Gallery, Category, ApiResponse, CreateGalleryData, CreateCategoryData } from '../types';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'galleries' | 'categories'>('galleries');
  
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loadingGalleries, setLoadingGalleries] = useState<boolean>(true);
  
  const [showUploadForm, setShowUploadForm] = useState<boolean>(false);
  const [uploadData, setUploadData] = useState<CreateGalleryData>({
    category_id: '',
    title: '',
    car_model: '',
    driver_name: '',
    description: '',
    image: null,
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const [showCategoryForm, setShowCategoryForm] = useState<boolean>(false);
  const [categoryData, setCategoryData] = useState<CreateCategoryData>({
    name: '',
    type: 'year',
    description: '',
  });
  const [creatingCategory, setCreatingCategory] = useState<boolean>(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // === LOGIC TETAP SAMA 100% ===
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    await Promise.all([fetchGalleries(), fetchCategories()]);
  };

  const fetchGalleries = async (): Promise<void> => {
    setLoadingGalleries(true);
    try {
      const response = await api.get<ApiResponse<Gallery[]>>('/api/galleries');
      if (response.data.success && response.data.data) {
        setGalleries(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch galleries:', error);
    } finally {
      setLoadingGalleries(false);
    }
  };

  const fetchCategories = async (): Promise<void> => {
    try {
      const response = await api.get<ApiResponse<Category[]>>('/api/categories');
      if (response.data.success && response.data.data) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const handleUploadChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setUploadData({ ...uploadData, [name]: value });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadData({ ...uploadData, image: file });
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleUploadSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setUploading(true);

    const formData = new FormData();
    formData.append('category_id', uploadData.category_id.toString());
    formData.append('title', uploadData.title);
    formData.append('car_model', uploadData.car_model || '');
    formData.append('driver_name', uploadData.driver_name || '');
    formData.append('description', uploadData.description || '');
    if (uploadData.image) {
      formData.append('image', uploadData.image);
    }

    try {
      const response = await api.post<ApiResponse>('/api/galleries', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        alert('Gallery uploaded successfully!');
        setShowUploadForm(false);
        setUploadData({
          category_id: '',
          title: '',
          car_model: '',
          driver_name: '',
          description: '',
          image: null,
        });
        setPreviewImage(null);
        fetchGalleries();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload gallery');
    } finally {
      setUploading(false);
    }
  };

  const handleDeleteGallery = async (id: number): Promise<void> => {
    if (!confirm('Are you sure you want to delete this gallery?')) return;

    try {
      const response = await api.delete<ApiResponse>(`/api/galleries/${id}`);
      if (response.data.success) {
        alert('Gallery deleted successfully');
        fetchGalleries();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete gallery');
    }
  };

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value } as CreateCategoryData);
  };

  const handleCategorySubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setCreatingCategory(true);

    try {
      const response = await api.post<ApiResponse>('/api/categories', categoryData);
      if (response.data.success) {
        alert('Category created successfully!');
        setShowCategoryForm(false);
        setCategoryData({ name: '', type: 'year', description: '' });
        fetchCategories();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create category');
    } finally {
      setCreatingCategory(false);
    }
  };

  const handleDeleteCategory = async (id: number): Promise<void> => {
    if (!confirm('Are you sure? This will delete all galleries in this category!')) return;

    try {
      const response = await api.delete<ApiResponse>(`/api/categories/${id}`);
      if (response.data.success) {
        alert('Category deleted successfully');
        fetchData();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete category');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 overflow-x-hidden">
      {/* Animated Speed Lines Background */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 speed-line" />
        <div className="absolute top-1/4 left-0 w-full h-1 bg-red-500 speed-line" />
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 speed-line animation-delay-1000" />
        <div className="absolute top-3/4 left-0 w-full h-1 bg-red-500 speed-line animation-delay-2000" />
      </div>

      {/* Rally Flare Effects */}
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-600 rounded-full blur-3xl -translate-y-1/2" />
        <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-600 rounded-full blur-3xl translate-y-1/2" />
      </div>

      <div className="mt-19 container-custom relative z-10">
        {/* Header - Rally Pit Wall Style */}
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
              <span className="text-sm font-bold text-white">{galleries.length} GALLERIES</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 rounded-full">
              <Flag className="w-4 h-4 text-green-500" />
              <span className="text-sm font-bold text-white">{categories.length} CATEGORIES</span>
            </div>
          </div>
        </div>

        {/* Navigation Tabs - Racing Style */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 bg-gray-800/50 backdrop-blur-sm rounded-2xl p-2 border border-gray-700">
            {(['galleries', 'categories'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center gap-3 px-6 py-4 rounded-xl font-bold text-lg transition-all duration-300 flex-1 min-w-[200px] justify-center ${
                  activeTab === tab
                    ? 'bg-red-600 text-white shadow-lg shadow-red-600/25'
                    : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                }`}
              >
                {tab === 'galleries' ? (
                  <ImageIcon className="w-6 h-6" />
                ) : (
                  <Folder className="w-6 h-6" />
                )}
                <span className="uppercase tracking-wider">
                  {tab} ({tab === 'galleries' ? galleries.length : categories.length})
                </span>
                {activeTab === tab && <Zap className="w-4 h-4 ml-1" />}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mb-8 flex justify-center lg:justify-start">
          {activeTab === 'galleries' ? (
            <button
              onClick={() => setShowUploadForm(true)}
              className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-red-500/50 flex items-center gap-3"
            >
              <Upload className="w-5 h-5" />
              <span className="uppercase tracking-wider">Upload New Gallery</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          ) : (
            <button
              onClick={() => setShowCategoryForm(true)}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50 flex items-center gap-3"
            >
              <Plus className="w-5 h-5" />
              <span className="uppercase tracking-wider">Create New Category</span>
            </button>
          )}
        </div>

        {/* GALLERIES TAB CONTENT */}
        {activeTab === 'galleries' && (
          <div>
            {loadingGalleries ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-600"></div>
              </div>
            ) : galleries.length === 0 ? (
              <div className="text-center py-20 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700">
                <ImageIcon className="w-20 h-20 text-gray-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No Galleries Found</h3>
                <p className="text-gray-400 mb-6">Start by uploading your first rally gallery</p>
                <button
                  onClick={() => setShowUploadForm(true)}
                  className="btn-primary"
                >
                  Upload First Gallery
                </button>
              </div>
            ) : (
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
                      <div className="flex gap-2 mt-4">
                        <button
                          onClick={() => navigate(`/gallery/${gallery.id}`)}
                          className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm font-semibold transition-colors"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteGallery(gallery.id)}
                          className="p-2 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* CATEGORIES TAB CONTENT */}
        {activeTab === 'categories' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="group bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 hover:border-blue-500/50 transition-all duration-300"
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
                      onClick={() => handleDeleteCategory(category.id)}
                      className="opacity-0 group-hover:opacity-100 p-2 bg-red-600/20 hover:bg-red-600 rounded-lg text-red-400 hover:text-white transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {category.description && (
                    <p className="text-gray-400 text-sm line-clamp-2">
                      {category.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* UPLOAD GALLERY MODAL */}
        {showUploadForm && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-500/30 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-3xl font-black text-white mb-2">UPLOAD GALLERY</h2>
                    <p className="text-red-400 font-semibold">Add new rally car to the collection</p>
                  </div>
                  <button
                    onClick={() => setShowUploadForm(false)}
                    className="p-3 hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400 hover:text-white" />
                  </button>
                </div>

                <form onSubmit={handleUploadSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Image Upload */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
                        Rally Car Image *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border-2 border-dashed border-gray-600 rounded-xl text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-red-600 file:text-white file:font-bold hover:file:bg-red-500 transition-colors"
                      />
                      {previewImage && (
                        <div className="mt-4">
                          <img
                            src={previewImage}
                            alt="Preview"
                            className="rounded-xl max-h-64 w-full object-cover border-2 border-red-500/30"
                          />
                        </div>
                      )}
                    </div>

                    {/* Category */}
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
                        Category *
                      </label>
                      <select
                        name="category_id"
                        value={uploadData.category_id}
                        onChange={handleUploadChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} ({cat.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Title */}
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
                        Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={uploadData.title}
                        onChange={handleUploadChange}
                        required
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        placeholder="Toyota GR Yaris Rally1"
                      />
                    </div>

                    {/* Car Model */}
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
                        Car Model
                      </label>
                      <input
                        type="text"
                        name="car_model"
                        value={uploadData.car_model}
                        onChange={handleUploadChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        placeholder="Toyota GR Yaris"
                      />
                    </div>

                    {/* Driver Name */}
                    <div>
                      <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
                        Driver Name
                      </label>
                      <input
                        type="text"
                        name="driver_name"
                        value={uploadData.driver_name}
                        onChange={handleUploadChange}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20"
                        placeholder="Sébastien Ogier"
                      />
                    </div>

                    {/* Description */}
                    <div className="lg:col-span-2">
                      <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={uploadData.description}
                        onChange={handleUploadChange}
                        rows={4}
                        className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-red-500 focus:ring-2 focus:ring-red-500/20 resize-none"
                        placeholder="Describe this rally beast..."
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-6">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-3"
                    >
                      {uploading ? (
                        <>
                          <Loader className="w-5 h-5 animate-spin" />
                          <span>UPLOADING...</span>
                        </>
                      ) : (
                        <>
                          <Check className="w-5 h-5" />
                          <span>DEPLOY GALLERY</span>
                        </>
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowUploadForm(false)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl transition-all"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* CREATE CATEGORY MODAL */}
        {showCategoryForm && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-4">
            <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-blue-500/30 rounded-2xl shadow-2xl w-full max-w-md">
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <h2 className="text-2xl font-black text-white mb-2">NEW CATEGORY</h2>
                    <p className="text-blue-400 font-semibold">Create rally classification</p>
                  </div>
                  <button
                    onClick={() => setShowCategoryForm(false)}
                    className="p-3 hover:bg-gray-800 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6 text-gray-400 hover:text-white" />
                  </button>
                </div>

                <form onSubmit={handleCategorySubmit} className="space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
                      Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={categoryData.name}
                      onChange={handleCategoryChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                      placeholder="Rally 2024"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
                      Type *
                    </label>
                    <select
                      name="type"
                      value={categoryData.type}
                      onChange={handleCategoryChange}
                      required
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                    >
                      <option value="year">Year</option>
                      <option value="class">Class</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-300 mb-3 uppercase tracking-wide">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={categoryData.description}
                      onChange={handleCategoryChange}
                      rows={3}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
                      placeholder="Category description..."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="submit"
                      disabled={creatingCategory}
                      className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all"
                    >
                      {creatingCategory ? 'CREATING...' : 'CREATE CATEGORY'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCategoryForm(false)}
                      className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl transition-all"
                    >
                      CANCEL
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;