// components/BaseAssetListItem.tsx 

import { FontAwesome } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '../hooks/useTheme';
import { useFavoritesStore } from '../store/favoritesStore';
import { FinancialAsset } from '../types';

interface BaseAssetListItemProps {
  asset: FinancialAsset;
  index: number;
  onPress?: () => void;
  renderIcon: (asset: FinancialAsset) => React.ReactNode; // Resim/ikonu dışarıdan alacağız
  alisLabel?: string;
  satisLabel?: string;
  alisValue: string | number;
  satisValue: string | number;
}

export const BaseAssetListItem: React.FC<BaseAssetListItemProps> = ({
  asset,
  index,
  onPress,
  renderIcon,
  alisLabel = 'Alış',
  satisLabel = 'Satış',
  alisValue,
  satisValue,
}) => {
  const colors = useThemeColors();
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const isAssetFavorite = isFavorite(asset.id);

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 300, delay: index * 50 }}
    >
      <TouchableOpacity
        style={[
          styles.container,
          { 
            backgroundColor: colors.card,
            borderColor: colors.border,
            ...colors.shadows.medium,
          }
        ]}
        onPress={onPress}
      >
        {/* SOL TARAF: İKON VE İSİM */}
        <View style={styles.leftContainer}>
          <View style={styles.iconContainer}>
            {renderIcon(asset)}
          </View>
          <View style={styles.nameContainer}>
            {/* DEĞİŞİKLİK: Yazılar artık asla taşmayacak. */}
            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.name, { color: colors.textPrimary }]}>
              {asset.name}
            </Text>
            <Text numberOfLines={1} ellipsizeMode="tail" style={[styles.symbol, { color: colors.textSecondary }]}>
              {asset.symbol}
            </Text>
          </View>
        </View>

        {/* SAĞ TARAF: FİYATLAR VE YILDIZ */}
        <View style={styles.rightContainer}>
          <View style={styles.priceContainer}>
            <Text style={[styles.priceValue, { color: colors.textPrimary }]}>{satisValue}</Text>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>{satisLabel}</Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={[styles.priceValue, { color: colors.textPrimary }]}>{alisValue}</Text>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }]}>{alisLabel}</Text>
          </View>
          <TouchableOpacity 
            style={styles.starContainer}
            onPress={(e) => { e.stopPropagation(); toggleFavorite(asset.id); }}
          >
            <FontAwesome name={isAssetFavorite ? 'star' : 'star-o'} size={22} color={isAssetFavorite ? '#FFD700' : colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </MotiView>
  );
};

// DEĞİŞİKLİK: Flexbox stillerini DÜZELTİYORUZ!
const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 80,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
  },
  leftContainer: {
    flex: 1, // Sol taraf esnek olsun, mevcut alanı doldursun
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    minWidth: 0, // Bu çok önemli! Esnek elemanların küçülebilmesini sağlar.
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Resimlerin taşmasını engelle
  },
  nameContainer: {
    flex: 1, // İsim alanı da esnek olsun
    marginLeft: 12,
    minWidth: 0, // Bu da küçülebilsin
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
  },
  symbol: {
    fontSize: 13,
    paddingTop: 2,
  },
  rightContainer: {
    flexShrink: 0, // Sağ taraf ASLA küçülmesin, fiyatlar her zaman görünsün.
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginLeft: 12,
  },
  priceValue: {
    fontSize: 15,
    fontWeight: '500',
  },
  priceLabel: {
    fontSize: 12,
    paddingTop: 2,
  },
  starContainer: {
    paddingLeft: 12,
    padding: 8, // Dokunma alanını genişlet
  },
});
