import React, { useState } from 'react';
import { X, Download, Clock, User, FileText } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';

interface DocumentViewDialogProps {
  document: any;
  open: boolean;
  onClose: () => void;
}

export function DocumentViewDialog({ document, open, onClose }: DocumentViewDialogProps) {
  const [isLoading, setIsLoading] = useState(true);

  if (!open) return null;

  const getFileType = (url: string) => {
    const extension = url?.split('.').pop()?.toLowerCase() || '';
    if (extension === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(extension)) return 'word';
    if (['xls', 'xlsx'].includes(extension)) return 'excel';
    return 'unknown';
  };

  const getPreviewComponent = () => {
    const fileType = getFileType(document.url || '');

    if (fileType === 'pdf') {
      return (
        <object
          data={document.url}
          type="application/pdf"
          className="w-full h-[600px] rounded-lg"
          onLoad={() => setIsLoading(false)}
        >
          <div className="w-full h-[600px] bg-gray-50 rounded-lg flex flex-col items-center justify-center">
            <FileText className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-600 text-center">
              Unable to display PDF directly.
              <br />
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => window.open(document.url, '_blank')}
              >
                Open PDF in new tab
              </Button>
            </p>
          </div>
        </object>
      );
    }

    // For non-PDF files, show appropriate placeholder
    const fileTypeLabels = {
      word: 'Word Document',
      excel: 'Excel Spreadsheet',
      unknown: 'Unknown File Type',
    };

    return (
      <div className="w-full h-[600px] bg-gray-50 rounded-lg flex flex-col items-center justify-center">
        <FileText className="w-16 h-16 text-gray-400 mb-4" />
        <p className="text-gray-600 text-center">
          Preview not available for {fileTypeLabels[fileType as keyof typeof fileTypeLabels]}
          <br />
          <span className="text-sm text-gray-500 mb-4 block">
            Please download the file to view its contents
          </span>
          <Button
            variant="outline"
            onClick={() => window.open(document.url, '_blank')}
          >
            Download File
          </Button>
        </p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="fixed inset-0 bg-black/30" onClick={onClose} />
        
        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-4xl">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">{document.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-500"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Document metadata */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Clock className="w-4 h-4" />
                <span>Added on {formatDate(document.date)}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <User className="w-4 h-4" />
                <span>
                  {document.borrower 
                    ? `Borrowed by ${document.borrower}`
                    : 'Available for borrowing'}
                </span>
              </div>
            </div>

            {/* Document preview */}
            <div className="bg-gray-100 rounded-lg mb-6">
              {isLoading && (
                <div className="w-full h-[600px] flex items-center justify-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
                </div>
              )}
              {getPreviewComponent()}
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={onClose}
              >
                Close
              </Button>
              <Button
                onClick={() => window.open(document.url, '_blank')}
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}