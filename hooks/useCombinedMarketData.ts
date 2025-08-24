// hooks/useCombinedMarketData.ts
import { FinancialAsset } from '../types';
import { useCryptoData } from './useCryptoData'; // useMarketData'nın yeni adı
import { useCurrencyData } from './useCurrencyData';
import { useMetalData } from './useMetalData';

export const useCombinedMarketData = () => {
  // Her bir veri tipi için ilgili hook'u çağır
  const { data: cryptoData = [], isLoading: isCryptoLoading, isError: isCryptoError, refetch: refetchCrypto, isFetching: isFetchingCrypto } = useCryptoData();
  const { data: currencyData = [], isLoading: isCurrencyLoading, isError: isCurrencyError, refetch: refetchCurrency, isFetching: isFetchingCurrency } = useCurrencyData();
  const { data: metalData = [], isLoading: isMetalLoading, isError: isMetalError, refetch: refetchMetal, isFetching: isFetchingMetal } = useMetalData();

  // Herhangi biri hala yükleniyorsa, genel yüklenme durumu 'true' olsun
  const isLoading = isCryptoLoading || isCurrencyLoading || isMetalLoading;
  // Herhangi birinde hata varsa, genel hata durumu 'true' olsun
  const isError = isCryptoError || isCurrencyError || isMetalError;
  const isFetching = isFetchingCrypto || isFetchingCurrency || isFetchingMetal;

  // Tüm refetch fonksiyonlarını aynı anda çağıran bir fonksiyon
  const refetch = () => {
    refetchCrypto();
    refetchCurrency();
    refetchMetal();
  };

  // Tüm verileri tek bir dizide birleştir
  const data: FinancialAsset[] = [...cryptoData, ...currencyData, ...metalData];

  return { data, isLoading, isError, refetch, isFetching };
};