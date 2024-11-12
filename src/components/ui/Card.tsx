import React from 'react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  change: string;
  variant?: 'default' | 'success' | 'warning' | 'danger';
}

export function StatCard({ label, value, icon: Icon, change, variant = 'default' }: StatCardProps) {
  const variants = {
    default: 'bg-blue-50 text-blue-600',
    success: 'bg-green-50 text-green-600',
    warning: 'bg-yellow-50 text-yellow-600',
    danger: 'bg-red-50 text-red-600',
  };

  const isPositive = change.startsWith('+');

  return (
    <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-200 transition-all duration-200 hover:shadow-md">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{label}</p>
          <p className="text-2xl font-semibold text-gray-900 mt-1">{value}</p>
        </div>
        <div className={cn('p-3 rounded-lg', variants[variant])}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
      <div className="mt-4 flex items-center">
        <span className={cn(
          'text-sm font-medium',
          isPositive ? 'text-green-600' : 'text-red-600'
        )}>
          {change}
        </span>
        <span className="text-gray-600 text-sm ml-2">from last month</span>
      </div>
    </div>
  );
}