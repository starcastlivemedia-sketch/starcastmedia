import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { AlertCircle, Users, Plus, Trash2, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Team {
  id: string;
  name: string;
  description: string;
  created_by: string;
}

interface TeamMember {
  id: string;
  user_id: string;
  team_id: string;
  role: string;
  joined_at: string;
  user_email?: string;
}

export const Admin = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const ADMIN_EMAIL = 'raystarnes816@gmail.com';
  const isAdmin = user?.email === ADMIN_EMAIL;

  const [teams, setTeams] = useState<Team[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewTeamForm, setShowNewTeamForm] = useState(false);
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [newTeamName, setNewTeamName] = useState('');
  const [newTeamDescription, setNewTeamDescription] = useState('');
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('member');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!isAdmin) {
      navigate('/dashboard');
    } else {
      fetchTeams();
    }
  }, [isAdmin, navigate]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('teams')
        .select('*')
        .order('created_at', { ascending: false });

      if (!error && data) {
        setTeams(data);
        if (data.length > 0) {
          setSelectedTeam(data[0].id);
          fetchTeamMembers(data[0].id);
        }
      }
    } catch (err) {
      console.error('Error fetching teams:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchTeamMembers = async (teamId: string) => {
    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('team_id', teamId)
        .order('joined_at', { ascending: false });

      if (!error && data) {
        setTeamMembers(data);
      }
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  };

  const handleCreateTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!user?.id || !newTeamName.trim()) {
      setError('Team name is required');
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from('teams')
        .insert([
          {
            name: newTeamName.trim(),
            description: newTeamDescription.trim(),
            created_by: user.id,
          },
        ]);

      if (insertError) {
        setError('Failed to create team: ' + insertError.message);
        return;
      }

      setNewTeamName('');
      setNewTeamDescription('');
      setShowNewTeamForm(false);
      setSuccess('Team created successfully!');
      setTimeout(() => setSuccess(''), 3000);
      await fetchTeams();
    } catch (err) {
      setError('Error creating team: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error('Error creating team:', err);
    }
  };

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!selectedTeam || !newMemberEmail.trim()) {
      setError('Please select a team and enter an email');
      return;
    }

    try {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(newMemberEmail)) {
        setError('Please enter a valid email address');
        return;
      }

      // Query employees table to find user_id by email
      const { data: employeeData, error: employeeError } = await supabase
        .from('employees')
        .select('user_id, email')
        .eq('email', newMemberEmail)
        .single();

      if (employeeError) {
        if (employeeError.code === 'PGRST116') {
          setError('Employee with that email not found. Please have them sign up and create their profile first.');
        } else {
          setError('Error looking up employee: ' + employeeError.message);
        }
        return;
      }

      if (!employeeData) {
        setError('Employee with that email not found');
        return;
      }

      // Add member to team
      const { error: insertError } = await supabase
        .from('team_members')
        .insert([
          {
            user_id: employeeData.user_id,
            team_id: selectedTeam,
            role: newMemberRole,
          },
        ]);

      if (insertError) {
        if (insertError.code === '23505') {
          setError('This employee is already a member of this team');
        } else {
          setError('Error adding member: ' + insertError.message);
        }
        return;
      }

      setNewMemberEmail('');
      setNewMemberRole('member');
      setShowAddMemberForm(false);
      setSuccess('Team member added successfully!');
      setTimeout(() => setSuccess(''), 3000);
      await fetchTeamMembers(selectedTeam);
    } catch (err) {
      setError('An unexpected error occurred: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error('Error adding member:', err);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to remove this member from the team?')) return;

    setError('');
    setSuccess('');

    try {
      const { error } = await supabase
        .from('team_members')
        .delete()
        .eq('id', memberId);

      if (error) {
        setError('Failed to remove member: ' + error.message);
        return;
      }

      if (selectedTeam) {
        await fetchTeamMembers(selectedTeam);
        setSuccess('Team member removed successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Error removing member: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error('Error removing member:', err);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    if (!confirm('Are you sure you want to delete this team? This will remove all members.')) return;

    setError('');
    setSuccess('');

    try {
      // Delete team members first
      await supabase
        .from('team_members')
        .delete()
        .eq('team_id', teamId);

      // Delete team
      const { error } = await supabase
        .from('teams')
        .delete()
        .eq('id', teamId);

      if (error) {
        setError('Failed to delete team: ' + error.message);
        return;
      }

      await fetchTeams();
      setSuccess('Team deleted successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error deleting team: ' + (err instanceof Error ? err.message : 'Unknown error'));
      console.error('Error deleting team:', err);
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-100">Admin Panel</h1>
        <p className="text-gray-400 mt-2">Manage your Starcast Media employee portal</p>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="mb-6 p-4 bg-red-900/20 border border-red-500/50 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-red-400 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="text-red-300 text-sm">{error}</p>
          </div>
          <button
            onClick={() => setError('')}
            className="text-red-400 hover:text-red-300 text-xl"
          >
            ✕
          </button>
        </div>
      )}

      {/* Success Alert */}
      {success && (
        <div className="mb-6 p-4 bg-green-900/20 border border-green-500/50 rounded-lg flex items-start gap-3">
          <AlertCircle className="text-green-400 flex-shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <p className="text-green-300 text-sm">{success}</p>
          </div>
          <button
            onClick={() => setSuccess('')}
            className="text-green-400 hover:text-green-300 text-xl"
          >
            ✕
          </button>
        </div>
      )}

      {/* Team Management Section */}
      <div className="bg-gray-800 rounded-lg shadow-lg mb-8">
        <div className="p-6 border-b border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="text-green-400" size={24} />
              <h2 className="text-xl font-bold text-gray-100">Team Management</h2>
            </div>
            <button
              onClick={() => setShowNewTeamForm(!showNewTeamForm)}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
            >
              <Plus size={20} />
              Create Team
            </button>
          </div>
        </div>

        {/* Create Team Form */}
        {showNewTeamForm && (
          <div className="p-6 bg-gray-750 border-b border-gray-700">
            <form onSubmit={handleCreateTeam} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Team Name</label>
                <input
                  type="text"
                  value={newTeamName}
                  onChange={(e) => setNewTeamName(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500"
                  placeholder="e.g., Engineering, Marketing"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                <textarea
                  value={newTeamDescription}
                  onChange={(e) => setNewTeamDescription(e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-green-500"
                  placeholder="Team description..."
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition"
                >
                  Create Team
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewTeamForm(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Teams Grid */}
        <div className="p-6">
          {loading ? (
            <p className="text-gray-400">Loading teams...</p>
          ) : teams.length === 0 ? (
            <p className="text-gray-400">No teams yet. Create one to get started!</p>
          ) : (
            <div className="space-y-4">
              {teams.map((team) => (
                <div
                  key={team.id}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition ${
                    selectedTeam === team.id
                      ? 'border-green-500 bg-gray-700'
                      : 'border-gray-600 bg-gray-750 hover:border-gray-500'
                  }`}
                  onClick={() => {
                    setSelectedTeam(team.id);
                    fetchTeamMembers(team.id);
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-100 mb-1">{team.name}</h3>
                      <p className="text-sm text-gray-400">{team.description}</p>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteTeam(team.id);
                      }}
                      className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Team Members Section */}
      {selectedTeam && (
        <div className="bg-gray-800 rounded-lg shadow-lg">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <UserPlus className="text-blue-400" size={24} />
                <h2 className="text-xl font-bold text-gray-100">Team Members</h2>
              </div>
              <button
                onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                <Plus size={20} />
                Add Member
              </button>
            </div>
          </div>

          {/* Add Member Form */}
          {showAddMemberForm && (
            <div className="p-6 bg-gray-750 border-b border-gray-700">
              <form onSubmit={handleAddMember} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Member Email</label>
                  <input
                    type="email"
                    value={newMemberEmail}
                    onChange={(e) => setNewMemberEmail(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500"
                    placeholder="member@example.com"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                  <select
                    value={newMemberRole}
                    onChange={(e) => setNewMemberRole(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="member">Member</option>
                    <option value="lead">Team Lead</option>
                    <option value="manager">Manager</option>
                  </select>
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
                  >
                    Add Member
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowAddMemberForm(false)}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white font-semibold rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Members List */}
          <div className="p-6">
            {teamMembers.length === 0 ? (
              <p className="text-gray-400">No members in this team yet.</p>
            ) : (
              <div className="space-y-3">
                {teamMembers.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                    <div>
                      <p className="font-semibold text-gray-100">{member.user_email || member.user_id}</p>
                      <p className="text-sm text-gray-400 capitalize">{member.role}</p>
                    </div>
                    <button
                      onClick={() => handleRemoveMember(member.id)}
                      className="p-2 text-red-400 hover:bg-red-900/30 rounded-lg transition"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Info */}
      <div className="mt-8 bg-gray-900 border border-gray-700 rounded-lg p-6">
        <div className="flex items-start gap-4">
          <AlertCircle className="text-blue-400 flex-shrink-0 mt-1" size={24} />
          <div>
            <h3 className="text-lg font-semibold text-gray-100 mb-2">Admin Access</h3>
            <p className="text-gray-400">You are logged in as an administrator. Use the team management section above to create teams, add members, and manage your organization structure.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
