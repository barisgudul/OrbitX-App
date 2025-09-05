// components/PariteListItem.tsx

import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import { useThemeColors } from '../hooks/useTheme';
import { FinancialAsset } from '../types';
import { BaseAssetListItem } from './BaseAssetListItem';

interface AssetListItemProps {
  asset: FinancialAsset;
  index: number;
  onPress?: () => void;
}

// BU COMPONENT, SANATIN KENDİSİDİR - TEMA DESTEKLİ VERSİYON
const PariteIcon: React.FC<{ asset: FinancialAsset }> = ({ asset }) => {
  const colors = useThemeColors();

  // API'den gelen resim URL'sini '/' karakterine göre ikiye bölüyoruz.
  if (!asset.image) return null;
  const [flag1, flag2] = asset.image.split('/');

  return (
    <View style={styles.iconPairContainer}>
      <Image source={{ uri: flag1 }} style={[styles.flag, styles.flagLeft, { borderColor: colors.border }]} />
      <Image source={{ uri: flag2 }} style={[styles.flag, styles.flagRight, { borderColor: colors.border }]} />
    </View>
  );
};

export const PariteListItem: React.FC<AssetListItemProps> = ({ asset, index, onPress }) => {
  return (
    <BaseAssetListItem
      asset={asset}
      index={index}
      onPress={onPress}
      renderIcon={(asset) => <PariteIcon asset={asset} />}
      // Paritelerde ondalık basamak sayısı daha fazla olur, bu yüzden 4 haneye ayarlıyoruz.
      alisValue={asset.alis.toLocaleString('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
      satisValue={asset.satis.toLocaleString('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
    />
  );
};

const styles = StyleSheet.create({
  iconPairContainer: {
    width: 44,
    height: 44,
    position: 'relative',
  },
  flag: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    // borderColor artık dinamik olarak tema renklerinden geliyor
    position: 'absolute',
  },
  flagLeft: {
    top: 0,
    left: 0,
    zIndex: 1, // Sol bayrak üstte
  },
  flagRight: {
    bottom: 0,
    right: 0,
    zIndex: 0, // Sağ bayrak altta
  },
});

export const ItemSeparator = () => {
  const colors = useThemeColors();
  return <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 16 }} />;
};

