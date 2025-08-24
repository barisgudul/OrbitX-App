// components/AssetListItem.tsx (DOĞRU VE ÇALIŞAN HALİ)

import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { Colors, FontSize } from '../constants/Theme';
import { useFavoritesStore } from '../store/favoritesStore';
import { FinancialAsset } from '../types';

// renderIcon fonksiyonu
const renderIcon = (asset: FinancialAsset) => {
  const iconSize = 28;
  switch (asset.tip) {
    case 'metal':
      switch (asset.symbol) {
        case 'XAU': return <FontAwesome5 name="coins" size={iconSize} color="#FFD700" />;
        case 'XAG': return <FontAwesome5 name="coins" size={iconSize} color="#C0C0C0" />;
        default: return <FontAwesome5 name="database" size={iconSize} color={Colors.textSecondary} />;
      }
    case 'doviz':
      return asset.image ? <SvgUri width={40} height={40} uri={asset.image} /> : null;
    case 'crypto':
      return asset.image ? <Image source={{ uri: asset.image }} style={styles.image} /> : null;
    default:
      return null;
  }
};

interface AssetListItemProps {
  asset: FinancialAsset;
  index?: number; // make index optional to avoid runtime issues if a caller forgets to pass it
}

const AssetListItem: React.FC<AssetListItemProps> = ({ asset, index = 0 }) => {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const isAssetFavorite = isFavorite(asset.id);

  const priceChangeColor = asset.priceChangePercentage24h >= 0 ? Colors.accentGreen : Colors.accentRed;

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500, delay: index * 60 }}
    >
      <Link href={`/${asset.id}`} asChild>
        <Pressable>
          {({ pressed }) => (
            <View style={[styles.container, { backgroundColor: pressed ? '#161b22' : 'transparent' }]}>
              <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>
                  {renderIcon(asset)}
                </View>
                <View style={styles.nameContainer}>
                  <Text style={styles.name}>{asset.symbol}</Text>
                  <Text style={styles.symbol}>{asset.name}</Text>
                </View>
              </View>

              <View style={styles.rightContainer}>
                <View style={styles.priceContainer}>
                  <Text style={styles.price}>
                    ₺{asset.currentPrice.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                  </Text>
                  {asset.tip === 'crypto' && (
                    <Text style={[styles.change, { color: priceChangeColor }]}> 
                      {asset.priceChangePercentage24h.toFixed(2)}%
                    </Text>
                  )}
                </View>

                <TouchableOpacity
                  onPress={(e: any) => {
                    // Prevent the Link navigation when star is pressed
                    if (e && typeof e.preventDefault === 'function') e.preventDefault();
                    if (e && typeof e.stopPropagation === 'function') e.stopPropagation();
                    toggleFavorite(asset.id);
                  }}
                  style={styles.starContainer}
                >
                  <FontAwesome
                    name={isAssetFavorite ? 'star' : 'star-o'}
                    size={24}
                    color={isAssetFavorite ? '#FFD700' : Colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </Pressable>
      </Link>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 40,
    height: 40,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
  },
  nameContainer: { flex: 1 },
  name: { color: Colors.textPrimary, fontSize: FontSize.body, fontWeight: '600' },
  symbol: { color: Colors.textSecondary, fontSize: FontSize.caption },
  priceContainer: { alignItems: 'flex-end' },
  price: { color: Colors.textPrimary, fontSize: FontSize.body, fontWeight: '600' },
  change: { fontSize: FontSize.caption, fontWeight: '600' },
  starContainer: {
    paddingLeft: 16,
    paddingVertical: 8,
  },
});

export default AssetListItem;