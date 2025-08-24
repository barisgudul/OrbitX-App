// store/favoritesStore.ts (YENİ VE ASYNCSTORAGE İLE ÇALIŞAN HALİ)

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';

interface FavoritesState {
  favorites: string[];
  toggleFavorite: (assetId: string) => Promise<void>; // Artık async
  isFavorite: (assetId: string) => boolean;
  loadFavorites: () => Promise<void>; // Artık async
}

const FAVORITES_KEY = 'user-favorites';

export const useFavoritesStore = create<FavoritesState>((set, get) => ({
  favorites: [],
  
  toggleFavorite: async (assetId) => {
    const currentFavorites = get().favorites;
    const isAlreadyFavorite = currentFavorites.includes(assetId);
    
    let newFavorites: string[];
    if (isAlreadyFavorite) {
      newFavorites = currentFavorites.filter(id => id !== assetId);
    } else {
      newFavorites = [...currentFavorites, assetId];
    }

    // AsyncStorage'a kaydet (await ile bekliyoruz)
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites));
    set({ favorites: newFavorites });
  },

  isFavorite: (assetId) => {
    return get().favorites.includes(assetId);
  },

  loadFavorites: async () => {
    try {
      const storedFavorites = await AsyncStorage.getItem(FAVORITES_KEY);
      if (storedFavorites) {
        set({ favorites: JSON.parse(storedFavorites) });
      }
    } catch (error) {
      console.error("Failed to load favorites from AsyncStorage", error);
    }
  },
}));