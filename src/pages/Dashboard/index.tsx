import React from 'react';
import { FileText, Users, Clock, ArrowUpRight } from 'lucide-react';
import { StatCard } from '@/components/ui/Card';
import { DocumentCard } from '@/components/ui/DocumentCard';

const stats = [
  { 
    label: 'Total Documents', 
    value: '128', 
    icon: FileText, 
    change: '+12.3%',
    variant: 'success' 
  },
  { 
    label: 'Active Users', 
    value: '42', 
    icon: Users, 
    change: '+8.2%',
    variant: 'default' 
  },
  { 
    label: 'Borrowed Documents', 
    value: '18', 
    icon: Clock, 
    change: '-2.4%',
    variant: 'warning' 
  },
];

const recentDocuments = [
  { 
    id: 1, 
    name: 'School Budget 2024.pdf', 
    borrower: 'John Doe', 
    status: 'borrowed', 
    date: '2024-03-15' 
  },
  { 
    id: 2, 
    name: 'Curriculum Guide.docx', 
    borrower: null, 
    status: 'available', 
    date: '2024-03-14' 
  },
  { 
    id: 3, 
    name: 'Staff Meeting Minutes.pdf', 
    borrower: 'Jane Smith', 
    status: 'borrowed', 
    date: '2024-03-13' 
  },
  { 
    id: 4, 
    name: 'Student Records.xlsx', 
    borrower: null, 
    status: 'available', 
    date: '2024-03-12' 
  },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Recent Documents */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Recent Documents</h2>
            <button className="text-blue-600 hover:text-blue-700 text-sm font-medium inline-flex items-center">
              View all
              <ArrowUpRight className="w-4 h-4 ml-1" />
            </button>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {recentDocuments.map((doc) => (
            <DocumentCard
              key={doc.id}
              {...doc}
              onView={() => console.log('View document:', doc.id)}
              onDownload={() => console.log('Download document:', doc.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}