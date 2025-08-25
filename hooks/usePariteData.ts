// hooks/usePariteData.ts

import { useQuery } from '@tanstack/react-query';
import { fetchPariteData } from '../api/marketApi';

export const usePariteData = () => {
  return useQuery({
    queryKey: ['pariteData'],
    queryFn: fetchPariteData,
    // DEĞİŞİKLİK BURADA
    initialData: [],
    // --- GELİŞTİRME İÇİN EKLENECEK AYARLAR ---
    refetchOnWindowFocus: false, // Pencereye odaklanınca otomatik yenilemeyi kapat
    refetchInterval: 60000 * 3, // Arka planda yenileme aralığını 1 dakikaya çıkar
  });
};
