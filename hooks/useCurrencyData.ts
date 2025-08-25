// hooks/useCurrencyData.ts
import { useQuery } from '@tanstack/react-query';
import { fetchDovizData } from '../api/marketApi';

export const useCurrencyData = () => {
  return useQuery({
    queryKey: ['dovizData'],
    queryFn: fetchDovizData,
    // DEĞİŞİKLİK BURADA: Başlangıç verisi olarak boş bir dizi tanımla
    initialData: [],
    // --- GELİŞTİRME İÇİN EKLENECEK AYARLAR ---
    refetchOnWindowFocus: false, // Pencereye odaklanınca otomatik yenilemeyi kapat
    refetchInterval: 60000, // Arka planda yenileme aralığını 1 dakikaya çıkar
  });
};