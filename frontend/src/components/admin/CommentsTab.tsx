import { useState } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Trash2, User, Calendar, Image as ImageIcon } from 'lucide-react';
import Swal from 'sweetalert2';

interface Comment {
  id: number;
  comment_text: string;
  created_at: string;
  username: string;
  gallery_title: string;
  gallery_id: number;
}

interface CommentsTabProps {
  comments: Comment[];
  loading: boolean;
  onDelete: (id: number) => void;
}

const CommentsTab = ({ comments, loading, onDelete }: CommentsTabProps) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-gradient-to-b from-rally-red to-rally-amber rounded-full"></div>
          <h3 className="text-xl font-bold text-white">Manage Comments</h3>
        </div>
        <span className="text-gray-400 text-sm">
          Total: <span className="text-white font-bold">{comments.length}</span>
        </span>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-rally-red"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-12 bg-gray-800/30 rounded-2xl border border-gray-700/50">
          <MessageSquare className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">No comments found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div 
              key={comment.id}
              className="bg-gray-800/40 backdrop-blur-sm border border-gray-700/50 rounded-xl p-5 hover:border-gray-600 transition-all duration-300 group"
            >
              <div className="flex flex-col md:flex-row gap-4 items-start">
                
                {/* User Info & Logo */}
                <div className="flex-shrink-0 flex items-center space-x-3 min-w-[200px]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center border border-amber-400 shadow-lg shadow-amber-500/30">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">{comment.username}</p>
                    <p className="text-xs text-gray-500 flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Comment Content */}
                <div className="flex-grow bg-gray-900/50 rounded-lg p-3 border border-gray-700/30">
                  <p className="text-gray-200 text-sm leading-relaxed mb-3">
                    "{comment.comment_text}"
                  </p>
                  
                  {/* Nama Mobil (Gallery Title) */}
                  <div className="flex items-center pt-2 border-t border-gray-700/50">
                    <ImageIcon className="w-4 h-4 mr-2 text-rally-amber" />
                    <span className="text-gray-400 text-xs mr-2 uppercase tracking-wider font-bold">on:</span>
                    <Link 
                      to={`/gallery/${comment.gallery_id}`}
                      className="text-white font-bold text-base hover:text-rally-red hover:underline transition-colors truncate"
                      title={comment.gallery_title}
                    >
                      {comment.gallery_title}
                    </Link>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0 pt-2 md:pt-0">
                  <button
                    onClick={() => onDelete(comment.id)}
                    className="group flex items-center space-x-2 px-4 py-2 bg-red-900/10 hover:bg-red-900/30 border border-red-900/30 hover:border-red-500/50 text-red-400 hover:text-red-300 rounded-lg transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
                    <span className="text-sm font-bold">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentsTab;