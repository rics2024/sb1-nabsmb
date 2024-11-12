import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date) {
  return format(new Date(date), 'MMM dd, yyyy');
}

export const getStatusColor = (status: string) => {
  const colors = {
    borrowed: 'bg-yellow-100 text-yellow-800',
    available: 'bg-green-100 text-green-800',
    overdue: 'bg-red-100 text-red-800',
  };
  return colors[status as keyof typeof colors] || colors.available;
};