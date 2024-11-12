import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Search } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useBorrowingStore } from '@/store/borrowing';
import { useDocumentsStore } from '@/store/documents';
import { useUsersStore } from '@/store/users';

const borrowingSchema = z.object({
  borrower: z.string().min(1, 'Borrower name is required'),
  class: z.string().min(1, 'Class is required'),
  documentId: z.string().min(1, 'Document is required'),
  borrowDate: z.string().min(1, 'Borrow date is required'),
  dueDate: z.string().min(1, 'Due date is required'),
});

type BorrowingForm = z.infer<typeof borrowingSchema>;

interface AddBorrowingDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddBorrowingDialog({ open, onClose }: AddBorrowingDialogProps) {
  const [documentSearch, setDocumentSearch] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const addBorrowing = useBorrowingStore((state) => state.addBorrowing);
  const documents = useDocumentsStore((state) => state.documents);
  const users = useUsersStore((state) => state.users);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BorrowingForm>({
    resolver: zodResolver(borrowingSchema),
  });

  const selectedDocumentId = watch('documentId');

  const availableDocuments = documents.filter(doc => 
    doc.status === 'available' || 
    (doc.type === 'physical' && doc.availableQuantity && doc.availableQuantity > 0)
  );

  const filteredDocuments = availableDocuments.filter(doc =>
    doc.name.toLowerCase().includes(documentSearch.toLowerCase())
  );

  const selectedDocument = documents.find(doc => doc.id === selectedDocumentId);

  const handleDocumentSelect = (doc: typeof documents[0]) => {
    setValue('documentId', doc.id);
    setDocumentSearch(doc.name);
    setShowSuggestions(false);
  };

  const onSubmit = async (data: BorrowingForm) => {
    try {
      const document = documents.find(d => d.id === data.documentId);
      if (!document) return;

      addBorrowing({
        ...data,
        documentTitle: document.name,
        status: 'active',
      });
      
      reset();
      onClose();
    } catch (error) {
      console.error('Failed to add borrowing:', error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/30" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">New Borrowing</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Borrower Name
              </label>
              <Input
                placeholder="Enter borrower name"
                error={errors.borrower?.message}
                {...register('borrower')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Class
              </label>
              <select
                className="w-full rounded-md border border-gray-300 p-2"
                {...register('class')}
              >
                <option value="">Select class</option>
                {['1A', '1B', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A', '6B'].map((cls) => (
                  <option key={cls} value={cls}>Class {cls}</option>
                ))}
              </select>
              {errors.class && (
                <span className="text-sm text-red-500">{errors.class.message}</span>
              )}
            </div>

            <div className="relative">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  className="pl-9"
                  placeholder="Search for a document..."
                  value={documentSearch}
                  onChange={(e) => {
                    setDocumentSearch(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                />
              </div>
              
              {showSuggestions && documentSearch && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md shadow-lg border border-gray-200 max-h-60 overflow-auto">
                  {filteredDocuments.length === 0 ? (
                    <div className="px-4 py-3 text-sm text-gray-500">
                      No documents found
                    </div>
                  ) : (
                    filteredDocuments.map((doc) => (
                      <button
                        key={doc.id}
                        type="button"
                        className="w-full px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50"
                        onClick={() => handleDocumentSelect(doc)}
                      >
                        <div className="text-sm font-medium text-gray-900">
                          {doc.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {doc.type === 'physical' 
                            ? `${doc.availableQuantity} available` 
                            : 'Digital Document'}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}

              {selectedDocument && (
                <div className="mt-2 p-3 bg-blue-50 rounded-md">
                  <p className="text-sm font-medium text-blue-900">
                    Selected: {selectedDocument.name}
                  </p>
                  <p className="text-xs text-blue-700">
                    {selectedDocument.type === 'physical'
                      ? `${selectedDocument.availableQuantity} copies available`
                      : 'Digital Document'}
                  </p>
                </div>
              )}

              <input type="hidden" {...register('documentId')} />
              {errors.documentId && (
                <span className="text-sm text-red-500">{errors.documentId.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Borrow Date
              </label>
              <Input
                type="date"
                error={errors.borrowDate?.message}
                {...register('borrowDate')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Due Date
              </label>
              <Input
                type="date"
                error={errors.dueDate?.message}
                {...register('dueDate')}
              />
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
                type="submit"
                isLoading={isSubmitting}
              >
                Add Borrowing
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}