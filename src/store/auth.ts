import { create } from 'zustand';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  login: async (email: string, password: string) => {
    // Mock login - replace with actual API call later
    if (email && password) {
      const mockUser: User = {
        id: '1',
        email,
        name: 'Admin User',
        role: 'admin',
      };
      set({ user: mockUser, isAuthenticated: true });
    }
  },
  logout: () => {
    set({ user: null, isAuthenticated: false });
  },
}));