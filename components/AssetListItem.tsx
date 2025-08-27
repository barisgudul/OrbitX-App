// components/AssetListItem.tsx (YENİ KART TASARIMI)

import { FontAwesome } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Theme';
import { useFavoritesStore } from '../store/favoritesStore';
import { FinancialAsset } from '../types';

interface AssetListItemProps {
  asset: FinancialAsset;
  index: number;
  onPress?: () => void;
}

const AssetListItem: React.FC<AssetListItemProps> = ({ asset, index, onPress }) => {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const isAssetFavorite = isFavorite(asset.id);

  const renderIcon = (asset: FinancialAsset) => {
    if (asset.image) {
      return <Image source={{ uri: asset.image }} style={styles.image} resizeMode="contain" />;
    }
    return <FontAwesome name="database" size={28} color={Colors.textSecondary} />;
  };

  const content = (pressed: boolean) => (
    <View style={[styles.card, { backgroundColor: pressed ? '#101010' : Colors.card }]}>
      <View style={styles.leftContainer}>
        <View style={styles.iconContainer}>{renderIcon(asset)}</View>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{asset.name}</Text>
          <Text style={styles.symbol}>{asset.symbol}</Text>
        </View>
      </View>
      <View style={styles.rightContainer}>
        <View style={styles.priceContainer}>
          <Text style={styles.satisPrice}>
            ₺{asset.satis.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>
        <View style={styles.priceContainer}>
          <Text style={styles.alisPrice}>
            ₺{asset.alis.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
        </View>
        <TouchableOpacity onPress={(e) => {
          e.preventDefault();
          toggleFavorite(asset.id);
        }} style={styles.starContainer}>
          <FontAwesome name={isAssetFavorite ? 'star' : 'star-o'} size={22} color={isAssetFavorite ? '#FFD700' : Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 300, delay: index * 50 }}
    >
      <TouchableOpacity onPress={onPress}>
        {content(false)}
      </TouchableOpacity>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 6,
    paddingVertical: 12, // Dikey padding'i biraz azaltalım
    paddingHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  
  leftContainer: {
    flex: 1, 
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 40, // İkonu biraz küçültelim
    height: 40,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: { 
    width: 40, // İkonu biraz küçültelim
    height: 40 
  },
  nameContainer: {
    flex: 1,
    justifyContent: 'center',
  },

  // DEĞİŞİKLİK BURADA
  name: {
    color: Colors.textPrimary,
    fontSize: 15, // Yazı boyutunu 16'dan 15'e çektik
    fontWeight: '600',
  },
  symbol: {
    color: Colors.textSecondary,
    fontSize: 12, // Bunu da 13'ten 12'ye çektik
    paddingTop: 4,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  satisPrice: {
    color: Colors.textPrimary,
    fontSize: 15, // Satış fiyatını 16'dan 15'e çektik
    fontWeight: '600',
  },
  alisPrice: {
    color: Colors.textSecondary,
    fontSize: 12, // Alış fiyatını 13'ten 12'ye çektik
    paddingTop: 4,
  },
  // DEĞİŞİKLİK BİTTİ
  
  starContainer: {
    paddingLeft: 12, // Yıldızla arasını biraz daralttık
    padding: 8,
  },
  separator: { height: 1, backgroundColor: Colors.border },
});

const ItemSeparator = () => <View style={styles.separator} />;

export { AssetListItem, ItemSeparator };
