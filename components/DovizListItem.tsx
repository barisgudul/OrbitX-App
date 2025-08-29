// components/DovizListItem.tsx

import { FontAwesome } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '../hooks/useTheme';
import { useFavoritesStore } from '../store/favoritesStore';
import { FinancialAsset } from '../types';
import { ListItemOverlay } from './ListItemOverlay';

interface AssetListItemProps {
  asset: FinancialAsset;
  index: number;
  onPress?: () => void;
}

const DovizListItem: React.FC<AssetListItemProps> = ({ asset, index, onPress }) => {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const colors = useThemeColors(); // Artık theme objesinin tamamını alıyoruz
  const { isDark } = colors; // isDark'ı buradan al, daha temiz.
  const isAssetFavorite = isFavorite(asset.id);

  const content = (pressed: boolean) => (
    <ImageBackground source={{ uri: asset.image }}
      style={[
        styles.container, 
        { 
          backgroundColor: colors.card,
          borderColor: colors.border,
          ...colors.shadows.small 
        }
      ]}
      imageStyle={styles.backgroundImageStyle}
      resizeMode="cover"
    >
      <ListItemOverlay>
        <View style={styles.nameContainer}>
          <Text style={[styles.name, { color: colors.textPrimary }, !isDark && styles.lightThemeTextShadow]}>
            {asset.name}
          </Text>
          <Text style={[styles.symbol, { color: colors.textSecondary }, !isDark && styles.lightThemeTextShadow]}>
            {asset.symbol}
          </Text>
        </View>
        <View style={styles.priceSection}>
          <View style={styles.priceContainer}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }, !isDark && styles.lightThemeTextShadow]}>Alış</Text>
            <Text style={[styles.priceValue, { color: colors.textPrimary }, !isDark && styles.lightThemeTextShadow]}>
              ₺{asset.alis.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
          <View style={styles.priceContainer}>
            <Text style={[styles.priceLabel, { color: colors.textSecondary }, !isDark && styles.lightThemeTextShadow]}>Satış</Text>
            <Text style={[styles.priceValue, { color: colors.textPrimary }, !isDark && styles.lightThemeTextShadow]}>
              ₺{asset.satis.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
          <TouchableOpacity onPress={(e) => {
            e.preventDefault();
            toggleFavorite(asset.id);
          }} style={styles.starContainer}>
            <FontAwesome name={isAssetFavorite ? 'star' : 'star-o'} size={22} color={isAssetFavorite ? '#FFD700' : colors.textSecondary} />
          </TouchableOpacity>
        </View>
      </ListItemOverlay>
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

const styles = StyleSheet.create({
  container: {
    minHeight: 90,
    borderRadius: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    overflow: 'hidden',
    borderWidth: 1, // Kenarlık her zaman olsun
  },
  backgroundImageStyle: {
    opacity: 0.6
  },
  nameContainer: {
    flex: 1, // Mevcut alanın tamamını kaplamaya çalış
    marginRight: 8, // Sağdaki fiyat bölümüyle arasına boşluk koy
    justifyContent: 'center',
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  symbol: {
    fontSize: 14,
    paddingTop: 4,
  },
  priceSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0, // Bu bölümün küçülmesini engelle ki fiyatlar bozulmasın
  },
  priceContainer: {
    alignItems: 'flex-end',
    marginLeft: 16,
  },
  priceLabel: {
    fontSize: 12,
    marginBottom: 2,
  },
  priceValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  starContainer: {
    paddingLeft: 16,
    padding: 8,
  },
  separator: {
    height: 1,
  },
  // StyleSheet'in en altına YENİ STİLİ EKLE!
  lightThemeTextShadow: {
    textShadowColor: 'rgba(0, 0, 0, 0.5)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
});

const ItemSeparator = () => {
  const colors = useThemeColors();
  return <View style={[styles.separator, { backgroundColor: colors.border }]} />;
};

export { DovizListItem, ItemSeparator };
