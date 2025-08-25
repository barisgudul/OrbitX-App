// components/AssetListItem.tsx (YENİ KART TASARIMI)

import { FontAwesome } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
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
    <View style={[styles.card, { backgroundColor: pressed ? '#1C1C1E' : '#161b22' }]}>
      {/* Sol Bölüm: İkon ve İsim */}
      <View style={styles.leftContainer}>
        <View style={styles.iconContainer}>{renderIcon(asset)}</View>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{asset.name}</Text>
          {/* DEĞİŞİKLİK: Sadece symbol alanı doluysa bu satırı göster */}
          {asset.symbol ? <Text style={styles.symbol}>{asset.symbol}</Text> : null}
        </View>
      </View>

      {/* Sağ Bölüm: Fiyatlar ve Favori */}
      <View style={styles.rightContainer}>
        <View style={styles.priceContainer}>
          {/* DEĞİŞİKLİK: 'satisPrice' stilini ve 'Satış' etiketini ekliyoruz */}
          <Text style={styles.satisPrice}>
            Satış: {asset.tip !== 'parite' && '₺'}
            {asset.satis.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </Text>
          <Text style={styles.alisPrice}>
            Alış: {asset.tip !== 'parite' && '₺'}{asset.alis.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
          </Text>
        </View>
        <TouchableOpacity onPress={(e) => { e.preventDefault(); toggleFavorite(asset.id); }} style={styles.starContainer}>
          <FontAwesome name={isAssetFavorite ? 'star' : 'star-o'} size={22} color={isAssetFavorite ? '#FFD700' : Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 300, delay: index * 50 }}>
      {onPress ? (
        <TouchableOpacity onPress={onPress}>{content(false)}</TouchableOpacity>
      ) : (
        <Link href={`/${asset.id}`} asChild>
          <Pressable>{({ pressed }) => content(pressed)}</Pressable>
        </Link>
      )}
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
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1, // Uzun isimlerin sığmasını sağla
  },
  iconContainer: {
    width: 42,
    height: 42,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: { 
    width: 42, 
    height: 42 
  },
  nameContainer: {
    justifyContent: 'center',
  },
  name: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  symbol: {
    color: Colors.textSecondary,
    fontSize: 13,
    paddingTop: 4,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  priceContainer: {
    alignItems: 'flex-end',
  },
  satisPrice: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  alisPrice: {
    color: Colors.textSecondary,
    fontSize: 13,
    paddingTop: 4,
  },
  starContainer: {
    paddingLeft: 16,
    padding: 8,
  },
  separator: { height: 1, backgroundColor: Colors.border },
});

const ItemSeparator = () => <View style={styles.separator} />;
export { AssetListItem, ItemSeparator };
