// components/TransactionListItem.tsx 
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontSize } from '../constants/Theme';
import { useThemeColors } from '../hooks/useTheme';

import { FinancialAsset, Transaction } from '../types';

interface TransactionListItemProps {
  transaction: Transaction;
  asset: FinancialAsset | undefined;
}

export const TransactionListItem: React.FC<TransactionListItemProps> = ({ transaction, asset }) => {
  const colors = useThemeColors();

  return (
    // Artık Swipeable yok, sadece basit bir View
    <View style={[styles.transactionItem, { backgroundColor: colors.background }]}>
      <View style={styles.transactionLeft}>
        <Text style={[styles.transactionAmount, { color: colors.textPrimary }]}>
          {transaction.amount.toLocaleString()} {asset?.symbol || transaction.assetId}
        </Text>
        <Text style={[styles.transactionPrice, { color: colors.textSecondary }]}>
          Alış: ₺{transaction.pricePerUnit.toLocaleString('tr-TR')}
        </Text>
      </View>
      
      <View style={styles.transactionMid}>
        <Text style={[styles.transactionTotal, { color: colors.textPrimary }]}>
          ₺{(transaction.amount * transaction.pricePerUnit).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
        </Text>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  transactionLeft: {
    flex: 1, // Sol tarafın genişlemesini sağla
  },
  transactionAmount: {
    fontSize: FontSize.body,
    fontWeight: '500',
  },
  transactionPrice: {
    fontSize: FontSize.caption,
    marginTop: 4,
  },
  transactionMid: {
    paddingHorizontal: 16,
  },
  transactionTotal: {
    fontSize: FontSize.body,
    fontWeight: '600',
  },
  deleteButton: {
    padding: 10, // Dokunma alanını büyüt
  },
});
