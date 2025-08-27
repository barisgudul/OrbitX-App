// app/_layout.tsx (NİHAİ VE DOĞRU NAVİGASYON YAPISI)

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { useFavoritesStore } from '../store/favoritesStore';


const queryClient = new QueryClient();

export default function RootLayout() {
  const loadFavorites = useFavoritesStore(state => state.loadFavorites);
  
  useEffect(() => {
    loadFavorites();
  }, [loadFavorites]);

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
        {/* Asset detay sayfası kaldırıldı */}
        <Stack.Screen name="selectAsset" />
      </Stack>
    </QueryClientProvider>
  );
}