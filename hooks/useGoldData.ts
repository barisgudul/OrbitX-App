// hooks/useGoldData.ts
import { useQuery } from '@tanstack/react-query';
import { fetchGoldData } from '../api/marketApi';

export const useGoldData = () => {
  return useQuery({
    queryKey: ['goldData'], // queryKey'i de değiştirelim
    queryFn: fetchGoldData,
  });
};
