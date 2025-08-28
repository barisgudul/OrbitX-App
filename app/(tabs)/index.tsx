// app/(tabs)/index.tsx 
import React, { useMemo, useState } from 'react'; // useCallback'i import et
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AssetListItemSkeleton } from '../../components/AssetListItemSkeleton';
import { CustomHeader } from '../../components/CustomHeader'; // Header'ı burada import et
import { DovizListItem, ItemSeparator } from '../../components/DovizListItem';
import { ErrorState } from '../../components/ErrorState'; // Yeni bileşeni import et
import { SocialDrawer } from '../../components/SocialDrawer';
import { FontSize } from '../../constants/Theme';
import { useCurrencyData } from '../../hooks/useCurrencyData';
import { useThemeColors } from '../../hooks/useTheme';
 const HEADER_HEIGHT = 60;
// YENİ VE GELİŞMİŞ SortType
type SortType = 
  | 'default' 
  | 'name-asc' | 'name-desc' 
  | 'price-asc' | 'price-desc';

export default function DovizScreen() {
  const { data: originalData = [], isLoading, isError, refetch } = useCurrencyData();
  const colors = useThemeColors();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>('default');
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

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
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        {/* Kendi başlığımızı güvenli alanın içine koyuyoruz */}
        <CustomHeader title="Döviz" />
        
        {/* Arama çubuğunun da iskeletini gösterebiliriz veya direkt listeyi gösteririz */}
        <View style={styles.contentContainer}>
          <View style={[styles.controlsContainer, { borderBottomColor: colors.border }]}>
            <TextInput
              style={[styles.searchInput, { color: colors.textPrimary }]}
              placeholder="Döviz kuru ara..."
              placeholderTextColor={colors.textSecondary}
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
    // En dışı SafeAreaView ile sarmalıyoruz
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      
      
      {/* Kendi başlığımızı güvenli alanın içine koyuyoruz */}
      <CustomHeader title="Döviz" onDrawerToggle={() => setIsDrawerVisible(true)} />

      {/* Geri kalan her şey bir View içinde */}
      <View style={styles.contentContainer}>
        <View style={[styles.controlsContainer, { borderBottomColor: colors.border }]}>
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary }]}
            placeholder="Döviz kuru ara..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortContainer}>
            <TouchableOpacity
              style={[
                styles.sortButton, 
                { borderColor: colors.border },
                sortType === 'default' && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => setSortType('default')}
            >
              <Text style={[
                styles.sortButtonText, 
                { color: colors.textSecondary },
                sortType === 'default' && { color: colors.textPrimary, fontWeight: '600' }
              ]}>Varsayılan</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sortButton, 
                { borderColor: colors.border },
                (sortType === 'name-asc' || sortType === 'name-desc') && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => handleSortPress('name')}
            >
              <Text style={[
                styles.sortButtonText, 
                { color: colors.textSecondary },
                (sortType === 'name-asc' || sortType === 'name-desc') && { color: colors.textPrimary, fontWeight: '600' }
              ]}>
                İsim {sortType === 'name-asc' ? '↑' : sortType === 'name-desc' ? '↓' : ''}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.sortButton, 
                { borderColor: colors.border },
                (sortType === 'price-asc' || sortType === 'price-desc') && { backgroundColor: colors.primary, borderColor: colors.primary }
              ]}
              onPress={() => handleSortPress('price')}
            >
              <Text style={[
                styles.sortButtonText, 
                { color: colors.textSecondary },
                (sortType === 'price-asc' || sortType === 'price-desc') && { color: colors.textPrimary, fontWeight: '600' }
              ]}>
                Fiyat {sortType === 'price-asc' ? '↑' : sortType === 'price-desc' ? '↓' : ''}
              </Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        <FlatList
          data={filteredAndSortedData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <DovizListItem asset={item} index={index} />}
          ItemSeparatorComponent={ItemSeparator}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
        />
      </View>

      {/* Sosyal Medya Drawer */}
      <SocialDrawer 
        isVisible={isDrawerVisible}
        onToggle={() => setIsDrawerVisible(!isDrawerVisible)}
        topOffset={HEADER_HEIGHT}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  },
  searchInput: {
    backgroundColor: '#161b22',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: FontSize.body,
    marginBottom: 16,
  },
  sortContainer: {
    flexDirection: 'row',
  },
  sortButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginRight: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sortButtonActive: {
  },
  sortButtonText: {
    fontSize: 14,
  },
  sortButtonTextActive: {
    fontWeight: '600',
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: FontSize.subtitle,
  },
  text: {
    fontSize: 18,
    textAlign: 'center',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 8,
  }
});