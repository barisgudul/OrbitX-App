// app/(tabs)/parite.tsx (DOĞRU VE NİHAİ LAYOUT)

import React, { useMemo, useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AssetListItemSkeleton } from '../../components/AssetListItemSkeleton';
import { CustomHeader } from '../../components/CustomHeader';
import { ErrorState } from '../../components/ErrorState';
import { ItemSeparator, PariteListItem } from '../../components/PariteListItem';
import { SocialDrawer } from '../../components/SocialDrawer';
import { FontSize } from '../../constants/Theme';
import { usePariteData } from '../../hooks/usePariteData';
import { useThemeColors } from '../../hooks/useTheme';
const HEADER_HEIGHT = 60;
// YENİ VE GELİŞMİŞ SortType
type SortType = 
  | 'default' 
  | 'name-asc' | 'name-desc' 
  | 'price-asc' | 'price-desc';

export default function PariteScreen() {
  const { data: originalData = [], isLoading, isError, refetch } = usePariteData();
  const colors = useThemeColors();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  // YENİ STATE'LER
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
      case 'price-asc': filtered.sort((a, b) => a.satis - b.satis); break;
      case 'price-desc': filtered.sort((a, b) => b.satis - a.satis); break;
      // Yeni API'de yüzdesel değişim yok, bu yüzden bu sıralamaları kaldırıyoruz
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
        <CustomHeader title="Parite" />
        
        {/* Arama çubuğunun da iskeletini gösterebiliriz veya direkt listeyi gösteririz */}
        <View style={styles.contentContainer}>
          <View style={[styles.controlsContainer, { borderBottomColor: colors.border }]}>
            <TextInput
              style={[styles.searchInput, { backgroundColor: colors.card, color: colors.textPrimary }]}
              placeholder="Arama yap..."
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
    return <ErrorState onRetry={refetch} />;
  }

  return (
    // En dışı SafeAreaView ile sarmalıyoruz
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Kendi başlığımızı güvenli alanın içine koyuyoruz */}
      <CustomHeader title="Parite" onDrawerToggle={() => setIsDrawerVisible(true)} />

      {/* Geri kalan her şey bir View içinde */}
      <View style={styles.contentContainer}>
        {/* Arama ve Sıralama Bölümü */}
        <View style={[styles.controlsContainer, { borderBottomColor: colors.border }]}>
          <TextInput
            style={[styles.searchInput, { backgroundColor: colors.card, color: colors.textPrimary }]}
            placeholder="Arama yap..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          {/* --- YENİ SIRALAMA BUTONLARI BÖLÜMÜ --- */}
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

        {/* --- LİSTE BÖLÜMÜNÜ GÜNCELLE --- */}
        <FlatList
          data={filteredAndSortedData}
          keyExtractor={(item) => item.id}
          renderItem={({ item, index }) => <PariteListItem asset={item} index={index} />}
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
  // --- YENİ STİLLER ---
  controlsContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
  },
  searchInput: {
    // backgroundColor: '#161b22', // SİL BUNU ARTIK!
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: FontSize.body,
    marginBottom: 16,
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
    // backgroundColor ve borderColor gibi dinamik stilleri buradan çıkar.
  },
  sortButtonText: {
    fontSize: 14,
  },
  sortButtonTextActive: {
    fontWeight: '600',
  },
  errorText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: FontSize.subtitle,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  retryButtonText: {
    fontSize: FontSize.body,
    fontWeight: '600',
  },
});