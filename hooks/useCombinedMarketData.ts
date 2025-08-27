// hooks/useCombinedMarketData.ts
import { useMemo } from 'react';
import { useCurrencyData } from './useCurrencyData';
import { useGoldData } from './useGoldData';
import { usePariteData } from './usePariteData';

// Hook to combine all market data for favorites page

export const useCombinedMarketData = () => {
  const { data: dovizData = [], isLoading: dovizLoading, isError: dovizError } = useCurrencyData();
  const { data: altinData = [], isLoading: altinLoading, isError: altinError } = useGoldData();
  const { data: pariteData = [], isLoading: pariteLoading, isError: pariteError } = usePariteData();

  const combinedData = useMemo(() => {
    return [...dovizData, ...altinData, ...pariteData];
  }, [dovizData, altinData, pariteData]);

  const isLoading = dovizLoading || altinLoading || pariteLoading;
  const isError = dovizError || altinError || pariteError;

  return {
    data: combinedData,
    isLoading,
    isError,
  };
};
