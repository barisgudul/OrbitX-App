// hooks/useGoldData.ts
import { useQuery } from '@tanstack/react-query';
import { fetchAltinData } from '../api/marketApi';

export const useGoldData = () => {
  return useQuery({
    queryKey: ['altinData'], // queryKey'i de değiştirelim
    queryFn: fetchAltinData,
    // DEĞİŞİKLİK BURADA
    initialData: [],
    // --- GELİŞTİRME İÇİN EKLENECEK AYARLAR ---
    refetchOnWindowFocus: false, // Pencereye odaklanınca otomatik yenilemeyi kapat
    refetchInterval: 60000, // Arka planda yenileme aralığını 1 dakikaya çıkar
  });
};
