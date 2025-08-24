// api/marketApi.ts (NİHAİ VE EN DOĞRU YAPI)

import axios from 'axios';
import Constants from 'expo-constants';
import { FinancialAsset } from '../types';

// --- API Anahtarları ---
const EXCHANGE_RATE_API_KEY = Constants.expoConfig?.extra?.exchangeRateApiKey;
const METAL_PRICE_API_KEY = Constants.expoConfig?.extra?.metalPriceApiKey;

// ------------------- CRYPTO DATA -------------------
// ... Bu kısım aynı, hiç dokunmuyoruz ...
const CRYPTO_API_URL = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=try&order=market_cap_desc&per_page=25&page=1&sparkline=false';

const transformCryptoData = (apiData: any[]): FinancialAsset[] => {
  return apiData.map(item => ({
    id: item.id,
    name: item.name,
    symbol: item.symbol.toUpperCase(),
    image: item.image,
    currentPrice: item.current_price,
    priceChangePercentage24h: item.price_change_percentage_24h,
    tip: 'crypto',
  }));
};

export const fetchMarketData = async (): Promise<FinancialAsset[]> => {
  try {
    const response = await axios.get(CRYPTO_API_URL);
    return transformCryptoData(response.data);
  } catch (error) {
    console.error("API Error fetching crypto data:", error);
    throw new Error("Failed to fetch crypto data");
  }
};


// ------------------- CURRENCY DATA (DEĞİŞİKLİK BURADA) -------------------

const CURRENCY_DETAILS = {
  // DEĞİŞİKLİK: Tüm ikonları tutarlılık için flagcdn.com'dan alıyoruz
  USD: { name: 'Amerikan Doları', image: 'https://flagcdn.com/us.svg' },
  EUR: { name: 'Euro', image: 'https://catamphetamine.gitlab.io/country-flag-icons/3x2/EU.svg' },
  GBP: { name: 'İngiliz Sterlini', image: 'https://flagcdn.com/gb.svg' },
  CHF: { name: 'İsviçre Frangı', image: 'https://flagcdn.com/ch.svg' },
  CAD: { name: 'Kanada Doları', image: 'https://flagcdn.com/ca.svg' },
  AUD: { name: 'Avustralya Doları', image: 'https://flagcdn.com/au.svg' },
  JPY: { name: 'Japon Yeni', image: 'https://catamphetamine.gitlab.io/country-flag-icons/3x2/JP.svg' },
  SAR: { name: 'Suudi Arabistan Riyali', image: 'https://catamphetamine.gitlab.io/country-flag-icons/3x2/SA.svg' },
  NOK: { name: 'Norveç Kronu', image: 'https://flagcdn.com/no.svg' },
  SEK: { name: 'İsveç Kronu', image: 'https://flagcdn.com/se.svg' },
  DKK: { name: 'Danimarka Kronu', image: 'https://flagcdn.com/dk.svg' },
};

// Hangi para birimlerini istediğimizi bu objenin anahtarlarından alıyoruz
const TARGET_CURRENCIES = Object.keys(CURRENCY_DETAILS);

