// hooks/useNewsData.ts
import { useQuery } from '@tanstack/react-query';
import { fetchNewsData } from '../api/marketApi';
import { FinancialAsset } from '../types';

export const useNewsData = (asset: FinancialAsset | undefined) => {
  return useQuery({
    queryKey: ['newsData', asset?.id],
    queryFn: () => fetchNewsData(asset!),
    enabled: !!asset, // Sadece asset varsa çalıştır
  });
};