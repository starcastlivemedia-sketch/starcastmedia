import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { AlertCircle, Users, FileText, Clock, Settings } from 'lucide-react';

export const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const ADMIN_EMAIL = 'raystarnes816@gmail.com';
  const isAdmin = user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
    }
  }, [isAdmin, navigate]);

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-100">Admin Panel</h1>
        <p className="text-gray-400 mt-2">Manage your Starcast Media employee portal</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total Users</p>
              <p className="text-3xl font-bold text-gray-100 mt-2">0</p>
              <p className="text-gray-500 text-xs mt-2">Active accounts</p>
            </div>
            <Users className="text-blue-400" size={40} />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Teams</p>
              <p className="text-3xl font-bold text-gray-100 mt-2">0</p>
              <p className="text-gray-500 text-xs mt-2">Active teams</p>
            </div>
            <Users className="text-green-400" size={40} />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-purple-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Documents</p>
              <p className="text-3xl font-bold text-gray-100 mt-2">0</p>
              <p className="text-gray-500 text-xs mt-2">Uploaded files</p>
            </div>
            <FileText className="text-purple-400" size={40} />
          </div>
        </div>

        <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Timesheets</p>
              <p className="text-3xl font-bold text-gray-100 mt-2">0</p>
              <p className="text-gray-500 text-xs mt-2">Pending approval</p>
            </div>
            <Clock className="text-orange-400" size={40} />
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Management */}
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Users className="text-blue-400" size={24} />
              <h2 className="text-xl font-bold text-gray-100">User Management</h2>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-400 mb-4">Manage employees and their access</p>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
              View All Users
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition mt-3">
              Add New User
            </button>
          </div>
        </div>

        {/* Team Management */}
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Users className="text-green-400" size={24} />
              <h2 className="text-xl font-bold text-gray-100">Team Management</h2>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-400 mb-4">Create and manage teams</p>
            <button className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition">
              View All Teams
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition mt-3">
              Create Team
            </button>
          </div>
        </div>

        {/* Document Management */}
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <FileText className="text-purple-400" size={24} />
              <h2 className="text-xl font-bold text-gray-100">Document Management</h2>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-400 mb-4">Manage company documents and files</p>
            <button className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition">
              View Documents
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition mt-3">
              Upload Document
            </button>
          </div>
        </div>

        {/* Timesheet Management */}
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Clock className="text-orange-400" size={24} />
              <h2 className="text-xl font-bold text-gray-100">Timesheet Management</h2>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-400 mb-4">Review and approve timesheets</p>
            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-2 px-4 rounded-lg transition">
              Review Timesheets
            </button>
            <button className="w-full bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition mt-3">
              Approve Pending
            </button>
          </div>
        </div>

        {/* Settings */}
        <div className="bg-gray-800 rounded-lg shadow-lg lg:col-span-2">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Settings className="text-gray-400" size={24} />
              <h2 className="text-xl font-bold text-gray-100">Admin Settings</h2>
            </div>
          </div>
          <div className="p-6">
            <p className="text-gray-400 mb-4">Configure system settings and preferences</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                System Settings
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                Permissions
              </button>
              <button className="bg-gray-700 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition">
                Logs & Reports
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Info */}
      <div className="mt-8 bg-gray-900 border border-gray-700 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="text-blue-400 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Admin Access</h3>
            <p className="text-gray-400">You are logged in as an administrator. You have full access to manage users, teams, documents, and timesheets. Use this power responsibly.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
