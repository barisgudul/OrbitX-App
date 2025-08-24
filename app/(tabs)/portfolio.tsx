// app/(tabs)/portfolio.tsx

import React, { useState } from 'react';
import { Button, FlatList, StyleSheet, Text, View } from 'react-native';
import { AddTransactionModal } from '../../components/AddTransactionModal';
import { Colors, FontSize } from '../../constants/Theme';
import { useCombinedMarketData } from '../../hooks/useCombinedMarketData';
import { usePortfolioStore } from '../../store/portfolioStore';

export default function PortfolioScreen() {
  const { transactions } = usePortfolioStore();
  const { data: allAssets, isLoading } = useCombinedMarketData();
  
  const [modalVisible, setModalVisible] = useState(false);

  // --- Portföy Hesaplama Mantığı ---
  const portfolioValue = transactions.reduce((total, transaction) => {
    const asset = allAssets?.find(a => a.id === transaction.assetId);
    if (asset) {
      if (transaction.type === 'buy') {
        return total + (transaction.amount * asset.currentPrice);
      }
    }
    return total;
  }, 0);

  if (isLoading) {
    // ... yüklenme durumu
  }

  return (
    <View style={styles.container}>
      <View style={styles.summaryContainer}>
        <Text style={styles.summaryLabel}>Toplam Portföy Değeri</Text>
        <Text style={styles.summaryValue}>
          ₺{portfolioValue.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
      </View>

      <Button title="Yeni İşlem Ekle" onPress={() => setModalVisible(true)} />

      {/* İşlem listesini gösterelim */}
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        // renderItem'ı güncelliyoruz
        renderItem={({ item }) => {
          // İşlemin yapıldığı varlığın detaylarını bulalım
          const asset = allAssets?.find(a => a.id === item.assetId);
          
          return (
            <View style={styles.transactionItem}>
              <View style={styles.transactionLeft}>
                <Text style={styles.transactionAmount}>{Number(item.amount).toLocaleString()} {asset?.symbol || item.assetId}</Text>
                <Text style={styles.transactionPrice}>Alış: ₺{Number(item.pricePerUnit).toLocaleString('tr-TR')}</Text>
              </View>
              <View style={styles.transactionRight}>
                <Text style={styles.transactionTotal}>₺{(Number(item.amount) * Number(item.pricePerUnit)).toLocaleString('tr-TR', { minimumFractionDigits: 2 })}</Text>
              </View>
            </View>
          );
        }}
        style={{ marginTop: 20 }}
        ListHeaderComponent={<Text style={styles.listHeader}>İşlemlerim</Text>} // Listeye başlık ekleyelim
      />

      {/* Modal'ı ekrana ekliyoruz */}
      <AddTransactionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        assets={allAssets}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: 16 },
  summaryContainer: { alignItems: 'center', marginBottom: 32 },
  summaryLabel: { color: Colors.textSecondary, fontSize: FontSize.body },
  summaryValue: { color: Colors.textPrimary, fontSize: 40, fontWeight: 'bold', marginVertical: 8 },
  listHeader: {
    color: Colors.textPrimary,
    fontSize: FontSize.subtitle,
    fontWeight: '600',
    marginBottom: 8,
  },
  transactionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  transactionLeft: {
    flexDirection: 'column',
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
  transactionRight: {
    // Boş, hizalama için
  },
  transactionTotal: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: '600',
  },
});