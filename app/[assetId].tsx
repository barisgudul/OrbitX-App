// app/[assetId].tsx (NİHAİ VE CİLALANMIŞ TASARIM)

import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Linking, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { FakeHeader } from '../components/FakeHeader';
import { Colors, FontSize } from '../constants/Theme';
import { useConverterData } from '../hooks/useConverterData';
import { FinancialAsset } from '../types';

// NewsArticle interface tanımı
interface NewsArticle {
  title: string;
  url: string;
  source: string;
  publishedAt: string;
}

// AssetListItem'dan aldığımız ve burada da kullanacağımız renderIcon fonksiyonu
const renderIcon = (asset: FinancialAsset) => {
  const iconSize = 28;
  switch (asset.tip) {
    case 'parite':
    case 'doviz':
      return asset.image ? <Image source={{ uri: asset.image }} style={{ width: 32, height: 32 }} /> : null;
    case 'altin':
      switch (asset.symbol) {
        case 'XAU': return <FontAwesome5 name="coins" size={iconSize} color="#FFD700" />;
        case 'XAG': return <FontAwesome5 name="coins" size={iconSize} color="#C0C0C0" />;
        default: return <FontAwesome5 name="database" size={iconSize} color={Colors.textSecondary} />;
      }
    default:
      return null;
  }
};

const NewsCard: React.FC<{ item: NewsArticle }> = ({ item }) => {
  const publishedDate = new Date(item.publishedAt);
  const timeAgo = timeSince(publishedDate);
  return (
    <TouchableOpacity style={styles.newsCard} onPress={() => Linking.openURL(item.url)}>
      <Text style={styles.newsSource} numberOfLines={1}>{item.source} • {timeAgo}</Text>
      <Text style={styles.newsTitle} numberOfLines={3}>{item.title}</Text>
    </TouchableOpacity>
  );
};

export default function AssetDetailScreen() {
  const { assetId } = useLocalSearchParams();
  const assetIdString = Array.isArray(assetId) ? assetId[0] : assetId;

  const { data: allAssets, isLoading: isAssetsLoading } = useConverterData();
  const asset = allAssets?.find(a => a.id === assetIdString);

  // News functionality removed - using empty data for now
  const newsData: NewsArticle[] = [];
  const isNewsLoading = false;

  // Dönüştürücü için daha gelişmiş state'ler
  const [fromValue, setFromValue] = useState('1');
  const [toValue, setToValue] = useState('');
  const [isConvertingFromAsset, setIsConvertingFromAsset] = useState(true);

  // Varlık fiyatı değiştiğinde veya input değiştiğinde hesaplama yap
  useEffect(() => {
    if (asset) {
      if (isConvertingFromAsset) {
        const result = (parseFloat(fromValue.replace(',', '.') || '0') * asset.satis);
        setToValue(result.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }));
      } else {
        const result = (parseFloat(fromValue.replace(',', '.') || '0') / asset.satis);
        setToValue(result.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 6 }));
      }
    }
  }, [fromValue, isConvertingFromAsset, asset]);

  if (isAssetsLoading || !asset) {
    return <ActivityIndicator style={{ flex: 1, backgroundColor: Colors.background }} color={Colors.primary} />;
  }

  const handleFromChange = (text: string) => {
    setIsConvertingFromAsset(true);
    setFromValue(text);
  };

  const handleToChange = (text: string) => {
    setIsConvertingFromAsset(false);
    setFromValue(text); // Kaynak input'u her zaman fromValue'dur
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.background}}>
      <FakeHeader title={asset.symbol.toUpperCase()} />
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={styles.headerContainer}>
          <View style={styles.titleRow}>
            <View style={styles.iconContainer}>{renderIcon(asset)}</View>
            <Text style={styles.assetName}>{asset.name}</Text>
          </View>
          <Text style={styles.price}>
            ₺{asset.satis.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </Text>
        </View>

        <View style={styles.converterContainer}>
          <View style={styles.converterRow}>
            <Text style={styles.converterSymbol}>{isConvertingFromAsset ? asset.symbol : 'TRY'}</Text>
            <TextInput
              style={styles.converterInput}
              value={isConvertingFromAsset ? fromValue : toValue}
              onChangeText={handleFromChange}
              keyboardType="numeric"
              selectTextOnFocus
            />
          </View>
          <TouchableOpacity onPress={() => setIsConvertingFromAsset(!isConvertingFromAsset)} style={styles.converterIconContainer}>
            <FontAwesome5 name="exchange-alt" size={20} color={Colors.textSecondary} style={styles.converterIcon} />
          </TouchableOpacity>
          <View style={styles.converterRow}>
            <Text style={styles.converterSymbol}>{isConvertingFromAsset ? 'TRY' : asset.symbol}</Text>
            <TextInput
              style={styles.converterInput}
              value={isConvertingFromAsset ? toValue : fromValue}
              onChangeText={handleToChange}
              keyboardType="numeric"
              selectTextOnFocus
            />
          </View>
        </View>

        <Text style={styles.sectionTitle}>İlgili Haberler</Text>
        {isNewsLoading ? (
          <ActivityIndicator color={Colors.primary} style={{ marginTop: 20 }}/>
        ) : (
          // DEĞİŞİKLİK: newsData'nın boş olup olmadığını kontrol et
          newsData && newsData.length > 0 ? (
            <View>
              {newsData.map((item: NewsArticle) => <NewsCard key={item.url} item={item} />)}
            </View>
          ) : (
            <View style={styles.emptyNewsContainer}>
              <Text style={styles.emptyNewsText}>Bu varlık için ilgili haber bulunamadı.</Text>
            </View>
          )
        )}
      </ScrollView>
    </View>
  );
}

