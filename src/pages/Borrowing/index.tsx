import React, { useState } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AddBorrowingDialog } from '@/components/borrowing/AddBorrowingDialog';
import { useBorrowingStore } from '@/store/borrowing';
import { formatDate } from '@/lib/utils';

export function Borrowing() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const borrowings = useBorrowingStore((state) => 
    state.borrowings.filter(b => b.status === 'active')
  );

  const filteredBorrowings = borrowings.filter(borrowing =>
    borrowing.borrower.toLowerCase().includes(searchQuery.toLowerCase()) ||
    borrowing.documentTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <Input
            className="pl-10"
            placeholder="Search borrowings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Borrowing
        </Button>
      </div>

      {/* Borrowings List */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Active Borrowings</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredBorrowings.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              No active borrowings found
            </div>
          ) : (
            filteredBorrowings.map((borrowing) => (
              <div key={borrowing.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">{borrowing.documentTitle}</h3>
                  <p className="text-sm text-gray-500">
                    Borrowed by: {borrowing.borrower} (Class {borrowing.class})
                  </p>
                  <div className="mt-1 flex items-center gap-4 text-xs text-gray-500">
                    <span>Borrowed: {formatDate(borrowing.borrowDate)}</span>
                    <span>Due: {formatDate(borrowing.dueDate)}</span>
                  </div>
                </div>
                <div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                    ${new Date(borrowing.dueDate) < new Date() 
                      ? 'bg-red-100 text-red-800' 
                      : 'bg-yellow-100 text-yellow-800'}`}
                  >
                    {new Date(borrowing.dueDate) < new Date() ? 'Overdue' : 'Active'}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Add Borrowing Dialog */}
      <AddBorrowingDialog
        open={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
      />
    </div>
  );
}