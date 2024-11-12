import React, { useState } from 'react';
import { X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useBorrowingStore } from '@/store/borrowing';
import { formatDate } from '@/lib/utils';

interface ReturnConfirmationDialogProps {
  borrowingId: string | null;
  onClose: () => void;
}

export function ReturnConfirmationDialog({ borrowingId, onClose }: ReturnConfirmationDialogProps) {
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { borrowings, returnDocument } = useBorrowingStore();
  
  const borrowing = borrowings.find(b => b.id === borrowingId);

  if (!borrowingId || !borrowing) return null;

  const handleReturn = async () => {
    setIsProcessing(true);
    try {
      await returnDocument(borrowingId);
      setIsSuccess(true);
      // Reset after showing success message
      setTimeout(() => {
        setIsSuccess(false);
        setIsProcessing(false);
        onClose();
      }, 2000);
    } catch (error) {
      setIsProcessing(false);
      console.error('Failed to process return:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/30" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          {isSuccess ? (
            <div className="text-center py-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Return Processed Successfully
              </h3>
              <p className="text-sm text-gray-500">
                The document has been marked as returned
              </p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Confirm Return</h2>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">
                    {borrowing.documentTitle}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Borrowed by: {borrowing.borrower}
                  </p>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-gray-500">Borrow Date</p>
                      <p className="font-medium">{formatDate(borrowing.borrowDate)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Due Date</p>
                      <p className="font-medium">{formatDate(borrowing.dueDate)}</p>
                    </div>
                  </div>
                </div>

                <div className="text-sm text-gray-500">
                  Please ensure the document is in good condition before processing the return.
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleReturn}
                    isLoading={isProcessing}
                  >
                    Confirm Return
                  </Button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}