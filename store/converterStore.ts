// store/converterStore.ts

import { create } from 'zustand';
import { FinancialAsset } from '../types';

interface ConverterState {
  fromAsset: FinancialAsset | null;
  toAsset: FinancialAsset | null;
  fromAmount: string;
  // İki ayrı sonuç için state'i genişletiyoruz
  toAmountAlis: string;
  toAmountSatis: string;
  // Fonksiyonlar
  setFromAsset: (asset: FinancialAsset) => void;
  setToAsset: (asset: FinancialAsset) => void;
  setFromAmount: (amount: string) => void;
  setQuickAmount: (amount: number) => void;
  calculateToAmount: () => void;
}

export const useConverterStore = create<ConverterState>((set, get) => ({
  fromAsset: null,
  toAsset: null,
  fromAmount: '1',
  toAmountAlis: '', // Alış sonucu
  toAmountSatis: '', // Satış sonucu

  setFromAsset: (asset) => {
    set({ fromAsset: asset });
    get().calculateToAmount();
  },

  setToAsset: (asset) => {
    set({ toAsset: asset });
    get().calculateToAmount();
  },

  setFromAmount: (amount: string) => {
    set({ fromAmount: amount });
    get().calculateToAmount();
  },

  // YENİ FONKSİYON: Hızlı miktar ayarlamak için
  setQuickAmount: (amount: number) => {
    // Rakamı string'e çevir, çünkü input'umuz string bekliyor.
    set({ fromAmount: amount.toString() }); 
    get().calculateToAmount(); // Ve hemen yeniden hesapla
  },

  // ARTIK HEM ALIŞ HEM SATIŞ HESAPLANIYOR
  calculateToAmount: () => {
    const { fromAsset, fromAmount } = get();
    // toAsset'e gerek kalmadı çünkü her zaman TRY (veya değeri 1) olacak
    if (!fromAsset || fromAmount === '') {
      set({ toAmountAlis: '', toAmountSatis: '' });
      return;
    }

    const amount = parseFloat(fromAmount.replace(',', '.')) || 0;
    if (amount === 0) {
      set({ toAmountAlis: '0', toAmountSatis: '0' });
      return;
    }

    // Alış ve Satış değerlerini ayrı ayrı hesapla
    const alisResult = amount * fromAsset.alis;
    const satisResult = amount * fromAsset.satis;

    set({ 
      toAmountAlis: alisResult.toLocaleString('tr-TR', { maximumFractionDigits: 2, minimumFractionDigits: 2 }),
      toAmountSatis: satisResult.toLocaleString('tr-TR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })
    });
  },
}));