// DEĞİŞİKLİK: API Anahtarı kontrolünü ve URL oluşturmayı fonksiyonun içine taşıdık.
export const fetchCurrencyData = async (): Promise<FinancialAsset[]> => {
  const API_KEY = Constants.expoConfig?.extra?.exchangeRateApiKey;

  if (!API_KEY) {
    throw new Error("API Key for ExchangeRate is missing from app.json");
  }

  const CURRENCY_API_URL = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/TRY`;
  
  try {
    const response = await axios.get(CURRENCY_API_URL);
    if (response.data.result === 'success') {
      return transformCurrencyData(response.data); // Bu fonksiyonu aşağıya taşıdık
    } else {
      throw new Error(response.data['error-type'] || 'Unknown API error');
    }
  } catch (error) {
    console.error("API Error fetching currency data:", error);
    throw new Error("Failed to fetch currency data");
  }
};

const transformCurrencyData = (apiData: any): FinancialAsset[] => {
  const rates = apiData.conversion_rates;

  return TARGET_CURRENCIES.map(code => {
    const rate = rates[code];
    const price = 1 / rate;
    const details = CURRENCY_DETAILS[code as keyof typeof CURRENCY_DETAILS];

    return {
      id: code,
      name: details.name,
      symbol: code,
      image: details.image,
      currentPrice: price,
      priceChangePercentage24h: 0,
      tip: 'doviz',
    };
  });
};

// --- Metal Verisi (YENİDEN YAPILANDIRILDI) ---

const ONS_TO_GRAM_CONVERSION_RATE = 31.1035;

const transformMetalData = (apiData: any, usdToTryRate: number): FinancialAsset[] => {
  const rates = apiData.rates;
  
  const metalDetails = {
    XAU: { name: 'Altın (Gram)', symbol: 'XAU' },
    XAG: { name: 'Gümüş (Gram)', symbol: 'XAG' },
    XPT: { name: 'Platin (Ons)', symbol: 'XPT' },
    XPD: { name: 'Paladyum (Ons)', symbol: 'XPD' },
  };

  return Object.keys(metalDetails).map(symbol => {
    if (!rates[symbol]) return null;
    
    const details = metalDetails[symbol as keyof typeof metalDetails];
    // API'den gelen 1 Ons'un USD fiyatı
    let priceInUsd = 1 / rates[symbol]; 
    // USD fiyatını TRY fiyatına çevir
    let priceInTry = priceInUsd * usdToTryRate;

    if (symbol === 'XAU' || symbol === 'XAG') {
      priceInTry = priceInTry / ONS_TO_GRAM_CONVERSION_RATE;
    }

    return {
      id: symbol,
      name: details.name,
      symbol: details.symbol,
      currentPrice: priceInTry,
      priceChangePercentage24h: 0,
      tip: 'metal',
    };
  }).filter((item): item is FinancialAsset => item !== null);
};

export const fetchMetalData = async (): Promise<FinancialAsset[]> => {
  if (!METAL_PRICE_API_KEY || !EXCHANGE_RATE_API_KEY) {
    throw new Error("API Key for Metal or ExchangeRate is missing.");
  }

  const METAL_API_URL = `https://api.metalpriceapi.com/v1/latest?api_key=${METAL_PRICE_API_KEY}&base=USD&currencies=XAU,XAG,XPT,XPD`;
  const CURRENCY_API_URL = `https://v6.exchangerate-api.com/v6/${EXCHANGE_RATE_API_KEY}/latest/USD`;

  try {
    // İki API isteğini aynı anda yap
    const [metalResponse, currencyResponse] = await Promise.all([
      axios.get(METAL_API_URL),
      axios.get(CURRENCY_API_URL)
    ]);

    if (metalResponse.data.success && currencyResponse.data.result === 'success') {
      const usdToTryRate = currencyResponse.data.conversion_rates.TRY;
      return transformMetalData(metalResponse.data, usdToTryRate);
    } else {
      throw new Error("Failed to fetch data from one of the APIs");
    }
  } catch (error) {
    console.error("API Error fetching combined metal data:", error);
    throw new Error("Failed to fetch metal data");
  }
};

// ------------------- CHART DATA (YENİ KISIM) -------------------

// Grafik verisi için yeni bir tip tanımı
export type ChartDataPoint = [number, number]; // [timestamp, price]

// Fonksiyon artık tüm asset objesini alır ve sadece 'crypto' tipleri için API çağrısı yapar
export const fetchChartData = async (asset: FinancialAsset): Promise<ChartDataPoint[]> => {
  if (!asset) {
    throw new Error('Asset is required to fetch chart data');
  }

  // Sadece kripto varlıklar için grafik verisi çek
  if (asset.tip !== 'crypto') {
    return [];
  }

  try {
    const url = `https://api.coingecko.com/api/v3/coins/${asset.id}/market_chart?vs_currency=try&days=7`;
    const response = await axios.get(url);
    return response.data.prices as ChartDataPoint[];
  } catch (error) {
    console.error(`API Error fetching chart data for ${asset.id}:`, error);
    throw new Error('Failed to fetch chart data');
  }
};

// --- NEWS DATA ---
const NEWS_API_KEY = Constants.expoConfig?.extra?.newsApiKey;

export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

export const fetchNewsData = async (query: string): Promise<NewsArticle[]> => {
  if (!NEWS_API_KEY) {
    console.warn('News API Key is missing. Skipping news fetch.');
    return []; // Anahtar yoksa boş dizi döndür, uygulamayı çökertme
  }

  try {
    const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=tr&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
    const response = await axios.get(url);

    if (!response.data || !Array.isArray(response.data.articles)) {
      return [];
    }

    return response.data.articles.map((article: any) => ({
      title: article.title || '',
      url: article.url || '',
      source: article.source?.name || '',
      publishedAt: article.publishedAt || '',
    }));
  } catch (error) {
    console.error(`API Error fetching news for ${query}:`, error);
    return [];
  }
};