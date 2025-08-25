// components/TransactionDetailModal.tsx (YENİ VE ŞIK HALİ)
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { FlatList, Image, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, FontSize } from '../constants/Theme';
import { FinancialAsset, Transaction } from '../types';
import { TransactionListItem } from './TransactionListItem';

interface TransactionDetailModalProps {
  visible: boolean;
  onClose: () => void;
  asset: (FinancialAsset & { totalAmount?: number; }) | null;
  transactions: Transaction[];
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ visible, onClose, asset, transactions }) => {
  if (!asset) return null;

  const totalCost = transactions.reduce((sum, t) => sum + (t.amount * t.pricePerUnit), 0);
  const totalAmount = asset.totalAmount || 0;

  const renderIcon = (asset: FinancialAsset) => {
    const iconSize = 32;
    switch (asset.tip) {
      case 'parite':
      case 'doviz':
        return asset.image ? <Image source={{ uri: asset.image }} style={{ width: iconSize, height: iconSize }} /> : null;
      case 'altin':
        switch (asset.symbol) {
          case 'GR':
          case 'ÇEY':
          case 'YRM':
          case 'TAM':
          case 'CUM':
          case '22A':
            return <FontAwesome5 name="coins" size={iconSize} color="#FFD700" />;
          case 'GÜM':
            return <FontAwesome5 name="coins" size={iconSize} color="#C0C0C0" />;
          case 'PL':
            return <MaterialCommunityIcons name="ring" size={iconSize} color="#E5E4E2" />;
          case 'PA':
            return <MaterialCommunityIcons name="cube-outline" size={iconSize} color="#CED0DD" />;
          default:
            return <FontAwesome5 name="database" size={iconSize} color={Colors.textSecondary} />;
        }
      default:
        return null;
    }
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* HEADER */}
          <View style={styles.header}>
            <View style={styles.iconContainer}>
              {renderIcon(asset)}
            </View>
            <Text style={styles.title}>{asset.name}</Text>
            <Text style={styles.subtitle}>{asset.symbol} İşlemleri</Text>
          </View>

          {/* ÖZET KARTI */}
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Toplam Miktar</Text>
              <Text style={styles.summaryValue}>
                {totalAmount.toLocaleString()} {asset.symbol}
              </Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>Toplam Maliyet</Text>
              <Text style={styles.summaryValue}>
                ₺{totalCost.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
              </Text>
            </View>
          </View>

          {/* İŞLEM LİSTESİ */}
          <View style={styles.transactionsHeader}>
            <Text style={styles.transactionsTitle}>İşlem Geçmişi</Text>
            <Text style={styles.transactionsCount}>{transactions.length} işlem</Text>
          </View>

          <FlatList
            data={transactions}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TransactionListItem transaction={item} asset={asset} />}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            style={styles.transactionsList}
          />

          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Kapat</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: { 
    flex: 1, 
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.7)',
  },
  modalContent: { 
    backgroundColor: Colors.background,
    padding: 24, 
    height: '80%',
    borderTopLeftRadius: 24, 
    borderTopRightRadius: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.title,
    fontWeight: 'bold',
    marginBottom: 4,
    textAlign: 'center',
  },
  subtitle: {
    color: Colors.textSecondary,
    fontSize: FontSize.body,
    textAlign: 'center',
  },
  summaryCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryItem: {
    flex: 1,
    alignItems: 'center',
  },
  summaryLabel: {
    color: Colors.textSecondary,
    fontSize: FontSize.caption,
    marginBottom: 8,
    fontWeight: '500',
  },
  summaryValue: {
    color: Colors.textPrimary,
    fontSize: FontSize.subtitle,
    fontWeight: 'bold',
  },
  summaryDivider: {
    width: 1,
    height: 40,
    backgroundColor: Colors.border,
    marginHorizontal: 20,
  },
  transactionsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  transactionsTitle: {
    color: Colors.textPrimary,
    fontSize: FontSize.subtitle,
    fontWeight: '600',
  },
  transactionsCount: {
    color: Colors.textSecondary,
    fontSize: FontSize.caption,
  },
  transactionsList: {
    flex: 1,
    marginBottom: 16,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 16,
  },
  closeButton: {
    backgroundColor: Colors.card,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  closeButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: '600',
  },
});
