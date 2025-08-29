// hooks/useTheme.ts (DOĞRU VE NİHAİ VERSİYON)

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useMemo } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ThemeColors, createShadows } from '../constants/Theme';

type ThemeMode = 'dark' | 'light' | 'system';

interface ThemeState {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

// Store SADECE ve SADECE en temel state'i tutmalı.
export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'dark',
      setMode: (mode: ThemeMode) => set({ mode }),
      toggleMode: () => {
        const currentMode = get().mode;
        const newMode = currentMode === 'dark' ? 'light' : 'dark';
        set({ mode: newMode });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// HOOK'LAR, o temel state'i alıp KULLANILABİLİR VERİYE DÖNÜŞTÜRMELİ.
// Bu, sonsuz döngüyü engeller.

export const useThemeColors = () => {
  const mode = useThemeStore((state) => state.mode);
  const systemColorScheme = useSystemColorScheme();

  // useMemo sayesinde, 'mode' veya 'systemColorScheme' değişmediği sürece
  // bu fonksiyon yeniden çalışmaz ve her zaman AYNI referanslı objeyi döndürür.
  // SONSUZ DÖNGÜ BİTTİ.
  const theme = useMemo(() => {
    const currentMode = (mode === 'system' ? systemColorScheme : mode) === 'dark' ? 'dark' : 'light';
    const colors = ThemeColors[currentMode];
    
    return {
      ...colors,
      shadows: createShadows(colors.shadow || 'rgba(0,0,0,0.1)'),
      isDark: currentMode === 'dark',
    };
  }, [mode, systemColorScheme]);

  return theme;
};

export const useThemeToggle = () => useThemeStore((state) => state.toggleMode);
