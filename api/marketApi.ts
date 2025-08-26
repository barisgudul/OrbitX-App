// api/marketApi.ts (NİHAİ VE KESİN ÇÖZÜM)

import axios from 'axios';
import { FinancialAsset } from '../types';

const BASE_URL = 'https://displaydata01.orbitbulut.com/eyyupoglu_altin_v1';

// API'den gelen veriyi bizim standart formatımıza çeviren genel fonksiyon
const transformData = (apiData: any[], tip: 'doviz' | 'altin' | 'parite'): FinancialAsset[] => {
  return apiData.map(item => {
    // GÜVENLİK: Her alanı tek tek doğrula
    const image = item.image && 
                  typeof item.image === 'string' && 
                  item.image.trim() !== '' && 
                  item.image !== 'null' && 
                  item.image !== 'undefined' &&
                  item.image.startsWith('http') 
                  ? item.image 
                  : undefined;
    
    return {
      id: item.kod || item.ad || `unknown_${Date.now()}_${Math.random()}`, // Eşsiz bir anahtar
      name: (tip === 'altin') ? item.yeni_ad : (tip === 'doviz') ? item.yeni_ad : (item.kod || item.ad), // Altın için 'Gram Altın', Döviz için 'USD', Parite için 'USDTRY'
      symbol: (tip === 'altin') ? '' : (tip === 'doviz') ? getDovizName(item.yeni_ad) : (tip === 'parite') ? 'Döviz Çifti' : item.yeni_ad, // Altın için boş, Döviz için doğru isim, Parite için 'Döviz Çifti'
      alis: parseFloat(item.alis) || 0,
      satis: parseFloat(item.satis) || 0,
      tip: tip,
      image: image, // Sadece geçerli URL'leri kabul et
    };
  });
};

// Döviz kısaltmalarına göre tam isimleri döndüren yardımcı fonksiyon
const getDovizName = (code: string): string => {
  switch (code) {
    case 'USD': return 'Amerikan Doları';
    case 'EUR': return 'Euro';
    case 'GBP': return 'İngiliz Sterlini';
    case 'JPY': return 'Japon Yeni';
    case 'CHF': return 'İsviçre Frangı';
    case 'CAD': return 'Kanada Doları';
    case 'AUD': return 'Avustralya Doları';
    case 'NZD': return 'Yeni Zelanda Doları';
    case 'TRY': return 'Türk Lirası';
    case 'RUB': return 'Rus Rublesi';
    case 'CNY': return 'Çin Yuanı';
    case 'INR': return 'Hint Rupisi';
    case 'BRL': return 'Brezilya Reali';
    case 'MXN': return 'Meksika Pesosu';
    case 'KRW': return 'Güney Kore Wonu';
    case 'SGD': return 'Singapur Doları';
    case 'HKD': return 'Hong Kong Doları';
    case 'SEK': return 'İsveç Kronu';
    case 'NOK': return 'Norveç Kronu';
    case 'DKK': return 'Danimarka Kronu';
    case 'PLN': return 'Polonya Zlotisi';
    case 'CZK': return 'Çek Korunası';
    case 'HUF': return 'Macar Forinti';
    case 'RON': return 'Romanya Leyi';
    case 'BGN': return 'Bulgar Levası';
    case 'HRK': return 'Hırvat Kunası';
    case 'RSD': return 'Sırp Dinarı';
    case 'UAH': return 'Ukrayna Grivnası';
    case 'ZAR': return 'Güney Afrika Randı';
    case 'THB': return 'Tayland Bahtı';
    case 'MYR': return 'Malezya Ringgiti';
    case 'IDR': return 'Endonezya Rupiahı';
    case 'PHP': return 'Filipin Pesosu';
    case 'VND': return 'Vietnam Dongu';
    case 'BDT': return 'Bangladeş Takası';
    case 'PKR': return 'Pakistan Rupisi';
    case 'LKR': return 'Sri Lanka Rupisi';
    case 'MMK': return 'Myanmar Kyatı';
    case 'KHR': return 'Kamboçya Rieli';
    case 'LAK': return 'Laos Kipi';
    case 'MNT': return 'Moğolistan Tugriki';
    case 'NPR': return 'Nepal Rupisi';
    case 'BTN': return 'Bhutan Ngultrumu';
    case 'MVR': return 'Maldiv Rufiyaası';
    case 'AFN': return 'Afgan Afganisi';
    case 'IRR': return 'İran Riyali';
    case 'IQD': return 'Irak Dinarı';
    case 'JOD': return 'Ürdün Dinarı';
    case 'KWD': return 'Kuveyt Dinarı';
    case 'BHD': return 'Bahreyn Dinarı';
    case 'OMR': return 'Umman Riyali';
    case 'QAR': return 'Katar Riyali';
    case 'SAR': return 'Suudi Arabistan Riyali';
    case 'AED': return 'Birleşik Arap Emirlikleri Dirhemi';
    case 'EGP': return 'Mısır Lirası';
    case 'MAD': return 'Fas Dirhemi';
    case 'TND': return 'Tunus Dinarı';
    case 'DZD': return 'Cezayir Dinarı';
    case 'LYD': return 'Libya Dinarı';
    case 'SDG': return 'Sudan Lirası';
    case 'ETB': return 'Etiyopya Birri';
    case 'KES': return 'Kenya Şilini';
    case 'UGX': return 'Uganda Şilini';
    case 'TZS': return 'Tanzanya Şilini';
    case 'NGN': return 'Nijerya Nairası';
    case 'GHS': return 'Gana Cedisi';
    case 'XOF': return 'Batı Afrika CFA Frangı';
    case 'XAF': return 'Orta Afrika CFA Frangı';
    case 'XPF': return 'Pasifik CFA Frangı';
    case 'CLP': return 'Şili Pesosu';
    case 'COP': return 'Kolombiya Pesosu';
    case 'PEN': return 'Peru Solu';
    case 'UYU': return 'Uruguay Pesosu';
    case 'PYG': return 'Paraguay Guaranisi';
    case 'BOB': return 'Bolivya Bolivianosu';
    case 'ARS': return 'Arjantin Pesosu';
    case 'VES': return 'Venezuela Bolivarı';
    case 'GYD': return 'Guyana Doları';
    case 'SRD': return 'Surinam Doları';
    case 'BBD': return 'Barbados Doları';
    case 'JMD': return 'Jamaika Doları';
    case 'TTD': return 'Trinidad ve Tobago Doları';
    case 'BZD': return 'Belize Doları';
    case 'FJD': return 'Fiji Doları';
    case 'SBD': return 'Solomon Adaları Doları';
    case 'VUV': return 'Vanuatu Vatu';
    case 'WST': return 'Samoa Talası';
    case 'TOP': return 'Tonga Paangası';
    case 'PGK': return 'Papua Yeni Gine Kinası';
    case 'KMF': return 'Komor Frangı';
    case 'DJF': return 'Cibuti Frangı';
    case 'RWF': return 'Ruanda Frangı';
    case 'BIF': return 'Burundi Frangı';
    case 'CDF': return 'Kongo Frangı';
    case 'GMD': return 'Gambiya Dalasisi';
    case 'SLL': return 'Sierra Leone Leonesi';
    case 'SOS': return 'Somali Şilini';
    case 'TJS': return 'Tacikistan Somonisi';
    case 'TMT': return 'Türkmenistan Manatı';
    case 'UZS': return 'Özbekistan Somu';
    case 'KGS': return 'Kırgızistan Somu';
    case 'MDL': return 'Moldova Leyi';
    case 'ALL': return 'Arnavutluk Leki';
    case 'MKD': return 'Kuzey Makedonya Denarı';
    case 'GEL': return 'Gürcistan Larisi';
    case 'AMD': return 'Ermenistan Dramı';
    case 'AZN': return 'Azerbaycan Manatı';
    case 'KZT': return 'Kazakistan Tengesi';
    default: return code; // Bilinmeyen kodlar için kodu olduğu gibi döndür
  }
};

