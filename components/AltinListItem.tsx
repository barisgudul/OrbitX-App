// components/AltinListItem.tsx

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

// Artık basit ve temiz.
const renderIcon = (asset: FinancialAsset) => (
  <Image source={{ uri: asset.image }} style={{ width: '100%', height: '100%' }} />
);

export const AltinListItem: React.FC<AssetListItemProps> = ({ asset, index, onPress }) => {
  return (
    <BaseAssetListItem
      asset={asset}
      index={index}
      onPress={onPress}
      renderIcon={renderIcon}
      alisLabel={`Alış: ₺${asset.alis.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
      satisLabel={`Satış: ₺${asset.satis.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}`}
      // Altın için ana değer Satış olduğundan, onu daha belirgin yapalım.
      alisValue=""
      satisValue=""
    />
  );
};

export const ItemSeparator = () => {
  const colors = useThemeColors();
  return <View style={{ height: 1, backgroundColor: colors.border, marginHorizontal: 16 }} />;
};
