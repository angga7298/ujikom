import { useState, useEffect } from 'react';
import type { FormEvent, ChangeEvent} from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { MessageSquare, Trash2, User, Send, Loader } from 'lucide-react';
import { format } from 'date-fns';
import type { Comment, CommentSectionProps, ApiResponse } from '../types';

const CommentSection = ({ galleryId }: CommentSectionProps) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState<string>('');

  const [commentLoading, setCommentLoading] = useState<boolean>(false);

  useEffect(() => {
    fetchComments();
  }, [galleryId]);

  const fetchComments = async (): Promise<void> => {
    try {
      const response = await api.get<ApiResponse<Comment[]>>(`/api/comments/gallery/${galleryId}`);
      if (response.data.success && response.data.data) {
        setComments(response.data.data);
      }
    } catch (error) {
      console.error('Failed to fetch comments:', error);
    }
  };

  const handleSubmitComment = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!commentText.trim()) return;

    setCommentLoading(true);
    try {
      const response = await api.post<ApiResponse>('/api/comments', {
        gallery_id: galleryId,
        comment_text: commentText,
      });

      if (response.data.success) {
        setCommentText('');
        fetchComments();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to post comment');
    } finally {
      setCommentLoading(false);
    }
  };

  const handleDeleteComment = async (commentId: number): Promise<void> => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      const response = await api.delete<ApiResponse>(`/api/comments/${commentId}`);
      if (response.data.success) {
        fetchComments();
      }
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to delete comment');
    }
  };

  return (
    <div className="bg-gray-800 rounded-xl p-6 shadow-2xl border border-gray-700">
      <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
        <MessageSquare className="w-6 h-6 mr-3 text-rally-red" />
        Comments ({comments.length})
      </h3>

      {/* Comments list di atas */}
      <div className="space-y-4 max-h-96 overflow-y-auto mb-6">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="bg-gray-700/30 rounded-lg p-4 border border-gray-600">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 bg-rally-red rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-white font-semibold">{comment.username}</p>
                      {comment.role === 'admin' && (
                        <span className="text-xs bg-rally-red text-white px-2 py-1 rounded">
                          ADMIN
                        </span>
                      )}
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{comment.comment_text}</p>
                    <p className="text-gray-500 text-xs">
                      {format(new Date(comment.created_at), 'MMM dd, yyyy HH:mm')}
                    </p>
                  </div>
                </div>

                {(user?.id === comment.user_id || isAdmin()) && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-gray-400 hover:text-rally-red transition-colors flex-shrink-0 ml-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Form comment di bawah */}
      {isAuthenticated() ? (
        <form onSubmit={handleSubmitComment} className="mt-6">
          <textarea
            value={commentText}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCommentText(e.target.value)}
            placeholder="Share your thoughts about this rally car..."
            className="w-full bg-gray-700/50 text-white placeholder-gray-400 rounded-lg p-4 resize-none focus:outline-none focus:ring-2 focus:ring-rally-red transition-all duration-300 min-h-[100px]"
            disabled={commentLoading}
          />
          <button
            type="submit"
            disabled={commentLoading || !commentText.trim()}
            className="w-full bg-rally-red hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-[1.02] flex items-center justify-center space-x-2 mt-3"
          >
            {commentLoading ? (
              <Loader className="w-5 h-5 animate-spin" />
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Post Comment</span>
              </>
            )}
          </button>
        </form>
      ) : (
        <div className="text-center py-8 bg-gray-700/30 rounded-lg mt-6">
          <p className="text-gray-400 mb-4">Login to join the conversation</p>
          <a
            href="/login"
            className="inline-flex items-center space-x-2 bg-rally-red hover:bg-red-700 text-white font-bold py-2 px-6 rounded-lg transition-all duration-300"
          >
            <User className="w-4 h-4" />
            <span>Login</span>
          </a>
        </div>
      )}
    </div>
  );
};

export default CommentSection;