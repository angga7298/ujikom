import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Settings, Trophy, Flag, Users, Activity, MessageSquare 
} from 'lucide-react';
import type { Gallery, Category, User } from '../types';
import Swal from 'sweetalert2';

// Import Components
import AdminHeader from '../components/admin/AdminHeader';
import AdminTabs from '../components/admin/AdminTabs';
import GalleriesTab from '../components/admin/GalleriesTab';
import CategoriesTab from '../components/admin/CategoriesTab';
import UsersTab from '../components/admin/UsersTab';
import StatsTab from '../components/admin/StatsTab';
import CommentsTab from '../components/admin/CommentsTab';
import UploadGalleryModal from '../components/admin/UploadGalleryModal';
import CreateCategoryModal from '../components/admin/CreateCategoryModal';

// Tipe Comment (Internal)
type Comment = {
  id: number;
  comment_text: string;
  created_at: string;
  username: string;
  gallery_title: string;
  gallery_id: number;
};

const AdminDashboard = () => {
  // PERBAIKAN ERROR: Tambahin 'comments' ke dalam type useState
  const [activeTab, setActiveTab] = useState<'galleries' | 'categories' | 'users' | 'stats' | 'comments'>('galleries');
  
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [comments, setComments] = useState<Comment[]>([]); // State Baru
  
  const [loadingGalleries, setLoadingGalleries] = useState<boolean>(true);
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [loadingStats, setLoadingStats] = useState<boolean>(false);
  const [loadingComments, setLoadingComments] = useState<boolean>(false); // Loading Baru
  
  const [stats, setStats] = useState({
    totalGalleries: 0,
    totalCategories: 0,
    totalUsers: 0,
    totalComments: 0,
  });
  
  const [showUploadForm, setShowUploadForm] = useState<boolean>(false);
  const [showCategoryForm, setShowCategoryForm] = useState<boolean>(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async (): Promise<void> => {
    await Promise.all([
      fetchGalleries(), 
      fetchCategories(),
      fetchUsers(),
      fetchStats(),
      fetchComments() // Panggil fetch comments
    ]);
  };

  const fetchGalleries = async (): Promise<void> => {
    setLoadingGalleries(true);
    try {
      const response = await api.get('/api/galleries');
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
      const response = await api.get('/api/categories');
      if (response.data.success && response.data.data) {
        setCategories(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const fetchUsers = async (): Promise<void> => {
    setLoadingUsers(true);
    try {
      const response = await api.get('/api/auth/users');
      if (response.data.success && response.data.data) {
        setUsers(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchStats = async (): Promise<void> => {
    setLoadingStats(true);
    try {
      const response = await api.get('/api/admin/stats');
      if (response.data.success && response.data.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
      setStats({
        totalGalleries: galleries.length,
        totalCategories: categories.length,
        totalUsers: users.length,
        totalComments: comments.length,
      });
    } finally {
      setLoadingStats(false);
    }
  };

  // --- Fetch Comments (Baru) ---
  const fetchComments = async (): Promise<void> => {
    setLoadingComments(true);
    try {
      const response = await api.get('/api/comments/all');
      if (response.data.success && response.data.data) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleDeleteGallery = async (id: number): Promise<void> => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'Yes, delete it!',
      background: '#111827',
      color: '#fff',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await api.delete(`/api/galleries/${id}`);
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Gallery has been deleted.',
          timer: 1500,
          showConfirmButton: false,
          background: '#111827',
          color: '#fff',
        });
        fetchGalleries();
        fetchStats();
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error.response?.data?.message || 'Failed to delete gallery',
        background: '#111827',
        color: '#fff',
        confirmButtonColor: '#dc2626',
      });
    }
  };

  const handleDeleteCategory = async (id: number): Promise<void> => {
    const result = await Swal.fire({
      title: 'Delete Category?',
      text: "This will delete all galleries in this category!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'Yes, delete it!',
      background: '#111827',
      color: '#fff',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await api.delete(`/api/categories/${id}`);
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Category has been deleted.',
          timer: 1500,
          showConfirmButton: false,
          background: '#111827',
          color: '#fff',
        });
        fetchData();
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error.response?.data?.message || 'Failed to delete category',
        background: '#111827',
        color: '#fff',
        confirmButtonColor: '#dc2626',
      });
    }
  };

  const handleToggleRole = async (userId: number, currentRole: string): Promise<void> => {
    const action = currentRole === 'admin' ? 'demote' : 'promote';
    
    const result = await Swal.fire({
      title: `${action} User?`,
      text: `Are you sure you want to ${action} this user?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#4b5563',
      confirmButtonText: `Yes, ${action}!`,
      background: '#111827',
      color: '#fff',
    });

    if (!result.isConfirmed) return;

    try {
      const newRole = currentRole === 'admin' ? 'user' : 'admin';
      const response = await api.put(`/api/auth/user/${userId}/role`, { role: newRole });
      
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Success',
          text: `User role updated to ${newRole}`,
          timer: 1500,
          showConfirmButton: false,
          background: '#111827',
          color: '#fff',
        });
        fetchUsers();
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error.response?.data?.message || 'Failed to update user role',
        background: '#111827',
        color: '#fff',
        confirmButtonColor: '#dc2626',
      });
    }
  };

  const handleDeleteUser = async (userId: number): Promise<void> => {
    const result = await Swal.fire({
      title: 'Delete User?',
      text: 'This will also delete all their galleries and comments.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'Yes, delete user!',
      background: '#111827',
      color: '#fff',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await api.delete(`/api/auth/user/${userId}`);
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'User has been deleted.',
          timer: 1500,
          showConfirmButton: false,
          background: '#111827',
          color: '#fff',
        });
        fetchUsers();
        fetchStats();
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error.response?.data?.message || 'Failed to delete user',
        background: '#111827',
        color: '#fff',
        confirmButtonColor: '#dc2626',
      });
    }
  };

  // --- Handle Delete Comment (Baru) ---
  const handleDeleteComment = async (id: number): Promise<void> => {
    const result = await Swal.fire({
      title: 'Delete Comment?',
      text: "This action cannot be undone!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#4b5563',
      confirmButtonText: 'Yes, delete it!',
      background: '#111827',
      color: '#fff',
    });

    if (!result.isConfirmed) return;

    try {
      const response = await api.delete(`/api/comments/${id}`);
      if (response.data.success) {
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Comment has been deleted.',
          timer: 1500,
          showConfirmButton: false,
          background: '#111827',
          color: '#fff',
        });
        fetchComments(); 
        fetchStats();   
      }
    } catch (error: any) {
      Swal.fire({
        icon: 'error',
        title: 'Failed',
        text: error.response?.data?.message || 'Failed to delete comment',
        background: '#111827',
        color: '#fff',
        confirmButtonColor: '#dc2626',
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 py-8 overflow-x-hidden">
      {/* Background Elements ... */}
      <div className="fixed inset-0 opacity-5 pointer-events-none">
        <div className="absolute inset-0 speed-line" />
        <div className="absolute top-1/4 left-0 w-full h-1 bg-red-500 speed-line" />
        <div className="absolute top-1/2 left-0 w-full h-0.5 bg-red-500 speed-line animation-delay-1000" />
        <div className="absolute top-3/4 left-0 w-full h-1 bg-red-500 speed-line animation-delay-2000" />
      </div>

      <div className="absolute top-0 left-1/4 w-64 h-64 bg-red-600 rounded-full blur-3xl -translate-y-1/2 opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-orange-600 rounded-full blur-3xl translate-y-1/2 opacity-10 pointer-events-none" />

      <div className="mt-19 container-custom relative z-10">
        {/* Header */}
        <AdminHeader
          stats={stats}
          galleries={galleries}
          categories={categories}
          users={users}
        />

        {/* Navigation Tabs */}
        <AdminTabs 
          activeTab={activeTab} 
          onTabChange={setActiveTab} 
          galleriesCount={galleries.length}
          categoriesCount={categories.length}
          usersCount={users.length}
          commentsCount={comments.length} // Tambahin ini
        />

        {/* Action Buttons */}
        <div className="mb-8 flex justify-center lg:justify-start">
          {activeTab === 'galleries' ? (
            <button
              onClick={() => setShowUploadForm(true)}
              className="group relative px-8 py-4 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-red-500/50 flex items-center gap-3"
            >
              <span className="uppercase tracking-wider">Upload New Gallery</span>
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </button>
          ) : activeTab === 'categories' ? (
            <button
              onClick={() => setShowCategoryForm(true)}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white font-bold rounded-xl shadow-2xl transition-all duration-300 hover:scale-105 hover:shadow-blue-500/50 flex items-center gap-3"
            >
              <span className="uppercase tracking-wider">Create New Category</span>
            </button>
          ) : null}
        </div>

        {/* Tab Content */}
        {activeTab === 'galleries' && (
          <GalleriesTab
            galleries={galleries}
            loading={loadingGalleries}
            onDelete={handleDeleteGallery}
            onRefresh={fetchGalleries}
            onUploadClick={() => setShowUploadForm(true)}
          />
        )}

        {activeTab === 'categories' && (
          <CategoriesTab
            categories={categories}
            onDelete={handleDeleteCategory}
            onCreateClick={() => setShowCategoryForm(true)}
          />
        )}

        {activeTab === 'users' && (
          <UsersTab
            users={users}
            loading={loadingUsers}
            onToggleRole={handleToggleRole}
            onDelete={handleDeleteUser}
          />
        )}

        {activeTab === 'comments' && (
          <CommentsTab
            comments={comments}
            loading={loadingComments}
            onDelete={handleDeleteComment}
          />
        )}

        {activeTab === 'stats' && (
          <StatsTab
            stats={stats}
            loading={loadingStats}
            galleries={galleries}
          />
        )}

        {/* Modals */}
        <UploadGalleryModal
          isOpen={showUploadForm}
          onClose={() => setShowUploadForm(false)}
          categories={categories}
          onSuccess={() => {
            fetchGalleries();
            fetchStats();
          }}
        />

        <CreateCategoryModal
          isOpen={showCategoryForm}
          onClose={() => setShowCategoryForm(false)}
          onSuccess={() => {
            fetchCategories();
            fetchStats();
          }}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;