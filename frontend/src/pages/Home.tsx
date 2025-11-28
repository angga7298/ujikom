import { useState, useEffect, } from 'react';
import type { ChangeEvent } from 'react';
import api from '../api/axios';
import GalleryCard from '../components/GalleryCard';
import { Search, Filter, Loader } from 'lucide-react';
import type { Gallery, Category, ApiResponse } from '../types';

const Home = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | number>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryType, setCategoryType] = useState<'all' | 'year' | 'class'>('all');

  useEffect(() => {
    fetchCategories();
    fetchGalleries();
  }, [selectedCategory]);

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

  const fetchGalleries = async (): Promise<void> => {
    setLoading(true);
    try {
      let url = '/api/galleries';
      if (selectedCategory !== 'all') {
        url += `?category_id=${selectedCategory}`;
      }
      
      const response = await api.get<ApiResponse<Gallery[]>>(url);
      if (response.data.success && response.data.data) {
        setGalleries(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch galleries:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredGalleries = galleries.filter((gallery) => {
    const matchesSearch = 
      gallery.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gallery.car_model?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      gallery.driver_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategoryType = 
      categoryType === 'all' || 
      gallery.category_type === categoryType;
    
    return matchesSearch && matchesCategoryType;
  });

  const yearCategories = categories.filter(cat => cat.type === 'year');
  const classCategories = categories.filter(cat => cat.type === 'class');

  return (
    <div className="min-h-screen">
      <div className="bg-gradient-to-r from-rally-red to-red-800 py-16">
        <div className="container-custom">
          <h1 className="text-5xl font-bold text-white mb-4">
            Rally Gallery
          </h1>
          <p className="text-xl text-gray-200">
            Explore the most iconic rally cars from different eras and championships
          </p>
        </div>
      </div>

      <div className="container-custom py-8">
        <div className="bg-rally-gray rounded-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by car, driver, or title..."
                value={searchQuery}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                className="input-field pl-10"
              />
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => setCategoryType('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  categoryType === 'all'
                    ? 'bg-rally-red text-white'
                    : 'bg-rally-dark text-gray-400 hover:bg-gray-700'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setCategoryType('year')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  categoryType === 'year'
                    ? 'bg-rally-red text-white'
                    : 'bg-rally-dark text-gray-400 hover:bg-gray-700'
                }`}
              >
                By Year
              </button>
              <button
                onClick={() => setCategoryType('class')}
                className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                  categoryType === 'class'
                    ? 'bg-rally-red text-white'
                    : 'bg-rally-dark text-gray-400 hover:bg-gray-700'
                }`}
              >
                By Class
              </button>
            </div>
          </div>

          <div className="mt-4">
            <div className="flex items-center space-x-2 mb-3">
              <Filter className="w-5 h-5 text-gray-400" />
              <span className="text-gray-400 font-semibold">Filter by category:</span>
            </div>
            
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-rally-red text-white'
                    : 'bg-rally-dark text-gray-400 hover:bg-gray-700'
                }`}
              >
                All Categories
              </button>

              {(categoryType === 'all' || categoryType === 'year') &&
                yearCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-rally-amber text-rally-dark'
                        : 'bg-rally-dark text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}

              {(categoryType === 'all' || categoryType === 'class') &&
                classCategories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-colors ${
                      selectedCategory === category.id
                        ? 'bg-rally-red text-white'
                        : 'bg-rally-dark text-gray-400 hover:bg-gray-700'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader className="w-12 h-12 text-rally-red animate-spin" />
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-400">
                Found <span className="text-white font-bold">{filteredGalleries.length}</span> rally cars
              </p>
            </div>

            {filteredGalleries.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-400">
                  No galleries found. Try adjusting your filters.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredGalleries.map((gallery) => (
                  <GalleryCard key={gallery.id} gallery={gallery} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;