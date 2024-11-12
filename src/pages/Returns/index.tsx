import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { ReturnsList } from '@/components/returns/ReturnsList';
import { ReturnConfirmationDialog } from '@/components/returns/ReturnConfirmationDialog';
import { useBorrowingStore } from '@/store/borrowing';

export function Returns() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBorrowing, setSelectedBorrowing] = useState<string | null>(null);
  
  const { borrowings } = useBorrowingStore();
  const activeBorrowings = borrowings.filter(b => b.status === 'active');

  const filteredBorrowings = activeBorrowings.filter(borrowing =>
    borrowing.borrower.toLowerCase().includes(searchQuery.toLowerCase()) ||
    borrowing.documentTitle.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <Input
          className="pl-10"
          placeholder="Search active borrowings..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Returns List */}
      <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Process Returns</h2>
        </div>
        
        <ReturnsList 
          borrowings={filteredBorrowings}
          onReturnClick={(id) => setSelectedBorrowing(id)}
        />
      </div>

      {/* Return Confirmation Dialog */}
      <ReturnConfirmationDialog
        borrowingId={selectedBorrowing}
        onClose={() => setSelectedBorrowing(null)}
      />
    </div>
  );
}