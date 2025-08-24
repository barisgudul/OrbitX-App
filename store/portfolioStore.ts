// store/portfolioStore.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { Transaction } from '../types';

interface PortfolioState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  removeTransaction: (transactionId: string) => Promise<void>;
  loadTransactions: () => Promise<void>;
}

const PORTFOLIO_KEY = 'user-portfolio-transactions';

// --- HATA BÜYÜK İHTİMALLE BU SATIRDA ---
// 'export' kelimesinin burada olduğundan emin ol
export const usePortfolioStore = create<PortfolioState>((set, get) => ({
  transactions: [],
  
  addTransaction: async (newTransaction) => {
    const currentTransactions = get().transactions;
    const transactionWithId: Transaction = {
      ...newTransaction,
      id: new Date().toISOString(),
    };
    const updatedTransactions = [...currentTransactions, transactionWithId];
    
    await AsyncStorage.setItem(PORTFOLIO_KEY, JSON.stringify(updatedTransactions));
    set({ transactions: updatedTransactions });
  },

  removeTransaction: async (transactionId) => {
    const currentTransactions = get().transactions;
    const updatedTransactions = currentTransactions.filter(t => t.id !== transactionId);

    await AsyncStorage.setItem(PORTFOLIO_KEY, JSON.stringify(updatedTransactions));
    set({ transactions: updatedTransactions });
  },

  loadTransactions: async () => {
    try {
      const storedTransactions = await AsyncStorage.getItem(PORTFOLIO_KEY);
      if (storedTransactions) {
        set({ transactions: JSON.parse(storedTransactions) });
      }
    } catch (error) {
      console.error("Failed to load transactions from AsyncStorage", error);
    }
  },
}));