// hooks/useCryptoData.ts

import { useQuery } from '@tanstack/react-query';
import { fetchMarketData } from '../api/marketApi';

export const useCryptoData = () => {
  return useQuery({
    queryKey: ['cryptoData'],
    queryFn: fetchMarketData,
  });
};
