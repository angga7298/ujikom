import { useState, type FormEvent, type ChangeEvent } from 'react';
import { Upload, X, Check, Loader } from 'lucide-react';
import api from '../../api/axios';
import type { Category, CreateGalleryData } from '../../types';

interface UploadGalleryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSuccess: () => void;
}

const UploadGalleryModal = ({ isOpen, onClose, categories, onSuccess }: UploadGalleryModalProps) => {
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
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
      const response = await api.post('/api/galleries', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        alert('Gallery uploaded successfully!');
        onSuccess();
        onClose();
        setUploadData({
          category_id: '',
          title: '',
          car_model: '',
          driver_name: '',
          description: '',
          image: null,
        });
        setPreviewImage(null);
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to upload gallery');
    } finally {
      setUploading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-red-500/30 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-3xl font-black text-white mb-2">UPLOAD GALLERY</h2>
              <p className="text-red-400 font-semibold">Add new rally car to the collection</p>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-gray-800 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                onClick={onClose}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white font-bold py-4 rounded-xl transition-all"
              >
                CANCEL
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UploadGalleryModal;