import { useState, useEffect } from 'react';
import type { ChangeEvent } from 'react';
import api from '../api/axios';
import GalleryCard from '../components/GalleryCard';
import { Search, Filter, Grid, Loader, ChevronDown } from 'lucide-react';
import type { Gallery, Category, ApiResponse } from '../types';
import Slider from '../components/Slider';
import '../App.css';

const Home = () => {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | number>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [categoryType, setCategoryType] = useState<'all' | 'year' | 'class'>('all');
  const [isFiltersOpen, setIsFiltersOpen] = useState<boolean>(true);

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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-rally-red/5 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-rally-amber/5 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/3 rounded-full blur-3xl"></div>
      </div>

      <div className="container-custom relative z-10">
        {/* Header */}
          <Slider/>
        {/* Filters Section */}
        <div className="mt-8 lg:mt-12 bg-gray-900/70 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-gray-700/50 shadow-2xl shadow-black/50">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-rally-red/10 rounded-lg">
                <Filter className="w-5 h-5 text-rally-red" />
              </div>
              <h2 className="text-xl font-bold text-white">Filters & Search</h2>
            </div>
            <button
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            >
              <ChevronDown 
                className={`w-5 h-5 text-gray-400 transition-transform ${isFiltersOpen ? 'rotate-180' : ''}`} 
              />
            </button>
          </div>

          {/* Collapsible Content */}
          {isFiltersOpen && (
            <div className="space-y-6">
              {/* Search and Category Type */}
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center">
                {/* Search */}
                <div className="flex-1 w-full">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-rally-red/20 to-rally-amber/20 rounded-xl blur-sm group-hover:blur-md transition-all duration-300"></div>
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input
                        type="text"
                        placeholder="Search by car model, driver name, or title..."
                        value={searchQuery}
                        onChange={(e: ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
                        className="input-field pl-12 w-full bg-gray-800/80 border-gray-600/50 focus:border-rally-red/50 focus:bg-gray-800 transition-all duration-300"
                      />
                    </div>
                  </div>
                </div>

                {/* Category Type Buttons */}
                <div className="flex gap-2 bg-gray-800/50 rounded-xl p-1 border border-gray-700/50">
                  <button
                    onClick={() => setCategoryType('all')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      categoryType === 'all'
                        ? 'bg-gradient-to-r from-rally-red to-rally-amber text-white shadow-lg shadow-rally-red/20'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => setCategoryType('year')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      categoryType === 'year'
                        ? 'bg-gradient-to-r from-rally-red to-rally-amber text-white shadow-lg shadow-rally-red/20'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    By Year
                  </button>
                  <button
                    onClick={() => setCategoryType('class')}
                    className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                      categoryType === 'class'
                        ? 'bg-gradient-to-r from-rally-red to-rally-amber text-white shadow-lg shadow-rally-red/20'
                        : 'text-gray-400 hover:text-white hover:bg-gray-700/50'
                    }`}
                  >
                    By Class
                  </button>
                </div>
              </div>

              {/* Category Filter */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-1 h-6 bg-gradient-to-b from-rally-red to-rally-amber rounded-full"></div>
                  <span className="text-gray-300 font-bold text-lg">Filter by Category</span>
                </div>
                
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedCategory('all')}
                    className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 border ${
                      selectedCategory === 'all'
                        ? 'bg-gradient-to-r from-rally-red to-rally-amber text-white shadow-lg shadow-rally-red/30 border-transparent'
                        : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/70 border-gray-600/30 hover:border-rally-red/30'
                    }`}
                  >
                    All Categories
                  </button>

                  {(categoryType === 'all' || categoryType === 'year') &&
                    yearCategories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 border ${
                          selectedCategory === category.id
                            ? 'bg-gradient-to-r from-rally-amber to-yellow-400 text-gray-900 shadow-lg shadow-amber-500/30 border-transparent'
                            : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/70 border-gray-600/30 hover:border-amber-400/30'
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
                        className={`px-5 py-2.5 rounded-full font-semibold transition-all duration-300 border ${
                          selectedCategory === category.id
                            ? 'bg-gradient-to-r from-rally-red to-pink-500 text-white shadow-lg shadow-rally-red/30 border-transparent'
                            : 'bg-gray-800/50 text-gray-400 hover:text-white hover:bg-gray-700/70 border-gray-600/30 hover:border-rally-red/30'
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="text-center">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-rally-red/20 rounded-full"></div>
                <Loader className="w-16 h-16 text-rally-red animate-spin absolute top-0 left-0" />
              </div>
              <p className="text-gray-400 mt-4 text-lg">Loading rally legends...</p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-8 bg-gradient-to-b from-rally-red to-rally-amber rounded-full"></div>
                <p className="text-gray-300 text-lg">
                  Showing <span className="text-white font-bold text-xl">{filteredGalleries.length}</span> rally cars
                </p>
              </div>
            </div>

            {filteredGalleries.length === 0 ? (
              <div className="text-center py-20 bg-gray-900/50 backdrop-blur-sm rounded-2xl border border-gray-700/30 shadow-xl">
                <div className="relative inline-block mb-4">
                  <Grid className="w-20 h-20 text-gray-600/50" />
                  <div className="absolute inset-0 bg-gradient-to-br from-rally-red/10 to-rally-amber/10 rounded-full blur-xl"></div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">No Galleries Found</h3>
                <p className="text-gray-400 text-lg">
                  {searchQuery || selectedCategory !== 'all' 
                    ? 'Try adjusting your search criteria or filters' 
                    : 'The rally gallery is being prepared...'}
                </p>
              </div>
            ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
  {filteredGalleries.map((gallery, index) => (
    <div 
      key={gallery.id}
      className="opacity-0 animate-fade-in-up"
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'forwards'
      }}
    >
      <GalleryCard gallery={gallery} />
    </div>
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