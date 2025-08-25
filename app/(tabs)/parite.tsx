// app/(tabs)/crypto.tsx (DOĞRU VE NİHAİ LAYOUT)

import React, { useMemo, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { CustomHeader } from '../../components/CustomHeader';
import { ItemSeparator, PariteListItem } from '../../components/PariteListItem';
import { Colors, FontSize } from '../../constants/Theme';
import { usePariteData } from '../../hooks/usePariteData';
import { FinancialAsset } from '../../types';

// YENİ VE GELİŞMİŞ SortType
type SortType = 
  | 'default' 
  | 'name-asc' | 'name-desc' 
  | 'price-asc' | 'price-desc';

export default function PariteScreen() {
  const { data: originalData = [], isLoading, isError, refetch } = usePariteData();

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
  if (isLoading && !originalData) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Kendi başlığımızı güvenli alanın içine koyuyoruz */}
        <CustomHeader title="Parite" />
        
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
            <View style={styles.sortContainer}>
              {[...Array(4).keys()].map(i => (
                <View key={i} style={[styles.sortButton, { opacity: 0.3 }]}>
                  <Text style={styles.sortButtonText}>...</Text>
                </View>
              ))}
            </View>
          </View>
          {/* 5 adet iskelet elemanı gösterelim */}
          {[...Array(5).keys()].map(i => <PariteListItem key={i} asset={{} as FinancialAsset} index={i} />)}
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader title="Parite" />
        <View style={styles.centerContent}>
          <Text style={styles.errorText}>Veri yüklenirken hata oluştu.</Text>
          <TouchableOpacity onPress={() => refetch()} style={styles.retryButton}>
            <Text style={styles.retryButtonText}>Tekrar Dene</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
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
          <View style={styles.sortContainer}>
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


          </View>
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
  errorText: {
    color: Colors.textSecondary,
    textAlign: 'center',
    marginTop: 50,
    fontSize: FontSize.subtitle,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
  },
  retryButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: '600',
  },
});