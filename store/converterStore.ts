// store/converterStore.ts

import { create } from 'zustand';
import { FinancialAsset } from '../types';

interface ConverterState {
  fromAsset: FinancialAsset | null;
  toAsset: FinancialAsset | null;
  fromAmount: string;
  toAmount: string;
  // Fonksiyonlar
  setFromAsset: (asset: FinancialAsset) => void;
  setToAsset: (asset: FinancialAsset) => void;
  setFromAmount: (amount: string) => void;
  swapAssets: () => void;
  // Hesaplama için state'leri güncelle
  calculateToAmount: () => void;
}

export const useConverterStore = create<ConverterState>((set, get) => ({
  fromAsset: null,
  toAsset: null,
  fromAmount: '1',
  toAmount: '',

  setFromAsset: (asset) => {
    set({ fromAsset: asset });
    get().calculateToAmount(); // Varlık değişince yeniden hesapla
  },

  setToAsset: (asset) => {
    set({ toAsset: asset });
    get().calculateToAmount(); // Varlık değişince yeniden hesapla
  },

  setFromAmount: (amount) => {
    set({ fromAmount: amount });
    get().calculateToAmount(); // Miktar değişince yeniden hesapla
  },

  swapAssets: () => {
    const { fromAsset, toAsset, toAmount } = get(); // <-- fromAmount'ı SİLDİK.
    if (fromAsset && toAsset) {
      set({
        fromAsset: toAsset,
        toAsset: fromAsset,
        fromAmount: toAmount || '1', // Yer değiştirirken, eski "toAmount" yeni "fromAmount" olacak.
      });
      get().calculateToAmount();
    }
  },

  calculateToAmount: () => {
    const { fromAsset, toAsset, fromAmount } = get();
    if (!fromAsset || !toAsset || fromAmount === '') {
      set({ toAmount: '' });
      return;
    }

    const amount = parseFloat(fromAmount.replace(',', '.')) || 0;
    if (amount === 0) {
      set({ toAmount: '0' });
      return;
    }

    // Hesaplama mantığı: Her zaman TRY üzerinden çapraz kur yap.
    // (Miktar * Başlangıç Varlığının TRY Satış Fiyatı) / Hedef Varlığın TRY Satış Fiyatı
    const result = (amount * fromAsset.satis) / toAsset.satis;

    set({ toAmount: result.toLocaleString('tr-TR', { maximumFractionDigits: 6 }) });
  },
}));
