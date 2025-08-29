// components/AltinListItem.tsx 

import { FontAwesome } from '@expo/vector-icons';
import { MotiView } from 'moti';
import React from 'react';
import { Image, ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '../hooks/useTheme';
import { useFavoritesStore } from '../store/favoritesStore';
import { FinancialAsset } from '../types';
import { ListItemOverlay } from './ListItemOverlay';

interface AssetListItemProps {
  asset: FinancialAsset;
  index: number;
  onPress?: () => void;
}

const AltinListItem: React.FC<AssetListItemProps> = ({ asset, index, onPress }) => {
  const { toggleFavorite, isFavorite } = useFavoritesStore();
  const colors = useThemeColors(); // Artık theme objesinin tamamını alıyoruz
  const { isDark } = colors; // isDark'ı buradan al, daha temiz.
  const isAssetFavorite = isFavorite(asset.id);

  const getBackgroundImage = (asset: FinancialAsset) => {
    if (asset.image) {
      return asset.image;
    }
    // Varsayılan arka planlar
    switch (asset.id) {
      case 'HAS_ALTIN': return 'https://images.unsplash.com/photo-1610375461369-d613b5633e53?w=400&h=200&fit=crop';
      case 'GRAM_ALTIN': return 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=200&fit=crop';
      case 'CEYREK_YENI': return 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=400&h=200&fit=crop';
      default: return 'https://images.unsplash.com/photo-1610375461369-d613b5633e53?w=400&h=200&fit=crop';
    }
  };

  const renderIcon = (asset: FinancialAsset) => {
    if (asset.image) {
      return <Image source={{ uri: asset.image }} style={styles.image} resizeMode="contain" />;
    }
    return <FontAwesome name="database" size={28} color={colors.textSecondary} />;
  };

  const content = (pressed: boolean) => (
    <ImageBackground source={{ uri: getBackgroundImage(asset) }}
      style={[
        styles.card, 
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
        <View style={styles.leftContainer}>
          <View style={styles.iconContainer}>{renderIcon(asset)}</View>
          <View style={styles.nameContainer}>
            <Text style={[styles.name, { color: colors.textPrimary }, !isDark && styles.lightThemeTextShadow]}>
              {asset.name}
            </Text>
          </View>
        </View>
        <View style={styles.rightContainer}>
          <View style={styles.priceContainer}>
            <Text style={[styles.satisPrice, { color: colors.textPrimary }, !isDark && styles.lightThemeTextShadow]}>
              Satış: ₺{asset.satis.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
            <Text style={[styles.alisPrice, { color: colors.textSecondary }, !isDark && styles.lightThemeTextShadow]}>
              Alış: ₺{asset.alis.toLocaleString('tr-TR', { minimumFractionDigits: 2 })}
            </Text>
          </View>
          <TouchableOpacity onPress={(e) => {
            e.preventDefault();
            toggleFavorite(asset.id);
          }} style={styles.starContainer}>
            <FontAwesome name={isAssetFavorite ? 'star' : 'star-o'} size={22} color={isAssetFavorite ? '#FFD700' : colors.textPrimary} />
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
  card: {
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

  // DEĞİŞİKLİK BURADA BAŞLIYOR
  leftContainer: {
    flex: 1, // Esnek genişlik
    flexDirection: 'row',
    alignItems: 'center', // İkon ve metinleri dikeyde hizala
    marginRight: 8,
    // overflow: 'hidden' SİLİNDİ. Artık yazıyı kesmeyeceğiz.
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 0,
  },
  
  iconContainer: {
    width: 42,
    height: 42,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'flex-start', // İkon her zaman en üstte hizalansın
  },
  image: {
    width: 42,
    height: 42
  },
  nameContainer: {
    flex: 1, // Kalan tüm alanı kapla
    justifyContent: 'center'
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    flexWrap: 'wrap' // Bu sihirli kelime: Eğer sığmazsan, alt satıra geç!
  },
  // DEĞİŞİKLİK BİTTİ

  priceContainer: {
    alignItems: 'flex-end'
  },
  satisPrice: {
    fontSize: 16,
    fontWeight: '600',
  },
  alisPrice: {
    fontSize: 13,
    paddingTop: 4,
  },
  starContainer: {
    paddingLeft: 16,
    padding: 8
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

export { AltinListItem, ItemSeparator };
