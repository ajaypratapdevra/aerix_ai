import { create } from 'zustand';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin';
  schoolName?: string;
  phone?: string;
}

interface AuthStore {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  initAuth: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  isLoading: true,

  setAuth: (user, token) => {
    localStorage.setItem('aerix_token', token);
    localStorage.setItem('aerix_user', JSON.stringify(user));
    set({ user, token, isLoading: false });
  },

  logout: () => {
    localStorage.removeItem('aerix_token');
    localStorage.removeItem('aerix_user');
    set({ user: null, token: null, isLoading: false });
  },

  initAuth: () => {
    const token = localStorage.getItem('aerix_token');
    const userStr = localStorage.getItem('aerix_user');
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({ user, token, isLoading: false });
      } catch {
        set({ isLoading: false });
      }
    } else {
      set({ isLoading: false });
    }
  }
}));
