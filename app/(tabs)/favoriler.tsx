// app/(tabs)/favoriler.tsx 

import React, { useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { AltinListItem } from '../../components/AltinListItem';
import { CustomHeader } from '../../components/CustomHeader';
import { DovizListItem } from '../../components/DovizListItem';
import { PariteListItem } from '../../components/PariteListItem';
import { SocialDrawer } from '../../components/SocialDrawer';
import { FontSize } from '../../constants/Theme';
import { useCombinedMarketData } from '../../hooks/useCombinedMarketData';
import { useThemeColors } from '../../hooks/useTheme';
import { useFavoritesStore } from '../../store/favoritesStore';
import { FinancialAsset } from '../../types';

const HEADER_HEIGHT = 60; // BU SABİTİ TANIMLA! CustomHeader'ın yüksekliği bu.

export default function FavorilerScreen() {
  const { data: allAssets = [], isLoading, isError } = useCombinedMarketData();
  const { favorites } = useFavoritesStore();
  const colors = useThemeColors();
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);

  const favoriteAssets = allAssets.filter((asset: FinancialAsset) => favorites.includes(asset.id));

  const renderFavoriteItem = ({ item, index }: { item: FinancialAsset; index: number }) => {
    // Güvenlik kontrolü ekle
    if (!item || !item.tip) {
      console.log('❌ Invalid item:', item);
      return null; // Geçersiz item'ları render etme
    }

    // Döviz için DovizListItem, Parite için PariteListItem, Altın için AltinListItem kullan
    if (item.tip === 'doviz') {
      return <DovizListItem asset={item} index={index} />;
    } else if (item.tip === 'parite') {
      return <PariteListItem asset={item} index={index} />;
    } else {
      return <AltinListItem asset={item} index={index} />;
    }
  };

  const renderSeparator = () => {
    // Sabit bir separator döndür, item'a bağımlı olmasın
    return <View style={{ height: 1, backgroundColor: colors.border }} />;
  };

  if (isLoading && favoriteAssets.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader title="Favoriler" />
        <View style={styles.centerContent}>
          <Text style={[styles.loadingText, { color: colors.textSecondary }]}>Favoriler yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isError) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader title="Favoriler" />
        <View style={styles.centerContent}>
          <Text style={[styles.errorText, { color: colors.textSecondary }]}>Veri yüklenirken hata oluştu.</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (favoriteAssets.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader title="Favoriler" />
        <View style={styles.centerContent}>
          <Text style={[styles.emptyText, { color: colors.textPrimary }]}>Henüz favori varlığınız yok.</Text>
          <Text style={[styles.emptySubtext, { color: colors.textSecondary }]}>Varlıkları favorilere ekleyerek burada takip edebilirsiniz.</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <CustomHeader title="Favoriler" onDrawerToggle={() => setIsDrawerVisible(true)} />
      <View style={styles.contentContainer}>
        <FlatList
          data={favoriteAssets}
          keyExtractor={(item) => item?.id || `unknown_${Math.random()}`}
          renderItem={renderFavoriteItem}
          ItemSeparatorComponent={renderSeparator}
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  loadingText: {
    fontSize: FontSize.subtitle,
  },
  errorText: {
    fontSize: FontSize.subtitle,
    textAlign: 'center',
  },
  emptyText: {
    fontSize: FontSize.title,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: FontSize.body,
    textAlign: 'center',
  },
});