import { FileText } from 'lucide-react';

export const Documents = () => {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-100">Documents</h1>
        <p className="text-gray-400 mt-2">Access company documents and resources</p>
      </div>

      <div className="bg-gray-800 rounded-lg shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <FileText className="text-blue-400" size={24} />
          <h2 className="text-lg font-bold text-gray-100">Available Documents</h2>
        </div>
        <p className="text-gray-400 text-sm">Documents will be made available by your administrator as needed.</p>
      </div>
    </div>
  );
};
