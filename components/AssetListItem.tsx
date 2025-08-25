// components/AssetListItem.tsx (MİNİMALİST VE ZARİF TASARIM)

import { FontAwesome, FontAwesome5 } from '@expo/vector-icons';
import { Link } from 'expo-router';
import { MotiView } from 'moti';
import React from 'react';
import { Image, Pressable, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SvgUri } from 'react-native-svg';
import { Colors } from '../constants/Theme';
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
      transition={{ type: 'timing', duration: 300, delay: index * 50 }}
    >
      <Link href={`/${asset.id}`} asChild>
        <Pressable>
          {({ pressed }) => (
            <View style={[styles.container, { backgroundColor: pressed ? '#101010' : 'transparent' }]}>
              {/* Sol Taraf: İkon ve İsimler */}
              <View style={styles.leftContainer}>
                <View style={styles.iconContainer}>{renderIcon(asset)}</View>
                <View style={styles.nameContainer}>
                  <Text style={styles.name}>{asset.symbol}</Text>
                  <Text style={styles.symbol}>{asset.name}</Text>
                </View>
              </View>

              {/* Orta Taraf: Fiyat ve Değişim */}
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

              {/* Sağ Taraf: Favori Yıldızı */}
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
                  size={22}
                  color={isAssetFavorite ? '#FFD700' : Colors.textSecondary}
                />
              </TouchableOpacity>
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
    alignItems: 'center',
    paddingVertical: 12, // Dikey boşluğu artırdık
    paddingHorizontal: 16,
  },
  leftContainer: {
    flex: 1, // Sol tarafın mümkün olduğunca genişlemesini sağla
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 42,
    height: 42,
    marginRight: 14, // Boşluğu artırdık
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 42,
    height: 42,
  },
  nameContainer: {},
  name: {
    color: Colors.textPrimary,
    fontSize: 17, // Fontu biraz büyüttük
    fontWeight: '600',
  },
  symbol: {
    color: Colors.textSecondary,
    fontSize: 14, // Fontu biraz büyüttük
    paddingTop: 4, // İsimle arasını açtık
  },
  priceContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: 16, // Yıldızla arasına boşluk koy
  },
  price: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  change: {
    fontSize: 13,
    fontWeight: '500',
    paddingTop: 4,
  },
  starContainer: {
    padding: 8, // Dokunma alanını büyüt
  },
  separator: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 72, // İkon + boşluk kadar içeriden başlat
  },
});

// Zarif Ayırıcı Çizgi için yeni bir bileşen
const ItemSeparator = () => <View style={styles.separator} />;

export { AssetListItem, ItemSeparator }; // İki bileşeni de export et
