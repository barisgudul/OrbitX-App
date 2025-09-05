// components/DovizListItem.tsx

import React from 'react';
import { Image, View } from 'react-native';
import { useThemeColors } from '../hooks/useTheme';
import { FinancialAsset } from '../types';
import { BaseAssetListItem } from './BaseAssetListItem';

interface AssetListItemProps {
  asset: FinancialAsset;
  index: number;
  onPress?: () => void;
}

// Tema destekli döviz ikonu
const DovizIcon: React.FC<{ asset: FinancialAsset }> = ({ asset }) => {
  const colors = useThemeColors();

  return (
    <Image
      source={{ uri: asset.image }}
      style={{
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: colors.border
      }}
    />
  );
};

export const DovizListItem: React.FC<AssetListItemProps> = ({ asset, index, onPress }) => {
  return (
    <BaseAssetListItem
      asset={asset}
      index={index}
      onPress={onPress}
      renderIcon={(asset) => <DovizIcon asset={asset} />}
      alisValue={`₺${asset.alis.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
      satisValue={`₺${asset.satis.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
    />
  );
};

// ItemSeparator hâlâ lazım.
const ItemSeparator = () => {
  const colors = useThemeColors();
  return <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 16 }} />;
};

export { ItemSeparator };