function timeSince(date: Date): string {
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = Math.floor(seconds / 31536000);
  if (interval >= 1) return `${interval} yıl önce`;

  interval = Math.floor(seconds / 2592000);
  if (interval >= 1) return `${interval} ay önce`;

  interval = Math.floor(seconds / 86400);
  if (interval >= 1) return `${interval} gün önce`;

  interval = Math.floor(seconds / 3600);
  if (interval >= 1) return `${interval} saat önce`;

  interval = Math.floor(seconds / 60);
  if (interval >= 1) return `${interval} dakika önce`;

  return 'Şimdi';
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, paddingHorizontal: 16 },
  headerContainer: { alignItems: 'flex-start', marginBottom: 24, paddingTop: 16, width: '100%' },
  titleRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  iconContainer: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  assetName: { color: Colors.textPrimary, fontSize: FontSize.title, fontWeight: '600' },
  price: { color: Colors.textPrimary, fontSize: 48, fontWeight: 'bold' },
  
  converterContainer: { backgroundColor: '#161b22', borderRadius: 12, padding: 16, marginBottom: 32, borderWidth: 1, borderColor: Colors.border },
  converterRow: { flexDirection: 'row', alignItems: 'center' },
  converterSymbol: { color: Colors.textSecondary, fontSize: FontSize.subtitle, fontWeight: '500', width: 60 },
  converterInput: { color: Colors.textPrimary, fontSize: 22, fontWeight: 'bold', textAlign: 'right', flex: 1, paddingVertical: 8 },
  converterIconContainer: { alignItems: 'center', paddingVertical: 8 },
  converterIcon: { transform: [{ rotate: '90deg' }] },

  sectionTitle: { color: Colors.textPrimary, fontSize: FontSize.subtitle, fontWeight: '600', marginBottom: 16, marginTop: 8 },
  newsCard: { backgroundColor: '#161b22', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: Colors.border },
  newsSource: { color: Colors.textSecondary, fontSize: FontSize.caption, marginBottom: 6 },
  newsTitle: { color: Colors.textPrimary, fontSize: FontSize.body, fontWeight: '500', lineHeight: 22 },
  emptyNewsContainer: {
    paddingVertical: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#161b22',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyNewsText: {
    color: Colors.textSecondary,
    fontSize: FontSize.body,
  },
});