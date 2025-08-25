// app/_layout.tsx (NİHAİ VE DOĞRU NAVİGASYON YAPISI)

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect } from 'react';
import { Colors } from '../constants/Theme'; // Renkleri import et
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
        screenOptions={{
          // TÜM EKRANLAR İÇİN GEÇERLİ OLACAK VARSAYILAN STİLLER
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.textPrimary,
          headerTitleStyle: { color: Colors.textPrimary },
          headerShadowVisible: false,
        }}
      >
        {/* 1. EKRAN: SEKMELİ YAPI */}
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            // Sekmeli yapının kendi başlığı olmasın
            headerShown: false 
          }} 
        />
        
        {/* 2. EKRAN: DETAY SAYFASI */}
        <Stack.Screen 
          name="[assetId]"
          options={{
            // Geri butonunun yanındaki yazıyı kaldır
            headerBackTitle: 'Geri',  
            // Başlık, sayfanın içinden dinamik olarak ayarlanacak
            title: '', 
          }}
        />
      </Stack>
    </QueryClientProvider>
  );
}