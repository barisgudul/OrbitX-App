// hooks/useNewsData.ts
import { useQuery } from '@tanstack/react-query';
import { fetchNewsData } from '../api/marketApi';

export const useNewsData = (query: string | undefined) => {
  return useQuery({
    queryKey: ['newsData', query],
    queryFn: () => fetchNewsData(query!),
    enabled: !!query, // Sadece query varsa çalıştır
  });
};