// hooks/useCombinedMarketData.ts

import { FinancialAsset } from '../types';
import { useCurrencyData } from './useCurrencyData';
import { useGoldData } from './useGoldData';
import { usePariteData } from './usePariteData';

export const useCombinedMarketData = () => {
  const { data: pariteData = [], isLoading: isPariteLoading, isError: isPariteError, refetch: refetchParite, isFetching: isFetchingParite } = usePariteData();
  const { data: dovizData = [], isLoading: isDovizLoading, isError: isDovizError, refetch: refetchDoviz, isFetching: isFetchingDoviz } = useCurrencyData();
  const { data: altinData = [], isLoading: isAltinLoading, isError: isAltinError, refetch: refetchAltin, isFetching: isFetchingAltin } = useGoldData();



  const isLoading = isPariteLoading || isDovizLoading || isAltinLoading;
  const isError = isPariteError || isDovizError || isAltinError;
  const isFetching = isFetchingParite || isFetchingDoviz || isFetchingAltin;

  const refetch = () => {
    refetchParite();
    refetchDoviz();
    refetchAltin();
  };

  // GÜVENLİK: Tüm verileri filtrele ve geçersiz olanları çıkar
  const data: FinancialAsset[] = [...pariteData, ...dovizData, ...altinData].filter(asset => 
    asset && 
    asset.id && 
    asset.name && 
    // Altın için symbol boş olabilir, diğerleri için dolu olmalı
    (asset.tip === 'altin' ? true : asset.symbol) &&
    typeof asset.alis === 'number' && 
    typeof asset.satis === 'number' &&
    asset.tip &&
    // image alanı için ek güvenlik: undefined olabilir ama geçersiz string olmamalı
    (asset.image === undefined || 
     (typeof asset.image === 'string' && 
      asset.image.trim() !== '' && 
      asset.image !== 'null' && 
      asset.image !== 'undefined' &&
      asset.image.startsWith('http')))
  );

  return { data, isLoading, isError, refetch, isFetching };
};