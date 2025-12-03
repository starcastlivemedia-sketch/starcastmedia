import { TrendingUp, Users, Clock, FileText, type LucideIcon, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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
  const [hasTeam, setHasTeam] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTeamAssignment = async () => {
      if (!user?.id) return;
      
      try {
        const { data, error } = await supabase
          .from('team_members')
          .select('id')
          .eq('user_id', user.id)
          .limit(1);

        if (!error && data && data.length > 0) {
          setHasTeam(true);
        } else {
          setHasTeam(false);
        }
      } catch (err) {
        console.error('Error checking team assignment:', err);
      } finally {
        setLoading(false);
      }
    };

    checkTeamAssignment();
  }, [user?.id]);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Welcome, {user?.email?.split('@')[0]}</h1>
        <p className="text-gray-400 mt-2">Here's your employee dashboard overview.</p>
      </div>

      {/* Team Status Alert */}
      {!loading && !hasTeam && (
        <div className="mb-8 flex items-start gap-4 p-4 bg-yellow-900/20 border border-yellow-500/50 rounded-lg">
          <AlertCircle className="text-yellow-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-yellow-200 mb-1">No Team Assignment</h3>
            <p className="text-yellow-300 text-sm">You haven't been assigned to a team yet. Contact your administrator to get added to a team.</p>
          </div>
        </div>
      )}

      {!loading && hasTeam && (
        <div className="mb-8 flex items-start gap-4 p-4 bg-green-900/20 border border-green-500/50 rounded-lg">
          <Users className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
          <div>
            <h3 className="font-semibold text-green-200 mb-1">Team Assigned</h3>
            <p className="text-green-300 text-sm">You are part of a team. Check the Team section to see your team members.</p>
          </div>
        </div>
      )}

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
