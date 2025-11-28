import { useState, useEffect, } from 'react';
import type { FormEvent, ChangeEvent } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, Plus, Trash2, Image as ImageIcon, 
  Folder, Loader, X, Check 
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
    <div className="min-h-screen py-8">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage galleries and categories</p>
        </div>

        <div className="flex space-x-4 mb-6 border-b border-gray-700">
          <button
            onClick={() => setActiveTab('galleries')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'galleries'
                ? 'text-rally-red border-b-2 border-rally-red'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <ImageIcon className="w-5 h-5" />
              <span>Galleries ({galleries.length})</span>
            </div>
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-4 px-4 font-semibold transition-colors ${
              activeTab === 'categories'
                ? 'text-rally-red border-b-2 border-rally-red'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            <div className="flex items-center space-x-2">
              <Folder className="w-5 h-5" />
              <span>Categories ({categories.length})</span>
            </div>
          </button>
        </div>

        {activeTab === 'galleries' && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => setShowUploadForm(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Upload className="w-5 h-5" />
                <span>Upload New Gallery</span>
              </button>
            </div>

            {showUploadForm && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-rally-gray rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Upload Gallery</h2>
                    <button
                      onClick={() => setShowUploadForm(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleUploadSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Image *
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        required
                        className="input-field"
                      />
                      {previewImage && (
                        <img
                          src={previewImage}
                          alt="Preview"
                          className="mt-3 rounded-lg max-h-48 object-cover"
                        />
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Category *
                      </label>
                      <select
                        name="category_id"
                        value={uploadData.category_id}
                        onChange={handleUploadChange}
                        required
                        className="input-field"
                      >
                        <option value="">Select Category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name} ({cat.type})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Title *
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={uploadData.title}
                        onChange={handleUploadChange}
                        required
                        className="input-field"
                        placeholder="e.g., Toyota GR Yaris Rally1"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Car Model
                      </label>
                      <input
                        type="text"
                        name="car_model"
                        value={uploadData.car_model}
                        onChange={handleUploadChange}
                        className="input-field"
                        placeholder="e.g., Toyota GR Yaris"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Driver Name
                      </label>
                      <input
                        type="text"
                        name="driver_name"
                        value={uploadData.driver_name}
                        onChange={handleUploadChange}
                        className="input-field"
                        placeholder="e.g., Sébastien Ogier"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={uploadData.description}
                        onChange={handleUploadChange}
                        className="input-field min-h-[100px]"
                        placeholder="Describe the rally car..."
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        disabled={uploading}
                        className="flex-1 btn-primary disabled:opacity-50"
                      >
                        {uploading ? (
                          <span className="flex items-center justify-center space-x-2">
                            <Loader className="w-5 h-5 animate-spin" />
                            <span>Uploading...</span>
                          </span>
                        ) : (
                          <span className="flex items-center justify-center space-x-2">
                            <Check className="w-5 h-5" />
                            <span>Upload</span>
                          </span>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowUploadForm(false)}
                        className="flex-1 btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {loadingGalleries ? (
              <div className="flex justify-center py-12">
                <Loader className="w-12 h-12 text-rally-red animate-spin" />
              </div>
            ) : galleries.length === 0 ? (
              <div className="text-center py-12 bg-rally-gray rounded-lg">
                <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">No galleries yet. Upload your first one!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {galleries.map((gallery) => (
                  <div key={gallery.id} className="card">
                    <div className="relative h-48">
                      <img
                        src={`${API_URL}${gallery.image_path}`}
                        alt={gallery.title}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x300?text=Rally+Car';
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-bold text-white mb-2">{gallery.title}</h3>
                      <p className="text-sm text-gray-400 mb-4">{gallery.category_name}</p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => navigate(`/gallery/${gallery.id}`)}
                          className="flex-1 btn-secondary py-2 text-sm"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteGallery(gallery.id)}
                          className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition-colors"
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

        {activeTab === 'categories' && (
          <div>
            <div className="mb-6">
              <button
                onClick={() => setShowCategoryForm(true)}
                className="btn-primary flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Add New Category</span>
              </button>
            </div>

            {showCategoryForm && (
              <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
                <div className="bg-rally-gray rounded-lg max-w-md w-full p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-white">Add Category</h2>
                    <button
                      onClick={() => setShowCategoryForm(false)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-6 h-6" />
                    </button>
                  </div>

                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={categoryData.name}
                        onChange={handleCategoryChange}
                        required
                        className="input-field"
                        placeholder="e.g., Rally 2024"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Type *
                      </label>
                      <select
                        name="type"
                        value={categoryData.type}
                        onChange={handleCategoryChange}
                        required
                        className="input-field"
                      >
                        <option value="year">Year</option>
                        <option value="class">Class</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-300 mb-2">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={categoryData.description}
                        onChange={handleCategoryChange}
                        className="input-field min-h-[80px]"
                        placeholder="Category description..."
                      />
                    </div>

                    <div className="flex space-x-3 pt-4">
                      <button
                        type="submit"
                        disabled={creatingCategory}
                        className="flex-1 btn-primary disabled:opacity-50"
                      >
                        {creatingCategory ? 'Creating...' : 'Create'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowCategoryForm(false)}
                        className="flex-1 btn-secondary"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="bg-rally-gray rounded-lg p-4 flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-bold text-white">{category.name}</h3>
                    <p className="text-sm text-gray-400 capitalize">{category.type}</p>
                    {category.description && (
                      <p className="text-xs text-gray-500 mt-1">{category.description}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDeleteCategory(category.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;