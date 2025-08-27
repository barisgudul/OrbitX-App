// api/marketApi.ts (HER SAYFA İÇİN AYRI, NİHAİ VERSİYON)

import axios from 'axios';
import { FinancialAsset } from '../types';
const BASE_URL = 'https://displaydata01.orbitbulut.com/eyyupoglu_altin_v1';

// Döviz isimlerini temizlemek için küçük bir yardımcı
const getDovizFullName = (code: string): string => {
    switch(code) {
        case 'USD': return 'Amerikan Doları';
        case 'EUR': return 'Euro';
        case 'GBP': return 'İngiliz Sterlini';
        case 'CHF': return 'İsviçre Frangı';
        case 'AUD': return 'Avustralya Doları';
        case 'CAD': return 'Kanada Doları';
        case 'SAR': return 'Suudi Arabistan Riyali';
        case 'JPY': return 'Japon Yeni';
        default: return code; // Bilinmiyorsa kodu olduğu gibi bas
    }
};

// --- DÖVİZ SAYFASI İÇİN ---
export const fetchDovizData = async (): Promise<FinancialAsset[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/verileriGetir?tip=doviz#`);
    
    if (!Array.isArray(response.data)) return [];

    return response.data.map((item: any) => ({
        id: item.kod,
        name: getDovizFullName(item.yeni_ad),
        symbol: item.yeni_ad,
        alis: parseFloat(item.alis) || 0,
        satis: parseFloat(item.satis) || 0,
        tip: 'doviz',
        image: item.image,
    }));
  } catch (error) {
    console.error('Hata:', (error as any).response?.status, (error as any).message);
    throw error; // retain throwing so callers (React Query) can handle
  }
};

// --- ALTIN SAYFASI İÇİN ---
export const fetchAltinData = async (): Promise<FinancialAsset[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/verileriGetir?tip=altin#`);
    
    if (!Array.isArray(response.data)) return [];
    
    return response.data.map((item: any) => ({
        id: item.kod,
        name: item.yeni_ad || item.ad,
        symbol: item.kod,
        alis: parseFloat(item.alis) || 0,
        satis: parseFloat(item.satis) || 0,
        tip: 'altin',
        image: item.image,
    }));
  } catch (error) {
    console.error('Hata:', (error as any).response?.status, (error as any).message);
    throw error;
  }
};

// --- PARİTE SAYFASI İÇİN ---
export const fetchPariteData = async (): Promise<FinancialAsset[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/verileriGetir?tip=parite#`);
    
    if (!Array.isArray(response.data)) return [];
    
    return response.data.map((item: any) => ({
        id: item.kod,
        name: item.yeni_ad || item.ad,
        symbol: item.kod,
        alis: parseFloat(item.alis) || 0,
        satis: parseFloat(item.satis) || 0,
        tip: 'parite',
        image: item.image,
    }));
  } catch (error) {
    console.error('Hata:', (error as any).response?.status, (error as any).message);
    throw error;
  }
};

// --- ÇEVİRİCİ SAYFASI İÇİN ---
export const fetchConverterData = async (): Promise<FinancialAsset[]> => {
    try {
      const response = await axios.get(`${BASE_URL}/verileriGetir?tip=doviz_altin`);
     
      if (!Array.isArray(response.data)) return [];
      
      return response.data
        .filter((item: any) => item.tip === 'doviz' || item.tip === 'altin')
        .map((item: any) => {
            const isDoviz = item.tip === 'doviz';
            return {
                id: item.kod,
                name: isDoviz ? getDovizFullName(item.yeni_ad) : (item.yeni_ad || item.ad),
                symbol: isDoviz ? item.yeni_ad : item.kod,
                alis: parseFloat(item.alis) || 0,
                satis: parseFloat(item.satis) || 0,
                tip: item.tip,
                image: item.image,
            };
        });
    } catch (error) {
      console.error('Hata:', (error as any).response?.status, (error as any).message);
      throw error;
    }
  };