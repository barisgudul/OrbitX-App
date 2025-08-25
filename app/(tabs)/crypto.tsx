// app/(tabs)/crypto.tsx (DOĞRU VE NİHAİ LAYOUT)

import React, { useCallback, useMemo, useState } from 'react'; // useCallback'i import et
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AssetListItem, ItemSeparator } from '../../components/AssetListItem';
import { AssetListItemSkeleton } from '../../components/AssetListItemSkeleton'; // Yeni bileşeni import et
import { CustomHeader } from '../../components/CustomHeader'; // Header'ı burada import et
import { ErrorState } from '../../components/ErrorState'; // Yeni bileşeni import et
import { Colors, FontSize } from '../../constants/Theme';
import { useCryptoData } from '../../hooks/useCryptoData';

// YENİ VE GELİŞMİŞ SortType
type SortType = 
  | 'default' 
  | 'name-asc' | 'name-desc' 
  | 'price-asc' | 'price-desc' 
  | 'change-asc' | 'change-desc';

export default function CryptoScreen() {
  const { data: originalData, isLoading, isError, refetch } = useCryptoData();

  // YENİ STATE'LER
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>('default');

  // YENİ KISIM: Sadece kullanıcının başlattığı yenilemeyi takip etmek için bir state
  const [isRefreshing, setIsRefreshing] = useState(false);

  // YENİ SIRALAMA MANTIĞI
  const handleSortPress = (type: 'name' | 'price' | 'change') => {
    const currentSort = sortType;
    const ascSort: SortType = `${type}-asc` as SortType;
    const descSort: SortType = `${type}-desc` as SortType;
    
    if (currentSort === ascSort) {
      setSortType(descSort); // Eğer zaten artan sıralıysa, azalan yap
    } else {
      setSortType(ascSort); // Değilse, artan yap
    }
  };

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true); // Manuel yenileme başladı
    await refetch();      // Veriyi yeniden çek
    setIsRefreshing(false); // Manuel yenileme bitti
  }, [refetch]);

  const filteredAndSortedData = useMemo(() => {
    if (!originalData) return [];

    // 1. Filtreleme
    const q = searchQuery.trim().toLowerCase();
    let filtered = originalData.filter(asset => {
      if (!q) return true;
      return (
        asset.name.toLowerCase().includes(q) ||
        asset.symbol.toLowerCase().includes(q)
      );
    });

    // 2. YENİ switch bloğu
    switch (sortType) {
      case 'name-asc': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': filtered.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'price-asc': filtered.sort((a, b) => a.currentPrice - b.currentPrice); break;
      case 'price-desc': filtered.sort((a, b) => b.currentPrice - a.currentPrice); break;
      case 'change-asc': filtered.sort((a, b) => a.priceChangePercentage24h - b.priceChangePercentage24h); break;
      case 'change-desc': filtered.sort((a, b) => b.priceChangePercentage24h - a.priceChangePercentage24h); break;
      default: break;
    }

    return filtered;
  }, [originalData, searchQuery, sortType]);

  // DEĞİŞİKLİK BURADA:
  // Sadece ilk yüklemede ve elimizde hiç veri yokken tam ekran yükleme göstergesi göster.
  if (isLoading && !originalData) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Kendi başlığımızı güvenli alanın içine koyuyoruz */}
        <CustomHeader title="Kripto" />
        
        {/* Arama çubuğunun da iskeletini gösterebiliriz veya direkt listeyi gösteririz */}
        <View style={styles.contentContainer}>
          <View style={styles.controlsContainer}>
            <TextInput
              style={styles.searchInput}
              placeholder="Arama yap..."
              placeholderTextColor={Colors.textSecondary}
              value=""
              editable={false}
            />
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortContainer}>
              {[...Array(4).keys()].map(i => (
                <View key={i} style={[styles.sortButton, { opacity: 0.3 }]}>
                  <Text style={styles.sortButtonText}>...</Text>
                </View>
              ))}
            </ScrollView>
          </View>
          {/* 5 adet iskelet elemanı gösterelim */}
          {[...Array(5).keys()].map(i => <AssetListItemSkeleton key={i} />)}
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    // DEĞİŞİKLİK BURADA
    return <ErrorState onRetry={refetch} />;
  }

  return (
    // En dışı SafeAreaView ile sarmalıyoruz
    <SafeAreaView style={styles.container}>
      {/* Kendi başlığımızı güvenli alanın içine koyuyoruz */}
      <CustomHeader title="Kripto" />

      {/* Geri kalan her şey bir View içinde */}
      <View style={styles.contentContainer}>
        {/* Arama ve Sıralama Bölümü */}
        <View style={styles.controlsContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Arama yap..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* --- YENİ SIRALAMA BUTONLARI BÖLÜMÜ --- */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortContainer}>
            <TouchableOpacity
              style={[styles.sortButton, sortType === 'default' && styles.sortButtonActive]}
              onPress={() => setSortType('default')}
            >
              <Text style={[styles.sortButtonText, sortType === 'default' && styles.sortButtonTextActive]}>Varsayılan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortButton, (sortType === 'name-asc' || sortType === 'name-desc') && styles.sortButtonActive]}
              onPress={() => handleSortPress('name')}
            >
              <Text style={[styles.sortButtonText, (sortType === 'name-asc' || sortType === 'name-desc') && styles.sortButtonTextActive]}>
                İsim {sortType === 'name-asc' ? '↑' : sortType === 'name-desc' ? '↓' : ''}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortButton, (sortType === 'price-asc' || sortType === 'price-desc') && styles.sortButtonActive]}
              onPress={() => handleSortPress('price')}
            >
              <Text style={[styles.sortButtonText, (sortType === 'price-asc' || sortType === 'price-desc') && styles.sortButtonTextActive]}>
                Fiyat {sortType === 'price-asc' ? '↑' : sortType === 'price-desc' ? '↓' : ''}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.sortButton, (sortType === 'change-asc' || sortType === 'change-desc') && styles.sortButtonActive]}
              onPress={() => handleSortPress('change')}
            >
              <Text style={[styles.sortButtonText, (sortType === 'change-asc' || sortType === 'change-desc') && styles.sortButtonTextActive]}>
                Değişim {sortType === 'change-asc' ? '↑' : sortType === 'change-desc' ? '↓' : ''}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* --- LİSTE BÖLÜMÜNÜ GÜNCELLE --- */}
        <FlatList
          data={filteredAndSortedData}
          renderItem={({ item, index }) => <AssetListItem asset={item} index={index} />}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Sonuç bulunamadı.</Text>
          }
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
  // Bu stil, yükleme ve hata durumunda içeriği ortalamak için kullanılabilir.
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  // --- YENİ STİLLER ---
  controlsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInput: {
    backgroundColor: '#161b22',
    color: Colors.textPrimary,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: FontSize.body,
    marginBottom: 16,
  },
  emptyText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 50,
    fontSize: FontSize.subtitle,
  },
  text: {
    color: Colors.textPrimary,
    fontSize: 18,
    textAlign: 'center',
  },
  sortContainer: {
    flexDirection: 'row',
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortButtonActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  sortButtonText: {
    color: Colors.textSecondary,
    fontSize: 14,
  },
  sortButtonTextActive: {
    color: Colors.textPrimary,
    fontWeight: '600',
  },
});