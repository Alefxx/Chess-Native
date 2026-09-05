// src/store/authStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage'; // A mágica do Mobile!

interface UserProfile {
  nome: string;
  username: string;
  rating: number;
  foto: string;
}

interface AuthState {
  user: UserProfile | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;
  login: (userData: UserProfile) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false,
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: 'chess-auth-storage', 
      // Substituímos o localStorage pelo AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), 
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => state?.setHasHydrated(true),
    }
  )
);

