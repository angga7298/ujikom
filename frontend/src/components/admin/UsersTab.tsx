import { Users, UserCog, Loader } from 'lucide-react';
import type { User } from '../../types';

interface UsersTabProps {
  users: User[];
  loading: boolean;
  onToggleRole: (userId: number, currentRole: string) => Promise<void>;
  onDelete: (userId: number) => Promise<void>;
}

const UsersTab = ({ users, loading, onToggleRole, onDelete }: UsersTabProps) => {
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (users.length === 0) {
    return (
      <div className="text-center py-20 bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700">
        <Users className="w-20 h-20 text-gray-600 mx-auto mb-4" />
        <h3 className="text-2xl font-bold text-white mb-2">No Users Found</h3>
        <p className="text-gray-400">No users registered yet</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-800/30 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-800/50">
            <tr>
              <th className="text-left p-6 text-gray-300 font-bold text-sm uppercase tracking-wider">User</th>
              <th className="text-left p-6 text-gray-300 font-bold text-sm uppercase tracking-wider">Role</th>
              <th className="text-left p-6 text-gray-300 font-bold text-sm uppercase tracking-wider">Joined</th>
              <th className="text-left p-6 text-gray-300 font-bold text-sm uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-700/20 transition-colors">
                <td className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
                      <UserCog className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-bold text-white">{user.username}</h4>
                      <p className="text-gray-400 text-sm">{user.email}</p>
                    </div>
                  </div>
                </td>
                <td className="p-6">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                    user.role === 'admin' 
                      ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' 
                      : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                  }`}>
                    {user.role}
                  </span>
                </td>
                <td className="p-6 text-gray-300">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                </td>
                <td className="p-6">
                  <div className="flex gap-2">
                    <button
                      onClick={() => onToggleRole(user.id, user.role)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      {user.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                    </button>
                    <button
                      onClick={() => onDelete(user.id)}
                      disabled={user.role === 'admin'}
                      className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-red-900 disabled:cursor-not-allowed text-white rounded-lg text-sm font-semibold transition-colors"
                      title={user.role === 'admin' ? 'Cannot delete admin users' : 'Delete user'}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UsersTab;