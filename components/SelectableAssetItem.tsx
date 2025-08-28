// components/SelectableAssetItem.tsx
import { FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontSize } from '../constants/Theme';
import { useThemeColors } from '../hooks/useTheme';
import { FinancialAsset } from '../types';

interface SelectableAssetItemProps {
  asset: FinancialAsset;
  onPress: () => void;
}

export const SelectableAssetItem: React.FC<SelectableAssetItemProps> = ({ asset, onPress }) => {
  const colors = useThemeColors();
  
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
            return <FontAwesome5 name="database" size={iconSize} color={colors.textSecondary} />;
        }
      default:
        return null;
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        <View style={styles.leftContainer}>
          <View style={[styles.iconContainer, { backgroundColor: colors.card }]}>{renderIcon(asset)}</View>
          <View style={styles.nameContainer}>
            <Text style={[styles.name, { color: colors.textPrimary }]}>{asset.symbol}</Text>
            <Text style={[styles.symbol, { color: colors.textSecondary }]}>{asset.name}</Text>
          </View>
        </View>
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { color: colors.textPrimary }]}>
            ₺{asset.satis.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </Text>
          {asset.priceChangePercentage24h && (
            <Text style={[
              styles.change,
              { color: asset.priceChangePercentage24h >= 0 ? colors.accentGreen : colors.accentRed }
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
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  nameContainer: {
    flex: 1,
  },
  name: {
    fontSize: FontSize.body,
    fontWeight: '600',
    marginBottom: 4,
  },
  symbol: {
    fontSize: FontSize.caption,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: FontSize.body,
    fontWeight: '600',
    marginBottom: 4,
  },
  change: {
    fontSize: FontSize.caption,
    fontWeight: '500',
  },
});
