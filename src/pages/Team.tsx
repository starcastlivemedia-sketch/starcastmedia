import { Mail } from 'lucide-react';

interface TeamMemberProps {
  name: string;
  role: string;
  email: string;
  status: 'online' | 'offline';
}

export const TeamMember = ({ name, role, email, status }: TeamMemberProps) => (
  <div className="bg-gray-800 rounded-lg shadow-lg p-4 border border-gray-700 hover:border-blue-500 transition">
    <div className="flex items-start justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
          {name.charAt(0)}
        </div>
        <div>
          <h3 className="font-bold text-gray-100">{name}</h3>
          <p className="text-sm text-gray-400">{role}</p>
        </div>
      </div>
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
        status === 'online' ? 'bg-green-900 text-green-200' : 'bg-gray-700 text-gray-300'
      }`}>
        {status}
      </span>
    </div>
    <div className="mt-4 space-y-2 text-sm text-gray-400">
      <div className="flex items-center gap-2">
        <Mail size={16} />
        <span>{email}</span>
      </div>
    </div>
  </div>
);

export const Team = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Team Members</h1>
        <p className="text-gray-400 mt-2">View your team members and their information</p>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-lg font-bold text-gray-100 mb-4">Team</h2>
        <p className="text-gray-400 text-sm">Team members will appear here once your administrator adds them to your team.</p>
      </div>
    </div>
  );
};
