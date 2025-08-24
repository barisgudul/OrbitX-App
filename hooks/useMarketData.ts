// hooks/useMarketData.ts

import { useQuery } from '@tanstack/react-query';
import { fetchMarketData } from '../api/marketApi';

export const useMarketData = () => {
  return useQuery({
    queryKey: ['marketData'], // Bu isteği önbellekte saklamak için kullanılan eşsiz bir anahtar
    queryFn: fetchMarketData, // Veriyi çekmek için kullanılacak fonksiyon
  });
};