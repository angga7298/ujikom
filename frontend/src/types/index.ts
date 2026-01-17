// types/index.ts

// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  role: 'admin' | 'user';
  created_at?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  type: 'year' | 'class';
  description?: string;
  created_at?: string;
}

export interface CreateCategoryData {
  name: string;
  type: 'year' | 'class';
  description?: string;
}

// Gallery Types
export interface Gallery {
  id: number;
  category_id: number;
  title: string;
  car_model?: string;
  driver_name?: string;
  description?: string;
  image_path: string;
  user_id: number;
  created_at: string;
  category_name?: string;
  category_type?: 'year' | 'class';
  username?: string;
  user_liked?: boolean; 
  likes_count?: number;
}

export interface CreateGalleryData {
  category_id: string | number;
  title: string;
  car_model?: string;
  driver_name?: string;
  description?: string;
  image: File | null;
}

// Comment Types
export interface Comment {
  id: number;
  gallery_id: number;
  user_id: number;
  comment_text: string;
  created_at: string;
  username?: string;
  role?: 'admin' | 'user';
}

export interface CreateCommentData {
  gallery_id: number;
  comment_text: string;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  user?: User; // TAMBAHAN untuk edit profile
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  user?: User;
}

export interface CheckAuthResponse {
  success: boolean;
  authenticated: boolean;
  user?: User;
}

// Context Types - INI YANG DIPERBAIKI
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<AuthResponse>;
  register: (username: string, email: string, password: string) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  isAdmin: () => boolean;
  isAuthenticated: () => boolean;
  checkAuth: () => Promise<void>;
  refreshUser?: () => Promise<void>; // Opsional
  setUser?: (user: User | null) => void; // YANG INI WAJIB DITAMBAH!
}

// Component Props Types
export interface GalleryCardProps {
  gallery: Gallery;
}

export interface CommentSectionProps {
  galleryId: string | number;
}

export interface ProtectedRouteProps {
  children: React.ReactNode;
  adminOnly?: boolean;
}