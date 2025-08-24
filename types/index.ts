// types/index.ts

// Tek bir fiyat ve zaman noktası için tip tanımı
export type ChartDataPoint = [number, number]; // [timestamp, price]

export interface FinancialAsset {
  id: string; // "bitcoin", "USD", "XAU" gibi eşsiz bir kod
  name: string; // "Bitcoin", "Amerikan Doları"
  symbol: string; // "BTC", "USD", "ALTIN"
  image?: string; // İkon URL'si (opsiyonel)
  currentPrice: number;
  priceChangePercentage24h: number;
  tip: 'crypto' | 'doviz' | 'metal';
}

export interface Transaction {
  id: string; // Eşsiz bir ID, örn: timestamp
  assetId: string; // Hangi varlık olduğu, örn: 'bitcoin', 'USD'
  type: 'buy' | 'sell'; // Alım mı, satım mı?
  amount: number; // Ne kadar alındı/satıldı?
  pricePerUnit: number; // Alındığı/satıldığı andaki birim fiyatı
  date: string; // İşlem tarihi (ISO formatında)
}