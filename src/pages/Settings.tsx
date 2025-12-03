import { Bell, Lock, User as UserIcon, Save } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SettingToggleProps {
  label: string;
  description: string;
  enabled: boolean;
}

const SettingToggle = ({ label, description, enabled }: SettingToggleProps) => (
  <div className="flex items-center justify-between py-4 border-b border-gray-700 last:border-b-0">
    <div>
      <p className="font-medium text-gray-100">{label}</p>
      <p className="text-sm text-gray-400">{description}</p>
    </div>
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" defaultChecked={enabled} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
    </label>
  </div>
);

export const Settings = () => {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Settings</h1>
        <p className="text-gray-400 mt-2">Manage your account and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 bg-gray-800 rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <UserIcon className="text-blue-400" size={24} />
              <h2 className="text-xl font-bold text-gray-100">Profile Settings</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">First Name</label>
                <input
                  type="text"
                  defaultValue=""
                  placeholder="Enter first name"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Last Name</label>
                <input
                  type="text"
                  defaultValue=""
                  placeholder="Enter last name"
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                disabled
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 disabled:opacity-50 cursor-not-allowed"
              />
              <p className="text-xs text-gray-500 mt-1">Email is managed by your account</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Department</label>
              <input
                type="text"
                defaultValue=""
                placeholder="Enter your department"
                className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-100 placeholder-gray-500"
              />
            </div>
          </div>
        </div>

        {/* Quick Settings */}
        <div className="bg-gray-800 rounded-lg shadow-lg h-fit">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center gap-3">
              <Bell className="text-blue-400" size={24} />
              <h2 className="text-xl font-bold text-gray-100">Quick Settings</h2>
            </div>
          </div>
          <div className="p-6">
            <SettingToggle label="Notifications" description="Email notifications" enabled={true} />
            <SettingToggle label="Updates" description="Receive updates" enabled={true} />
            <SettingToggle label="Analytics" description="Share analytics" enabled={false} />
          </div>
        </div>
      </div>

      {/* Security Section */}
      <div className="mt-6 bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <Lock className="text-blue-400" size={24} />
            <h2 className="text-xl font-bold text-gray-100">Security</h2>
          </div>
        </div>
        <div className="p-6">
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Change Password
          </button>
          <p className="text-sm text-gray-400 mt-3">You can change your password at any time</p>
        </div>
      </div>

      <button className="mt-6 flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">
        <Save size={20} />
        Save Changes
      </button>
    </div>
  );
};
