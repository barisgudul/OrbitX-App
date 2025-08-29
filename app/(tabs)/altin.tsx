// app/(tabs)/altin.tsx 
import React, { useMemo, useState } from 'react';
import { FlatList, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AltinListItem, ItemSeparator } from '../../components/AltinListItem';
import { AssetListItemSkeleton } from '../../components/AssetListItemSkeleton';
import { CustomHeader } from '../../components/CustomHeader';
import { ErrorState } from '../../components/ErrorState';
import { SocialDrawer } from '../../components/SocialDrawer';
import { FontSize } from '../../constants/Theme';
import { useGoldData } from '../../hooks/useGoldData';
import { useThemeColors } from '../../hooks/useTheme';

type SortType = 
  | 'default' 
  | 'name-asc' | 'name-desc' 
  | 'price-asc' | 'price-desc';

const HEADER_HEIGHT = 60;

export default function AltinScreen() {
  const { data: originalData = [], isLoading, isError, refetch } = useGoldData();
  const colors = useThemeColors();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortType, setSortType] = useState<SortType>('default');

  const handleSortPress = (type: 'name' | 'price') => {
    const currentSort = sortType;
    const ascSort: SortType = `${type}-asc` as SortType;
    const descSort: SortType = `${type}-desc` as SortType;
    
    if (currentSort === ascSort) {
      setSortType(descSort); 
    } else {
      setSortType(ascSort); 
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

    switch (sortType) {
      case 'name-asc': filtered.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'name-desc': filtered.sort((a, b) => b.name.localeCompare(a.name)); break;
      case 'price-asc': filtered.sort((a, b) => a.satis - b.satis); break;
      case 'price-desc': filtered.sort((a, b) => b.satis - a.satis); break;
      default: break;
    }

    return filtered;
  }, [originalData, searchQuery, sortType]);

  if (isLoading && originalData.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
        <CustomHeader title="Altın" />
        
        <View style={styles.contentContainer}>
          <View style={[styles.controlsContainer, { borderBottomColor: colors.border }]}>
            <TextInput
              style={[
                styles.searchInput, 
                { 
                  backgroundColor: colors.card, 
                  color: colors.textPrimary,
                  borderColor: colors.border,
                  ...colors.shadows.small
                }
              ]}
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
          {[...Array(5).keys()].map(i => <AssetListItemSkeleton key={i} />)}
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return <ErrorState onRetry={refetch} />;
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Altın" onDrawerToggle={() => setIsDrawerVisible(true)} />

      <View style={styles.contentContainer}>
        <View style={[styles.controlsContainer, { borderBottomColor: colors.border }]}>
          <TextInput
            style={[
              styles.searchInput, 
              { 
                backgroundColor: colors.card, 
                color: colors.textPrimary,
                borderColor: colors.border,
                ...colors.shadows.small
              }
            ]}
            placeholder="Arama yap..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />

          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.sortContainer}>
            {['default', 'name', 'price'].map((type) => {
              const isDefault = type === 'default';
              const isActive = isDefault ? sortType === 'default' : sortType.includes(type);
              
              // Aktif butonun arkaplanı primary, inaktifin card.
              const backgroundColor = isActive ? colors.primary : colors.card;
              // Aktif butonun yazı rengi textPrimary, inaktifin textSecondary. BU EN ÖNEMLİSİ!
              const textColor = isActive ? colors.textPrimary : colors.textSecondary;
              // Aktif butonun kenarlığı primary, inaktifin normal border.
              const borderColor = isActive ? colors.primary : colors.border;

              let buttonText = '';
              if (type === 'default') buttonText = 'Varsayılan';
              if (type === 'name') buttonText = `İsim ${sortType === 'name-asc' ? '↑' : sortType === 'name-desc' ? '↓' : ''}`;
              if (type === 'price') buttonText = `Fiyat ${sortType === 'price-asc' ? '↑' : sortType === 'price-desc' ? '↓' : ''}`;

              return (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.sortButton,
                    { 
                      backgroundColor, 
                      borderColor,
                      ...colors.shadows.small
                    }
                  ]}
                  onPress={() => isDefault ? setSortType('default') : handleSortPress(type as 'name' | 'price')}
                >
                  <Text style={[
                    styles.sortButtonText,
                    { color: textColor },
                    isActive && { fontWeight: '600' }
                  ]}>
                    {buttonText}
                  </Text>
                </TouchableOpacity>
              );
            })}
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
  contentContainer: {
    flex: 1,
  },
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
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    fontSize: FontSize.body,
    marginBottom: 16,
    borderWidth: 1,
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
  },
  sortButtonText: {
    fontSize: 14,
  },
  sortButtonTextActive: {
    fontWeight: '600',
  },
});