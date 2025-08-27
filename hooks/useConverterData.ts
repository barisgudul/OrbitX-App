import { useQuery } from '@tanstack/react-query';
import { fetchConverterData } from '../api/marketApi';

export const useConverterData = () => {
  return useQuery({
    queryKey: ['converterData'],
    queryFn: fetchConverterData,
  });
};