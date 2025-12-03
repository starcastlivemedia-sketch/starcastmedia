import { TrendingUp, Users, Clock, FileText, type LucideIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface DashboardCardProps {
  icon: LucideIcon;
  title: string;
  value: string;
  description: string;
}

const DashboardCard = ({ icon: Icon, title, value, description }: DashboardCardProps) => (
  <div className="bg-gray-800 rounded-lg shadow-lg p-6 border-l-4 border-blue-500 hover:border-blue-400 transition">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-400 text-sm">{title}</p>
        <p className="text-3xl font-bold text-gray-100 mt-2">{value}</p>
        <p className="text-gray-500 text-xs mt-2">{description}</p>
      </div>
      <Icon className="text-blue-400" size={40} />
    </div>
  </div>
);

export const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Welcome, {user?.email?.split('@')[0]}</h1>
        <p className="text-gray-400 mt-2">Here's your employee dashboard overview.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          icon={TrendingUp}
          title="Status"
          value="Active"
          description="Employment status"
        />
        <DashboardCard
          icon={Clock}
          title="Department"
          value="TBD"
          description="Your department"
        />
        <DashboardCard
          icon={Users}
          title="Role"
          value="TBD"
          description="Your position"
        />
        <DashboardCard
          icon={FileText}
          title="Account"
          value="Verified"
          description="Account status"
        />
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-100 mb-4">Getting Started</h2>
        <div className="space-y-3">
          <p className="text-gray-400">Welcome to the Starcast Media Employee Portal. Complete your profile to get started.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
              <h3 className="font-semibold text-gray-100 mb-2">1. Update Your Profile</h3>
              <p className="text-sm text-gray-400">Go to Settings to add your personal information.</p>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
              <h3 className="font-semibold text-gray-100 mb-2">2. View Documents</h3>
              <p className="text-sm text-gray-400">Check the Documents section for company resources.</p>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
              <h3 className="font-semibold text-gray-100 mb-2">3. Track Time</h3>
              <p className="text-sm text-gray-400">Log your work hours in the Timesheet section.</p>
            </div>
            <div className="p-4 bg-gray-700 rounded-lg border border-gray-600">
              <h3 className="font-semibold text-gray-100 mb-2">4. Connect with Team</h3>
              <p className="text-sm text-gray-400">See your team members in the Team section.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
