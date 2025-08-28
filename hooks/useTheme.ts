import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ThemeColors } from '../constants/Theme';

type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
  getColors: (systemColorScheme: string | null) => typeof ThemeColors.dark;
  isDark: (systemColorScheme: string | null) => boolean;
}

export const useTheme = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'dark', // Varsayılan olarak dark mode - senin istediğin renkler
      setMode: (mode: ThemeMode) => {
        set({ mode });
      },
      toggleMode: () => {
        const currentMode = get().mode;
        const newMode = currentMode === 'dark' ? 'light' : 'dark';
        set({ mode: newMode });
      },
      getColors: (systemColorScheme: string | null) => {
        const { mode } = get();
        
        if (mode === 'system') {
          return systemColorScheme === 'dark' ? ThemeColors.dark : ThemeColors.light;
        }
        
        return ThemeColors[mode];
      },
      isDark: (systemColorScheme: string | null) => {
        const { mode } = get();
        
        if (mode === 'system') {
          return systemColorScheme === 'dark';
        }
        
        return mode === 'dark';
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Kolay kullanım için export
export const useThemeColors = () => {
  const systemColorScheme = useSystemColorScheme();
  return useTheme(state => state.getColors(systemColorScheme || 'light'));
};

export const useThemeMode = () => useTheme(state => state.mode);
export const useThemeToggle = () => useTheme(state => state.toggleMode);
export const useIsDark = () => {
  const systemColorScheme = useSystemColorScheme();
  return useTheme(state => state.isDark(systemColorScheme || 'light'));
};
