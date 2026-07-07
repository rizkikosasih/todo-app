import { create } from 'zustand';
import { User, signInWithPopup, signOut } from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  setUser: (user: User | null) => void;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  loading: true,
  setUser: (user) => set({ user, loading: false }),
  loginWithGoogle: async () => {
    set({ loading: true });
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error('Error logging in with Google:', error);
      set({ loading: false });
      throw error;
    }
  },
  logout: async () => {
    set({ loading: true });
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
      set({ loading: false });
      throw error;
    }
  }
}));
