// types/index.ts

// Tek bir fiyat ve zaman noktası için tip tanımı
export type ChartDataPoint = [number, number]; // [timestamp, price]

export interface FinancialAsset {
  id: string;
  name: string;
  symbol: string;
  alis: number; // Alış fiyatı
  satis: number; // Satış fiyatı (Bunu currentPrice olarak kullanacağız)
  tip: 'doviz' | 'altin' | 'parite';
  image?: string;
  // Yüzdesel değişim API'de yok, bu yüzden opsiyonel yapalım
  priceChangePercentage24h?: number; 
}

export interface Transaction {
  id: string; // Eşsiz bir ID, örn: timestamp
  assetId: string; // Hangi varlık olduğu, örn: 'bitcoin', 'USD'
  type: 'buy' | 'sell'; // Alım mı, satım mı?
  amount: number; // Ne kadar alındı/satıldı?
  pricePerUnit: number; // Alındığı/satıldığı andaki birim fiyatı
  date: string; // İşlem tarihi (ISO formatında)
}