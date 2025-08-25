// app/(tabs)/favoriler.tsx (DOĞRU VE NİHAİ LAYOUT)

import React, { useCallback, useState } from 'react'; // useCallback'i import et
import { FlatList, SafeAreaView, StyleSheet, View } from 'react-native';
import { AssetListItem, ItemSeparator } from '../../components/AssetListItem';
import { AssetListItemSkeleton } from '../../components/AssetListItemSkeleton'; // Yeni bileşeni import et
import { CustomHeader } from '../../components/CustomHeader'; // Header'ı burada import et
import { EmptyState } from '../../components/EmptyState'; // Yeni bileşeni import et
import { ErrorState } from '../../components/ErrorState'; // Yeni bileşeni import et
import { Colors, FontSize } from '../../constants/Theme';
import { useCombinedMarketData } from '../../hooks/useCombinedMarketData'; // Tüm verileri çeken hook
import { useFavoritesStore } from '../../store/favoritesStore';

export default function FavorilerScreen() {
  // Önce tüm piyasa verilerini ve favori ID'lerini çek
  const { data: allAssets, isLoading, isError, refetch } = useCombinedMarketData();
  const { favorites } = useFavoritesStore();

  // YENİ KISIM: Sadece kullanıcının başlattığı yenilemeyi takip etmek için bir state
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Tüm veriler içinden sadece ID'si favoriler listesinde olanları filtrele
  const favoriteAssets = allAssets.filter(asset => favorites.includes(asset.id));

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true); // Manuel yenileme başladı
    await refetch();      // Veriyi yeniden çek
    setIsRefreshing(false); // Manuel yenileme bitti
  }, [refetch]);

  // DEĞİŞİKLİK BURADA:
  // Sadece ilk yüklemede ve elimizde hiç veri yokken tam ekran yükleme göstergesi göster.
  if (isLoading && !allAssets) {
    // Eğer veriler hala yükleniyorsa, bir yükleme göstergesi gösterelim
    return (
      <SafeAreaView style={styles.container}>
        {/* Kendi başlığımızı güvenli alanın içine koyuyoruz */}
        <CustomHeader title="Favoriler" />
        
        {/* 5 adet iskelet elemanı gösterelim */}
        <View style={styles.contentContainer}>
          {[...Array(5).keys()].map(i => <AssetListItemSkeleton key={i} />)}
        </View>
      </SafeAreaView>
    );
  }
  
  if (isError) {
    // DEĞİŞİKLİK BURADA
    return <ErrorState onRetry={refetch} />;
  }

  // Eğer hiç favori yoksa, bir bilgilendirme mesajı göster
  if (favoriteAssets.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Kendi başlığımızı güvenli alanın içine koyuyoruz */}
        <CustomHeader title="Favoriler" />
        
        <View style={styles.contentContainer}>
          <EmptyState 
            icon="star-o"
            title="Henüz Favorin Yok"
            message="Piyasa ekranlarındaki yıldız ikonuna dokunarak takip etmek istediğin varlıkları buraya ekleyebilirsin."
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    // En dışı SafeAreaView ile sarmalıyoruz
    <SafeAreaView style={styles.container}>
      {/* Kendi başlığımızı güvenli alanın içine koyuyoruz */}
      <CustomHeader title="Favoriler" />

      {/* Geri kalan her şey bir View içinde */}
      <View style={styles.contentContainer}>
        <FlatList
          data={favoriteAssets}
          renderItem={({ item, index }) => <AssetListItem asset={item} index={index} />}
          keyExtractor={(item) => item.id}
          // DEĞİŞEN PROPLAR
          onRefresh={handleRefresh} // Bizim yeni, akıllı fonksiyonumuzu çağır
          refreshing={isRefreshing} // Sadece bizim manuel yenileme durumumuza bak
          contentContainerStyle={{ paddingTop: 10, paddingBottom: 10 }} // Üstte ve altta boşluk
          ItemSeparatorComponent={ItemSeparator}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  // YENİ STİL: Başlığın altındaki içeriği sarmalamak için
  contentContainer: {
    flex: 1,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Bu stil, yükleme ve hata durumunda içeriği ortalamak için kullanılabilir.
  centerContent: {
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