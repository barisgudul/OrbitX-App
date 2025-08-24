// hooks/useMetalData.ts
import { useQuery } from '@tanstack/react-query';
import { fetchMetalData } from '../api/marketApi';

export const useMetalData = () => {
  return useQuery({
    queryKey: ['metalData'],
    queryFn: fetchMetalData,
  });
};
