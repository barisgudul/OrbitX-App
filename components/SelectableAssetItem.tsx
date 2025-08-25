// components/SelectableAssetItem.tsx
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, FontSize } from '../constants/Theme';
import { FinancialAsset } from '../types';

interface SelectableAssetItemProps {
  asset: FinancialAsset;
  onPress: () => void;
}

export const SelectableAssetItem: React.FC<SelectableAssetItemProps> = ({ asset, onPress }) => {
  const renderIcon = (asset: FinancialAsset) => {
    const iconSize = 32;
    switch (asset.tip) {
      case 'parite':
      case 'doviz':
        // HER ŞEY İÇİN SADECE IMAGE KULLAN - %100 Expo Go Uyumlu
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
    <TouchableOpacity onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.leftContainer}>
          <View style={styles.iconContainer}>{renderIcon(asset)}</View>
          <View style={styles.nameContainer}>
            <Text style={styles.name}>{asset.symbol}</Text>
            <Text style={styles.symbol}>{asset.name}</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.price}>
            ₺{asset.satis.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </Text>
          {asset.priceChangePercentage24h && (
            <Text style={[
              styles.change,
              { color: asset.priceChangePercentage24h >= 0 ? Colors.accentGreen : Colors.accentRed }
            ]}>
              {asset.priceChangePercentage24h >= 0 ? '+' : ''}{asset.priceChangePercentage24h.toFixed(2)}%
            </Text>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: Colors.background,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: '600',
    marginBottom: 4,
  },
  symbol: {
    color: Colors.textSecondary,
    fontSize: FontSize.caption,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: '600',
    marginBottom: 4,
  },
  change: {
    fontSize: FontSize.caption,
    fontWeight: '500',
  },
});
