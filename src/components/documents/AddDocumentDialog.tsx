import React, { useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X, Upload } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useDocumentsStore } from '@/store/documents';
import type { DocumentType, DocumentCategory } from '@/store/documents';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];

const documentSchema = z.object({
  name: z.string().min(1, 'Document name is required'),
  type: z.enum(['physical', 'digital']),
  category: z.enum(['academic', 'history', 'skills', 'arts', 'general']),
  description: z.string().optional(),
  quantity: z.number().min(1, 'Quantity must be at least 1').optional(),
});

type DocumentForm = z.infer<typeof documentSchema>;

interface AddDocumentDialogProps {
  open: boolean;
  onClose: () => void;
}

export function AddDocumentDialog({ open, onClose }: AddDocumentDialogProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');
  const addDocument = useDocumentsStore((state) => state.addDocument);

  const {
    register,
    watch,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DocumentForm>({
    resolver: zodResolver(documentSchema),
  });

  const documentType = watch('type');

  const validateFile = (file: File) => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      setFileError('Invalid file type. Please upload PDF, DOC, DOCX, XLS, or XLSX files.');
      return false;
    }
    if (file.size > MAX_FILE_SIZE) {
      setFileError('File size must be less than 10MB');
      return false;
    }
    setFileError('');
    return true;
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && validateFile(file)) {
      setSelectedFile(file);
    }
  };

  const onSubmit = async (data: DocumentForm) => {
    try {
      if (data.type === 'digital' && !selectedFile) {
        setFileError('Please select a file for digital documents');
        return;
      }

      const documentData = {
        ...data,
        fileType: data.type === 'digital' ? selectedFile?.type : undefined,
        url: data.type === 'digital' ? URL.createObjectURL(selectedFile!) : undefined,
      };

      addDocument(documentData);
      reset();
      setSelectedFile(null);
      onClose();
    } catch (error) {
      console.error('Failed to add document:', error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/30" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Add New Document</h2>
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
                Document Name
              </label>
              <Input
                placeholder="Enter document name"
                error={errors.name?.message}
                {...register('name')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Document Type
              </label>
              <select
                className="w-full rounded-md border border-gray-300 p-2"
                {...register('type')}
              >
                <option value="">Select type</option>
                <option value="physical">Physical</option>
                <option value="digital">Digital</option>
              </select>
              {errors.type && (
                <span className="text-sm text-red-500">{errors.type.message}</span>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                className="w-full rounded-md border border-gray-300 p-2"
                {...register('category')}
              >
                <option value="">Select category</option>
                <option value="academic">Academic</option>
                <option value="history">History</option>
                <option value="skills">Skills</option>
                <option value="arts">Arts</option>
                <option value="general">General</option>
              </select>
              {errors.category && (
                <span className="text-sm text-red-500">{errors.category.message}</span>
              )}
            </div>

            {documentType === 'physical' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
                <Input
                  type="number"
                  min="1"
                  placeholder="Enter quantity"
                  error={errors.quantity?.message}
                  {...register('quantity', { valueAsNumber: true })}
                />
              </div>
            )}

            {documentType === 'digital' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Upload File
                </label>
                <div
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <div className="space-y-1 text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500">
                        <span>Upload a file</span>
                        <input
                          ref={fileInputRef}
                          type="file"
                          className="sr-only"
                          accept=".pdf,.doc,.docx,.xls,.xlsx"
                          onChange={handleFileChange}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, DOC, DOCX, XLS, XLSX up to 10MB
                    </p>
                    {selectedFile && (
                      <p className="text-sm text-green-600">
                        Selected: {selectedFile.name}
                      </p>
                    )}
                    {fileError && (
                      <p className="text-sm text-red-500">{fileError}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description (Optional)
              </label>
              <textarea
                className="w-full rounded-md border border-gray-300 p-2"
                rows={3}
                placeholder="Enter document description"
                {...register('description')}
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
                Add Document
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}