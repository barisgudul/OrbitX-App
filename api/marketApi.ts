// api/marketApi.ts (NİHAİ VE EN DOĞRU YAPI)

import axios from 'axios';
import Constants from 'expo-constants';
import { FinancialAsset } from '../types';

// --- API Anahtarları ---
const EXCHANGE_RATE_API_KEY = Constants.expoConfig?.extra?.exchangeRateApiKey;

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

// ------------------- GOLD DATA (GERÇEK API VERİSİNE GÖRE NİHAİ VERSİYON) -------------------

const TRUNCGIL_API_URL = 'https://finans.truncgil.com/v4/today.json';

const transformTruncgilData = (apiData: any): FinancialAsset[] => {
  // DEĞİŞİKLİK: Listeyi API'deki tüm ilgili varlıkları içerecek şekilde genişletiyoruz
  const targetAssets = [
    // Altınlar
    { apiKey: 'GRA', name: 'Gram Altın', symbol: 'GR', tip: 'metal' as const },
    { apiKey: 'CEYREKALTIN', name: 'Çeyrek Altın', symbol: 'ÇEY', tip: 'metal' as const },
    { apiKey: 'YARIMALTIN', name: 'Yarım Altın', symbol: 'YRM', tip: 'metal' as const },
    { apiKey: 'TAMALTIN', name: 'Tam Altın', symbol: 'TAM', tip: 'metal' as const },
    { apiKey: 'CUMHURIYETALTINI', name: 'Cumhuriyet Altını', symbol: 'CUM', tip: 'metal' as const },
    { apiKey: 'ATAALTIN', name: 'Ata Altın', symbol: 'ATA', tip: 'metal' as const },
    { apiKey: 'RESATALTIN', name: 'Reşat Altın', symbol: 'REŞ', tip: 'metal' as const },
    { apiKey: 'HAMITALTIN', name: 'Hamit Altın', symbol: 'HAM', tip: 'metal' as const },
    { apiKey: 'IKIBUCUKALTIN', name: 'İkibuçuk Altın', symbol: 'İKİ', tip: 'metal' as const },
    { apiKey: 'GREMSEALTIN', name: 'Gremse Altın', symbol: 'GRE', tip: 'metal' as const },
    { apiKey: 'BESLIALTIN', name: 'Beşli Altın', symbol: 'BEŞ', tip: 'metal' as const },
    { apiKey: '14AYARALTIN', name: '14 Ayar Altın', symbol: '14A', tip: 'metal' as const },
    { apiKey: '18AYARALTIN', name: '18 Ayar Altın', symbol: '18A', tip: 'metal' as const },
    { apiKey: 'YIA', name: '22 Ayar Bilezik', symbol: '22A', tip: 'metal' as const },
    
    // Diğer Metaller
    { apiKey: 'GUMUS', name: 'Gümüş (Gram)', symbol: 'GÜM', tip: 'metal' as const },
    { apiKey: 'GPL', name: 'Platin (Gram)', symbol: 'PL', tip: 'metal' as const },
    { apiKey: 'PAL', name: 'Paladyum (Gram)', symbol: 'PA', tip: 'metal' as const },

    // Emtia ve Endeksler (Bunları da 'metal' tipi altında gösterebiliriz)
    { apiKey: 'BRENT', name: 'Brent Petrol', symbol: 'BRENT', tip: 'metal' as const },
    { apiKey: 'XU100', name: 'Bist 100', symbol: 'XU100', tip: 'metal' as const },
  ];

  return targetAssets
    .map(details => {
      const assetItem = apiData[details.apiKey];
      // Eğer API cevabında o varlık yoksa (örn: hafta sonu), listeye ekleme
      if (!assetItem || !assetItem.Selling) return null;

      // BRENT ve ONS için fiyatlar USD, bunları TRY'ye çevirmemiz gerekebilir.
      // Şimdilik API'den gelen değeri direkt alalım. Eğer 0 geliyorsa, göstermeyelim.
      if (assetItem.Selling === 0) return null;
      
      return {
        id: details.apiKey, // ID olarak API'nin anahtarını (GRA, CEYREKALTIN vb.) kullanalım
        name: details.name,
        symbol: details.symbol,
        // DEĞİŞİKLİK: Veri alanlarını gerçek API çıktısına göre güncelliyoruz (Selling, Change)
        currentPrice: assetItem.Selling,
        priceChangePercentage24h: assetItem.Change,
        tip: details.tip,
        image: '', // İkonları AssetListItem'da sembole göre belirleyeceğiz
      };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null); // Dizideki null değerleri temizle
};

export const fetchGoldData = async (): Promise<FinancialAsset[]> => {
  try {
    const response = await axios.get(TRUNCGIL_API_URL, { timeout: 10000 }); // Timeout'u biraz artıralım
    if (response.data) {
      return transformTruncgilData(response.data);
    } else {
      throw new Error("API response is empty");
    }
  } catch (error) {
    console.error("API Error fetching Truncgil gold data:", error);
    throw new Error("Failed to fetch gold data");
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