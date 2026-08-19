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
  login: (userData: UserProfile) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: (userData) => set({ user: userData, isAuthenticated: true }),
      logout: () => set({ user: null, isAuthenticated: false }),
    }),
    {
      name: 'chess-auth-storage', 
      // Substituímos o localStorage pelo AsyncStorage
      storage: createJSONStorage(() => AsyncStorage), 
    }
  )
);

