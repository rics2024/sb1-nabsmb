import { create } from 'zustand';

export interface Borrowing {
  id: string;
  borrower: string;
  class: string;
  documentId: string;
  documentTitle: string;
  borrowDate: string;
  dueDate: string;
  returnDate?: string;
  status: 'active' | 'returned' | 'overdue';
  lateFee?: number;
}

interface BorrowingState {
  borrowings: Borrowing[];
  addBorrowing: (borrowing: Omit<Borrowing, 'id' | 'returnDate' | 'lateFee'>) => void;
  returnDocument: (id: string) => Promise<void>;
  calculateLateFee: (dueDate: string) => number;
}

export const useBorrowingStore = create<BorrowingState>((set, get) => ({
  borrowings: [
    {
      id: '1',
      borrower: 'John Doe',
      class: '5A',
      documentId: '1',
      documentTitle: 'Mathematics Textbook Grade 5',
      borrowDate: '2024-03-15',
      dueDate: '2024-03-29',
      status: 'active',
    },
  ],
  
  addBorrowing: (borrowingData) => 
    set((state) => ({
      borrowings: [
        ...state.borrowings,
        {
          ...borrowingData,
          id: Math.random().toString(36).substr(2, 9),
        },
      ],
    })),

  returnDocument: async (id) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    set((state) => ({
      borrowings: state.borrowings.map((borrowing) =>
        borrowing.id === id
          ? {
              ...borrowing,
              status: 'returned',
              returnDate: new Date().toISOString(),
              lateFee: get().calculateLateFee(borrowing.dueDate),
            }
          : borrowing
      ),
    }));
  },

  calculateLateFee: (dueDate: string) => {
    const today = new Date();
    const due = new Date(dueDate);
    const diffDays = Math.ceil((today.getTime() - due.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays * 1000 : 0; // 1000 rupiah per day
  },
}));