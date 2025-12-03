import { Calendar, Clock } from 'lucide-react';

export const Timesheet = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Timesheet</h1>
        <p className="text-gray-400 mt-2">Track and manage your work hours</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-blue-400" size={24} />
            <span className="text-gray-400">Hours This Week</span>
          </div>
          <p className="text-4xl font-bold text-gray-100">-</p>
          <p className="text-sm text-gray-500 mt-2">No entries yet</p>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="text-green-500" size={24} />
            <span className="text-gray-400">Approved Hours</span>
          </div>
          <p className="text-4xl font-bold text-gray-100">0</p>
          <p className="text-sm text-gray-500 mt-2">No entries yet</p>
        </div>
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="text-yellow-500" size={24} />
            <span className="text-gray-400">Pending Review</span>
          </div>
          <p className="text-4xl font-bold text-gray-100">0</p>
          <p className="text-sm text-gray-500 mt-2">No entries pending</p>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg">
        <div className="p-6 border-b border-gray-700">
          <h2 className="text-xl font-bold text-gray-100">Timesheet Entries</h2>
        </div>
        <div className="p-6">
          <p className="text-gray-400 text-center py-8">No timesheet entries yet. Start logging your hours!</p>
        </div>
      </div>
    </div>
  );
};
