// app/_layout.tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { useEffect } from 'react'; // useEffect'i import et
import { useFavoritesStore } from '../store/favoritesStore'; // Yeni store'umuzu import et
import { usePortfolioStore } from '../store/portfolioStore'; // Yeni portföy store'u

const queryClient = new QueryClient();

export default function RootLayout() {
  // Zustand'dan loadFavorites fonksiyonunu al
  const loadFavorites = useFavoritesStore(state => state.loadFavorites);
  const loadTransactions = usePortfolioStore(state => state.loadTransactions); // Portföy yüklemeyi al

  useEffect(() => {
    // Uygulama ilk yüklendiğinde bu fonksiyonu bir kez çalıştır
    loadFavorites();
    loadTransactions(); // Portföyü de yükle
  }, [loadFavorites, loadTransactions]);

  return (
    <QueryClientProvider client={queryClient}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </QueryClientProvider>
  );
}