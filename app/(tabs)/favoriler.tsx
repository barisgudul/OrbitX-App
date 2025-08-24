// app/(tabs)/favoriler.tsx

import React from 'react';
import { ActivityIndicator, FlatList, StyleSheet, Text, View } from 'react-native';
import AssetListItem from '../../components/AssetListItem';
import { Colors, FontSize } from '../../constants/Theme';
import { useCombinedMarketData } from '../../hooks/useCombinedMarketData'; // Tüm verileri çeken hook
import { useFavoritesStore } from '../../store/favoritesStore';

export default function FavorilerScreen() {
  // Önce tüm piyasa verilerini ve favori ID'lerini çek
  const { data: allAssets, isLoading, isError, refetch, isFetching } = useCombinedMarketData();
  const { favorites } = useFavoritesStore();

  // Tüm veriler içinden sadece ID'si favoriler listesinde olanları filtrele
  const favoriteAssets = allAssets.filter(asset => favorites.includes(asset.id));

  if (isLoading) {
    // Eğer veriler hala yükleniyorsa, bir yükleme göstergesi gösterelim
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }
  
  if (isError) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.text}>Veri yüklenirken bir hata oluştu.</Text>
      </View>
    );
  }

  // Eğer hiç favori yoksa, bir bilgilendirme mesajı göster
  if (favoriteAssets.length === 0) {
    return (
      <View style={[styles.container, styles.center]}>
        <Text style={styles.text}>Henüz favori eklemediniz.</Text>
        <Text style={styles.subText}>
          Yıldız ikonuna dokunarak favorilerinizi ekleyebilirsiniz.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteAssets}
        renderItem={({ item, index }) => <AssetListItem asset={item} index={index} />}
        keyExtractor={(item) => item.id}
        onRefresh={refetch}
        refreshing={isFetching}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    textAlign: 'center',
  },
  subText: {
    color: Colors.textSecondary,
    fontSize: FontSize.caption,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 20,
  }
});