import { useQuery } from '@tanstack/react-query';
import { fetchAltinData } from '../api/marketApi';

export const useGoldData = () => {
  return useQuery({
    queryKey: ['altinData'],
    queryFn: fetchAltinData,
  });
};