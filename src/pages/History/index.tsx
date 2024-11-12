import React, { useState } from 'react';
import { Search, Download } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { useBorrowingStore } from '@/store/borrowing';
import { formatDate } from '@/lib/utils';

export function History() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  
  const { borrowings } = useBorrowingStore();

  // Filter borrowings based on search query and status
  const filteredBorrowings = borrowings.filter(borrowing => {
    const matchesSearch = 
      borrowing.borrower.toLowerCase().includes(searchQuery.toLowerCase()) ||
      borrowing.documentTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      borrowing.class.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = 
      selectedStatus === 'all' || 
      (selectedStatus === 'returned' && borrowing.status === 'returned') ||
      (selectedStatus === 'active' && borrowing.status === 'active') ||
      (selectedStatus === 'overdue' && new Date(borrowing.dueDate) < new Date() && borrowing.status === 'active');

    return matchesSearch && matchesStatus;
  });

  const handleExport = () => {
    const csvContent = [
      ['Borrower', 'Class', 'Document', 'Borrow Date', 'Due Date', 'Return Date', 'Status', 'Late Fee'],
      ...filteredBorrowings.map(b => [
        b.borrower,
        b.class,
        b.documentTitle,
        formatDate(b.borrowDate),
        formatDate(b.dueDate),
        b.returnDate ? formatDate(b.returnDate) : '-',
        b.status,
        b.lateFee ? `Rp ${b.lateFee.toLocaleString()}` : '-'
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `borrowing-history-${formatDate(new Date())}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            className="pl-10"
            placeholder="Search by borrower, document, or class..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="rounded-md border border-gray-300 px-3 py-2"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="returned">Returned</option>
          <option value="overdue">Overdue</option>
        </select>
        <Button onClick={handleExport} variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Export CSV
        </Button>
      </div>

      {/* History Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Borrowing History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrower</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Document</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrow Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Return Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Late Fee</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredBorrowings.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-4 text-center text-gray-500">
                    No records found
                  </td>
                </tr>
              ) : (
                filteredBorrowings.map((borrowing) => {
                  const isOverdue = new Date(borrowing.dueDate) < new Date() && borrowing.status === 'active';
                  return (
                    <tr key={borrowing.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{borrowing.borrower}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{borrowing.class}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{borrowing.documentTitle}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(borrowing.borrowDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(borrowing.dueDate)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {borrowing.returnDate ? formatDate(borrowing.returnDate) : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${borrowing.status === 'returned' 
                            ? 'bg-green-100 text-green-800'
                            : isOverdue
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {borrowing.status === 'returned' 
                            ? 'Returned' 
                            : isOverdue 
                            ? 'Overdue'
                            : 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {borrowing.lateFee ? `Rp ${borrowing.lateFee.toLocaleString()}` : '-'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}