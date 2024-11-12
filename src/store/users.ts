import { create } from 'zustand';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  class?: string;
  studentId?: string;
  borrowedDocuments: number;
}

interface UsersState {
  users: User[];
  addUser: (user: Omit<User, 'id' | 'borrowedDocuments'>) => void;
  removeUser: (id: string) => void;
}

export const useUsersStore = create<UsersState>((set) => ({
  users: [
    {
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      role: 'teacher',
      borrowedDocuments: 2,
    },
    {
      id: '2',
      name: 'Sarah Smith',
      email: 'sarah@example.com',
      role: 'student',
      class: '5A',
      studentId: '2024001',
      borrowedDocuments: 1,
    },
  ],
  addUser: (userData) => 
    set((state) => ({
      users: [
        ...state.users,
        {
          ...userData,
          id: Math.random().toString(36).substr(2, 9),
          borrowedDocuments: 0,
        },
      ],
    })),
  removeUser: (id) =>
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    })),
}));