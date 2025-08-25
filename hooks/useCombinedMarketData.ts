// hooks/useCombinedMarketData.ts

import { FinancialAsset } from '../types';
import { useCryptoData } from './useCryptoData';
import { useCurrencyData } from './useCurrencyData';
// DEĞİŞİKLİK BURADA: Dosya adını ve hook adını güncelliyoruz
import { useGoldData } from './useGoldData';

export const useCombinedMarketData = () => {
  const { data: cryptoData = [], isLoading: isCryptoLoading, isError: isCryptoError, refetch: refetchCrypto, isFetching: isFetchingCrypto } = useCryptoData();
  const { data: currencyData = [], isLoading: isCurrencyLoading, isError: isCurrencyError, refetch: refetchCurrency, isFetching: isFetchingCurrency } = useCurrencyData();
  // DEĞİŞİKLİK BURADA: Hook'u doğru adıyla çağırıyoruz
  const { data: metalData = [], isLoading: isMetalLoading, isError: isMetalError, refetch: refetchMetal, isFetching: isFetchingMetal } = useGoldData();

  const isLoading = isCryptoLoading || isCurrencyLoading || isMetalLoading;
  const isError = isCryptoError || isCurrencyError || isMetalError;
  const isFetching = isFetchingCrypto || isFetchingCurrency || isFetchingMetal;

  const refetch = () => {
    refetchCrypto();
    refetchCurrency();
    refetchMetal();
  };

  const data: FinancialAsset[] = [...cryptoData, ...currencyData, ...metalData];

  return { data, isLoading, isError, refetch, isFetching };
};