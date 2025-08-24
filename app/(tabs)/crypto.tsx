// app/(tabs)/index.tsx

import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AssetListItem from '../../components/AssetListItem';
import { Colors, FontSize } from '../../constants/Theme';
import { useCryptoData } from '../../hooks/useCryptoData';

// Sıralama türleri için bir tip tanımı
type SortType = 'default' | 'name-asc' | 'price-desc' | 'change-desc';

export default function CryptoScreen() {
  const { data: originalData, isLoading, isError, refetch, isFetching } = useCryptoData();

  // YENİ STATE'LER
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>('default');

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

    // 2. Sıralama
    switch (sortType) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.currentPrice - a.currentPrice);
        break;
      case 'change-desc':
        filtered.sort((a, b) => b.priceChangePercentage24h - a.priceChangePercentage24h);
        break;
      case 'default':
      default:
        break;
    }

    return filtered;
  }, [originalData, searchQuery, sortType]);

  if (isLoading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.container}>
        <Text style={styles.text}>Veri yüklenirken bir hata oluştu.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* --- ARAMA VE SIRALAMA BÖLÜMÜ --- */}
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
            style={[styles.sortButton, sortType === 'name-asc' && styles.sortButtonActive]}
            onPress={() => setSortType('name-asc')}
          >
            <Text style={[styles.sortButtonText, sortType === 'name-asc' && styles.sortButtonTextActive]}>İsim ↑</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sortButton, sortType === 'price-desc' && styles.sortButtonActive]}
            onPress={() => setSortType('price-desc')}
          >
            <Text style={[styles.sortButtonText, sortType === 'price-desc' && styles.sortButtonTextActive]}>Fiyat ↓</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.sortButton, sortType === 'change-desc' && styles.sortButtonActive]}
            onPress={() => setSortType('change-desc')}
          >
            <Text style={[styles.sortButtonText, sortType === 'change-desc' && styles.sortButtonTextActive]}>Değişim ↓</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* --- LİSTE BÖLÜMÜ --- */}
      <FlatList
        data={filteredAndSortedData}
        renderItem={({ item, index }) => <AssetListItem asset={item} index={index} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          <Text style={styles.emptyText}>Sonuç bulunamadı.</Text>
        }
        // Pull to refresh
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