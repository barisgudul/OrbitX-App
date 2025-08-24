// hooks/useCurrencyData.ts
import { useQuery } from '@tanstack/react-query';
import { fetchCurrencyData } from '../api/marketApi';

export const useCurrencyData = () => {
  return useQuery({
    queryKey: ['currencyData'],
    queryFn: fetchCurrencyData,
  });
};