// Her bir kategori için ayrı API fonksiyonları
export const fetchDovizData = async (): Promise<FinancialAsset[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/verileriGetir?tip=doviz`);
    return transformData(response.data, 'doviz');
  } catch (error) {
    console.error("API Error fetching doviz data:", error);
    throw new Error("Failed to fetch doviz data");
  }
};

export const fetchAltinData = async (): Promise<FinancialAsset[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/verileriGetir?tip=altin`);
    return transformData(response.data, 'altin');
  } catch (error) {
    console.error("API Error fetching altin data:", error);
    throw new Error("Failed to fetch altin data");
  }
};

export const fetchPariteData = async (): Promise<FinancialAsset[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/verileriGetir?tip=parite`);
    return transformData(response.data, 'parite');
  } catch (error) {
    console.error("API Error fetching parite data:", error);
    throw new Error("Failed to fetch parite data");
  }
};

// Çevirici için tüm verileri çeken fonksiyon
export const fetchConverterData = async (): Promise<FinancialAsset[]> => {
  try {
    const response = await axios.get(`${BASE_URL}/verileriGetir?tip=doviz_altin`);
    
    return response.data
      // --- BURASI YENİ ---
      .filter((item: any) => item.tip !== 'parite') // pariteleri direkt at
      .map((item: any) => {
        const image = item.image && 
                      typeof item.image === 'string' && 
                      item.image.trim() !== '' && 
                      item.image !== 'null' && 
                      item.image !== 'undefined' &&
                      item.image.startsWith('http') 
                      ? item.image 
                      : undefined;
        
        return {
            id: item.kod || item.ad || `unknown_${Date.now()}_${Math.random()}`,
            name: item.yeni_ad || item.ad || 'Bilinmeyen Varlık',
            symbol: item.kod || item.ad || 'UNK',
            alis: parseFloat(item.alis) || 0,
            satis: parseFloat(item.satis) || 0,
            tip: item.tip || 'doviz',
            image: image,
        };
      });
  } catch (error) {
    console.error("API Error fetching converter data:", error);
    throw new Error("Failed to fetch converter data");
  }
};


// Haber sistemi için basit bir yapı (opsiyonel)
export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

export const fetchNewsData = async (asset: FinancialAsset): Promise<NewsArticle[]> => {
  // Şimdilik basit bir mock veri döndürelim
  // Daha sonra gerçek haber API'si eklenebilir
  return [];
};