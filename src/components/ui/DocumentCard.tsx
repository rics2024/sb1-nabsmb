import React from 'react';
import { FileText, Download, Eye } from 'lucide-react';
import { cn, formatDate, getStatusColor } from '@/lib/utils';

interface DocumentCardProps {
  name: string;
  borrower: string | null;
  status: string;
  date: string;
  type?: 'physical' | 'digital';
  quantity?: number;
  availableQuantity?: number;
  onView?: () => void;
  onDownload?: () => void;
}

export function DocumentCard({ 
  name, 
  borrower, 
  status, 
  date, 
  type,
  quantity = 0,
  availableQuantity = 0,
  onView, 
  onDownload 
}: DocumentCardProps) {
  const borrowedQuantity = type === 'physical' ? quantity - availableQuantity : 0;

  return (
    <div className="group p-6 flex items-center justify-between hover:bg-gray-50 transition-colors duration-200">
      <div className="flex items-center flex-1">
        <FileText className="w-5 h-5 text-gray-400 mr-3" />
        <div>
          <p className="text-sm font-medium text-gray-900">{name}</p>
          <p className="text-sm text-gray-500">Added on {formatDate(date)}</p>
          {type === 'physical' && (
            <div className="mt-1 flex items-center space-x-4 text-xs">
              <span className="text-gray-600">
                Total: <span className="font-medium">{quantity}</span>
              </span>
              <span className="text-yellow-600">
                Borrowed: <span className="font-medium">{borrowedQuantity}</span>
              </span>
              <span className="text-green-600">
                Available: <span className="font-medium">{availableQuantity}</span>
              </span>
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <span className={cn(
          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
          getStatusColor(status)
        )}>
          {type === 'physical' 
            ? `${availableQuantity > 0 ? 'Available' : 'Out of Stock'}`
            : status}
        </span>
        
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center space-x-2">
          {onView && (
            <button
              onClick={onView}
              className="p-1 hover:bg-gray-100 rounded-full"
              title="View document"
            >
              <Eye className="w-4 h-4 text-gray-600" />
            </button>
          )}
          {onDownload && (
            <button
              onClick={onDownload}
              className="p-1 hover:bg-gray-100 rounded-full"
              title="Download document"
            >
              <Download className="w-4 h-4 text-gray-600" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}