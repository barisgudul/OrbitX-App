// app/(tabs)/altin.tsx (DOĞRU VE NİHAİ LAYOUT)
import React, { useMemo, useState } from 'react'; // useCallback'i import et
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AltinListItem, ItemSeparator } from '../../components/AltinListItem';
import { AssetListItemSkeleton } from '../../components/AssetListItemSkeleton'; // Yeni bileşeni import et
import { CustomHeader } from '../../components/CustomHeader'; // Header'ı burada import et
import { ErrorState } from '../../components/ErrorState'; // Yeni bileşeni import et
import { Colors, FontSize } from '../../constants/Theme';
import { useGoldData } from '../../hooks/useGoldData';

// YENİ VE GELİŞMİŞ SortType
type SortType = 
  | 'default' 
  | 'name-asc' | 'name-desc' 
  | 'price-asc' | 'price-desc';

export default function AltinScreen() {
  const { data: originalData = [], isLoading, isError, refetch } = useGoldData();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>('default');

  // YENİ SIRALAMA MANTIĞI
  const handleSortPress = (type: 'name' | 'price') => {
    const currentSort = sortType;
    const ascSort: SortType = `${type}-asc` as SortType;
    const descSort: SortType = `${type}-desc` as SortType;
    
    if (currentSort === ascSort) {
      setSortType(descSort); // Eğer zaten artan sıralıysa, azalan yap
    } else {
      setSortType(ascSort); // Değilse, artan yap
    }
  };

  const filteredAndSortedData = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let filtered = originalData.filter(asset => {
      if (!q) return true;
      return (
        asset.name.toLowerCase().includes(q) ||
        asset.symbol.toLowerCase().includes(q)
      );
    });

    // YENİ switch bloğu
    switch (sortType) {
      case 'name-asc': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': filtered.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'price-asc': filtered.sort((a, b) => a.satis - b.satis); break;
      case 'price-desc': filtered.sort((a, b) => b.satis - a.satis); break;
      default: break;
    }

    return filtered;
  }, [originalData, searchQuery, sortType]);

  // DEĞİŞİKLİK BURADA:
  // Sadece ilk yüklemede ve elimizde hiç veri yokken tam ekran yükleme göstergesi göster.
  if (isLoading && originalData.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Kendi başlığımızı güvenli alanın içine koyuyoruz */}
        <CustomHeader title="Altın" />
        
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
              {[...Array(3).keys()].map(i => (
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
    <SafeAreaView style={styles.container}>
      {/* Kendi başlığımızı güvenli alanın içine koyuyoruz */}
      <CustomHeader title="Altın" />

      {/* Geri kalan her şey bir View içinde */}
      <View style={styles.contentContainer}>
        <View style={styles.controlsContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Arama yap..."
            placeholderTextColor={Colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

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
          </ScrollView>
        </View>

        <FlatList
          data={filteredAndSortedData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <AltinListItem asset={item} index={index} />}
          ItemSeparatorComponent={ItemSeparator}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
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