// app/(tabs)/index.tsx
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, FlatList, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import AssetListItem from '../../components/AssetListItem';
import { Colors, FontSize } from '../../constants/Theme';
import { useCurrencyData } from '../../hooks/useCurrencyData';

type SortType = 'default' | 'name-asc' | 'price-desc';

export default function DovizScreen() {
  const { data: originalData, isLoading, isError, error, refetch, isFetching } = useCurrencyData();

  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>('default');

  const filteredAndSortedData = useMemo(() => {
    if (!originalData) return [];

    const q = searchQuery.trim().toLowerCase();
    let filtered = originalData.filter(asset => {
      if (!q) return true;
      return (
        asset.name.toLowerCase().includes(q) ||
        asset.symbol.toLowerCase().includes(q)
      );
    });

    switch (sortType) {
      case 'name-asc':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'price-desc':
        filtered.sort((a, b) => b.currentPrice - a.currentPrice);
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
        <Text style={styles.errorText}>{error instanceof Error ? error.message : 'Bilinmeyen bir hata'}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.controlsContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Döviz kuru ara..."
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
        </ScrollView>
      </View>

      <FlatList
        data={filteredAndSortedData}
        renderItem={({ item, index }) => <AssetListItem asset={item} index={index} />}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<Text style={styles.emptyText}>Sonuç bulunamadı.</Text>}
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
  errorText: {
    color: Colors.accentRed,
    textAlign: 'center',
    marginTop: 8,
  }
});