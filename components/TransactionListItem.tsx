// components/TransactionListItem.tsx (YENİ VE BASİT HALİ)

import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, FontSize } from '../constants/Theme';
import { usePortfolioStore } from '../store/portfolioStore';
import { FinancialAsset, Transaction } from '../types';

interface TransactionListItemProps {
  transaction: Transaction;
  asset: FinancialAsset | undefined;
}

export const TransactionListItem: React.FC<TransactionListItemProps> = ({ transaction, asset }) => {
  const { removeTransaction } = usePortfolioStore();

  return (
    // Artık Swipeable yok, sadece basit bir View
    <View style={styles.transactionItem}>
      <View style={styles.transactionLeft}>
        <Text style={styles.transactionAmount}>
          {transaction.amount.toLocaleString()} {asset?.symbol || transaction.assetId}
        </Text>
        <Text style={styles.transactionPrice}>
          Alış: ₺{transaction.pricePerUnit.toLocaleString('tr-TR')}
        </Text>
      </View>
      
      <View style={styles.transactionMid}>
        <Text style={styles.transactionTotal}>
          ₺{(transaction.amount * transaction.pricePerUnit).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
        </Text>
      </View>

      {/* YENİ SİLME BUTONU */}
      <TouchableOpacity onPress={() => removeTransaction(transaction.id)} style={styles.deleteButton}>
        <FontAwesome name="trash" size={22} color={Colors.accentRed} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: Colors.background,
  },
  transactionLeft: {
    flex: 1, // Sol tarafın genişlemesini sağla
  },
  transactionAmount: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: '500',
  },
  transactionPrice: {
    color: Colors.textSecondary,
    fontSize: FontSize.caption,
    marginTop: 4,
  },
  transactionMid: {
    paddingHorizontal: 16,
  },
  transactionTotal: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 10, // Dokunma alanını büyüt
  },
});
