// app/selectAsset.tsx
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import { AssetListItem, ItemSeparator } from '../components/AssetListItem'; // Ana bileşenimizi import ediyoruz
import { FakeHeader } from '../components/FakeHeader';
import { Colors, FontSize } from '../constants/Theme';
import { useConverterData } from '../hooks/useConverterData';
import { useConverterStore } from '../store/converterStore'; // BU YENİ IMPORT

export default function SelectAssetScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { data: allAssets } = useConverterData(); // Çevirici için sadece doviz ve altin verileri
  const [searchQuery, setSearchQuery] = useState('');

  // Store'dan fonksiyonları al
  const { setFromAsset, setToAsset } = useConverterStore();

  const target = params.target as 'from' | 'to';

  const filteredAssets = useMemo(() => {
    if (!allAssets) return [];
    // Sadece döviz ve altın varlıkları göster, parite'leri filtrele
    const dovizAltinAssets = allAssets.filter(asset => 
      asset.tip === 'doviz' || asset.tip === 'altin'
    );
    
    // Arama sorgusuna göre filtrele
    return dovizAltinAssets.filter(asset =>
      asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      asset.symbol.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allAssets, searchQuery]);



  return (
    <SafeAreaView style={styles.container}>
      
      <FakeHeader title="Varlık Seçin" />

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Varlık Ara..."
          placeholderTextColor={Colors.textSecondary}
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <FlatList
        data={filteredAssets}
        keyExtractor={(item) => item.id}
        renderItem={({ item, index }) => (
          // DEĞİŞİKLİK BURADA: Artık AssetListItem'ı özel bir görevle çağırıyoruz
          <AssetListItem
            asset={item}
            index={index}
            onPress={() => {
              // Hangi kutucuk hedeflendiyse, onun state'ini güncelle
              if (target === 'from') {
                setFromAsset(item);
              } else {
                setToAsset(item);
              }
              // Çevirici ekranına geri dön
              router.back();
            }}
          />
        )}
        ItemSeparatorComponent={ItemSeparator}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(106, 130, 251, 0.08)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: FontSize.title,
    fontWeight: 'bold',
    color: Colors.textPrimary,
  },
  cancelText: {
    fontSize: FontSize.body,
    color: Colors.primary,
    fontWeight: '500',
  },
  searchContainer: {
    padding: 20,
    paddingTop: 24, // Header'dan sonra minimal boşluk
  },
  searchInput: {
    backgroundColor: Colors.card,
    borderRadius: 12,
    padding: 16,
    fontSize: FontSize.body,
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.border,
  },


});
