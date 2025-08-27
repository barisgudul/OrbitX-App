import { useQuery } from '@tanstack/react-query';
import { fetchDovizData } from '../api/marketApi';

export const useCurrencyData = () => {
  return useQuery({
    queryKey: ['dovizData'],
    queryFn: fetchDovizData,
  });
};