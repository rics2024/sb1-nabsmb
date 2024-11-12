import React from 'react';
import { Clock, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import type { Borrowing } from '@/store/borrowing';

interface ReturnsListProps {
  borrowings: Borrowing[];
  onReturnClick: (id: string) => void;
}

export function ReturnsList({ borrowings, onReturnClick }: ReturnsListProps) {
  const calculateStatus = (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((due.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) return { status: 'overdue', days: Math.abs(diffDays) };
    if (diffDays <= 3) return { status: 'due-soon', days: diffDays };
    return { status: 'on-time', days: diffDays };
  };

  const calculateLateFee = (dueDate: string) => {
    const { status, days } = calculateStatus(dueDate);
    if (status !== 'overdue') return 0;
    return days * 1000; // 1000 rupiah per day
  };

  if (borrowings.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        No active borrowings found
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {borrowings.map((borrowing) => {
        const { status, days } = calculateStatus(borrowing.dueDate);
        const lateFee = calculateLateFee(borrowing.dueDate);

        return (
          <div 
            key={borrowing.id} 
            className="p-6 hover:bg-gray-50/50 transition-colors duration-200"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-start space-x-4">
                  {/* Book Cover Placeholder */}
                  <div className="w-16 h-20 bg-gray-200 rounded-md flex items-center justify-center">
                    <span className="text-gray-400 text-xs">Cover</span>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {borrowing.documentTitle}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Borrowed by: {borrowing.borrower} (Class {borrowing.class})
                    </p>
                    
                    <div className="mt-2 flex items-center space-x-4">
                      <div className="flex items-center text-sm">
                        <Clock className="w-4 h-4 mr-1 text-gray-400" />
                        <span className="text-gray-600">
                          Due: {formatDate(borrowing.dueDate)}
                        </span>
                      </div>

                      <div className={`
                        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${status === 'overdue' ? 'bg-red-100 text-red-800' : 
                          status === 'due-soon' ? 'bg-yellow-100 text-yellow-800' : 
                          'bg-green-100 text-green-800'}
                      `}>
                        {status === 'overdue' ? (
                          <>
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Overdue by {days} days
                          </>
                        ) : status === 'due-soon' ? (
                          <>
                            <Clock className="w-3 h-3 mr-1" />
                            Due in {days} days
                          </>
                        ) : (
                          <>
                            <CheckCircle className="w-3 h-3 mr-1" />
                            On Time
                          </>
                        )}
                      </div>
                    </div>

                    {lateFee > 0 && (
                      <div className="mt-2 text-sm text-red-600">
                        Late Fee: Rp {lateFee.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button
                onClick={() => onReturnClick(borrowing.id)}
                variant="outline"
                className="ml-4"
              >
                Return Now
              </Button>
            </div>
          </div>
        );
      })}
    </div>
  );
}