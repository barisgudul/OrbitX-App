// components/PariteListItem.tsx (FOTOĞRAFLI VE ŞIK VERSİYON)

import { FontAwesome } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Theme';
import { useFavoritesStore } from '../store/favoritesStore';
import { FinancialAsset } from '../types';

interface AssetListItemProps {
  asset: FinancialAsset;
  index: number;
  onPress?: () => void;
}

const PariteListItem: React.FC<AssetListItemProps> = ({ asset, index, onPress }) => {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const isAssetFavorite = isFavorite(asset.id);

  const content = (pressed: boolean) => (
    // DİĞERLERİ GİBİ IMAGEBACKGROUND KULLANIYORUZ
    <ImageBackground
      source={{ uri: asset.image }}
      style={[styles.container, { backgroundColor: pressed ? '#101010' : 'transparent' }]}
      imageStyle={styles.backgroundImageStyle}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <View style={styles.nameContainer}>
          <Text style={styles.name}>{asset.name}</Text>
          <Text style={styles.symbol}>{asset.symbol}</Text>
        </View>
        <View style={styles.priceSection}>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Alış</Text>
            <Text style={styles.priceValue}>
              {asset.alis.toLocaleString('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={styles.priceLabel}>Satış</Text>
            <Text style={styles.priceValue}>
              {asset.satis.toLocaleString('tr-TR', { minimumFractionDigits: 4, maximumFractionDigits: 4 })}
            </Text>
          </View>
          <TouchableOpacity onPress={(e) => { e.preventDefault(); toggleFavorite(asset.id); }} style={styles.starContainer}>
            <FontAwesome name={isAssetFavorite ? 'star' : 'star-o'} size={22} color={isAssetFavorite ? '#FFD700' : Colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
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

// STİLLER DÖVİZ BİLEŞENİNDEN KOPYALANDI VE UYARLANDI
const styles = StyleSheet.create({
  container: {
    minHeight: 90,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)'
  },
  backgroundImageStyle: {
    opacity: 0.3 // Parite için orta karar bir opaklık
  },
  overlay: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  nameContainer: {
    flex: 1, // Alanı doldur
    marginRight: 8, // Boşluk bırak
    justifyContent: 'center',
  },
  name: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  symbol: {
    color: 'rgba(230, 237, 243, 0.8)',
    fontSize: 14,
    paddingTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0, // Fiyatlar küçülmesin
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginLeft: 16,
  },
  priceLabel: {
    color: 'rgba(230, 237, 243, 0.7)',
    fontSize: 12,
    marginBottom: 2,
  },
  priceValue: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  starContainer: {
    paddingLeft: 16,
    padding: 8,
  },
  separator: { height: 1, backgroundColor: Colors.border },
});

const ItemSeparator = () => <View style={styles.separator} />;

export { ItemSeparator, PariteListItem };

