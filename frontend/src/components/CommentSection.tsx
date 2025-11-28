import { useState, useEffect,  } from 'react';
import type { FormEvent, ChangeEvent} from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';
import { MessageCircle, Trash2, User } from 'lucide-react';
import { format } from 'date-fns';
import  type { Comment, CommentSectionProps, ApiResponse } from '../types';

const CommentSection = ({ galleryId }: CommentSectionProps) => {
  const { user, isAuthenticated, isAdmin } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

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

    setLoading(true);
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
      setLoading(false);
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
    <div className="bg-rally-gray rounded-lg p-6 mt-8">
      <div className="flex items-center space-x-2 mb-6">
        <MessageCircle className="w-6 h-6 text-rally-red" />
        <h2 className="text-2xl font-bold text-white">
          Comments ({comments.length})
        </h2>
      </div>

      {isAuthenticated() ? (
        <form onSubmit={handleSubmitComment} className="mb-6">
          <textarea
            value={commentText}
            onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setCommentText(e.target.value)}
            placeholder="Write your comment..."
            className="input-field min-h-[100px] resize-none"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !commentText.trim()}
            className="btn-primary mt-3 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Posting...' : 'Post Comment'}
          </button>
        </form>
      ) : (
        <div className="bg-rally-dark border border-gray-600 rounded-lg p-4 mb-6 text-center">
          <p className="text-gray-400">
            Please <a href="/login" className="text-rally-red hover:underline">login</a> to post a comment
          </p>
        </div>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <p className="text-gray-400 text-center py-8">
            No comments yet. Be the first to comment!
          </p>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="bg-rally-dark rounded-lg p-4 border border-gray-700"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center space-x-2 mb-2">
                  <User className="w-5 h-5 text-gray-400" />
                  <span className="font-semibold text-white">
                    {comment.username}
                  </span>
                  {comment.role === 'admin' && (
                    <span className="text-xs bg-rally-red px-2 py-1 rounded">
                      ADMIN
                    </span>
                  )}
                  <span className="text-xs text-gray-500">
                    {format(new Date(comment.created_at), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>

                {(user?.id === comment.user_id || isAdmin()) && (
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    className="text-gray-400 hover:text-rally-red transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              <p className="text-gray-300 whitespace-pre-wrap">
                {comment.comment_text}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CommentSection;