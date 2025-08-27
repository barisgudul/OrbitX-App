import { useQuery } from '@tanstack/react-query';
import { fetchPariteData } from '../api/marketApi';

export const usePariteData = () => {
  return useQuery({
    queryKey: ['pariteData'],
    queryFn: fetchPariteData,
  });
};