import { useState, type FormEvent, type ChangeEvent } from 'react';
import { X, Plus, Loader } from 'lucide-react';
import api from '../../api/axios';
import type { CreateCategoryData } from '../../types';

interface CreateCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const CreateCategoryModal = ({ isOpen, onClose, onSuccess }: CreateCategoryModalProps) => {
  const [categoryData, setCategoryData] = useState<CreateCategoryData>({
    name: '',
    type: 'year',
    description: '',
  });
  const [creating, setCreating] = useState<boolean>(false);

  const handleCategoryChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>): void => {
    const { name, value } = e.target;
    setCategoryData({ ...categoryData, [name]: value } as CreateCategoryData);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setCreating(true);

    try {
      const response = await api.post('/api/categories', categoryData);
      if (response.data.success) {
        alert('Category created successfully!');
        onSuccess();
        onClose();
        setCategoryData({ name: '', type: 'year', description: '' });
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create category');
    } finally {
      setCreating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-lg flex items-center justify-center z-50 p-4">
      <div className="bg-gradient-to-br from-gray-900 to-black border-2 border-blue-500/30 rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-2xl font-black text-white mb-2">NEW CATEGORY</h2>
              <p className="text-blue-400 font-semibold">Create rally classification</p>
            </div>
            <button
              onClick={onClose}
              className="p-3 hover:bg-gray-800 rounded-xl transition-colors"
            >
              <X className="w-6 h-6 text-gray-400 hover:text-white" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                disabled={creating}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl transition-all"
              >
                {creating ? 'CREATING...' : 'CREATE CATEGORY'}
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

export default CreateCategoryModal;