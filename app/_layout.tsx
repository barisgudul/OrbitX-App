// app/_layout.tsx (NİHAİ VE DOĞRU NAVİGASYON YAPISI)

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useFavoritesStore } from '../store/favoritesStore';
import { usePortfolioStore } from '../store/portfolioStore';

const queryClient = new QueryClient();

export default function RootLayout() {
  const loadFavorites = useFavoritesStore(state => state.loadFavorites);
  const loadTransactions = usePortfolioStore(state => state.loadTransactions);

  useEffect(() => {
    loadFavorites();
    loadTransactions();
  }, [loadFavorites, loadTransactions]);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack
        // DEĞİŞİKLİK BURADA: TÜM BAŞLIKLARI KAPAT
        screenOptions={{
          headerShown: false,
        }}
      >
        {/* 1. EKRAN: SEKMELİ YAPI */}
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="[assetId]" />
        <Stack.Screen name="addTransaction" />
        <Stack.Screen name="selectAsset" />
      </Stack>
    </QueryClientProvider>
  );
}