// app/(tabs)/cevirici.tsx

import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import {
    ActivityIndicator,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

import { CustomHeader } from '../../components/CustomHeader';
import { Colors, FontSize } from '../../constants/Theme';
import { useConverterData } from '../../hooks/useConverterData';
import { useConverterStore } from '../../store/converterStore';
import { FinancialAsset } from '../../types';

// Varlık seçim kutucuğu için ayrı bir bileşen
const AssetSelectBox: React.FC<{
  asset: FinancialAsset | null;
  amount: string;
  onAmountChange?: (text: string) => void;
  onPress: () => void;
  isInput: boolean;
}> = ({ asset, amount, onAmountChange, onPress, isInput }) => {
  return (
    <View style={styles.boxContainer}>
      <TouchableOpacity style={styles.assetButton} onPress={onPress}>
        {asset ? (
          <>
            {asset.image && <Image source={{ uri: asset.image }} style={styles.assetIcon} />}
            <Text style={styles.assetSymbol}>{asset.symbol || asset.name}</Text>
            <FontAwesome5 name="chevron-down" size={14} color={Colors.textSecondary} />
          </>
        ) : (
          <Text style={styles.assetSymbol}>Varlık Seç</Text>
        )}
      </TouchableOpacity>
      <TextInput
        style={styles.input}
        value={amount}
        onChangeText={onAmountChange}
        keyboardType="numeric"
        placeholder="0"
        placeholderTextColor={Colors.textSecondary}
        editable={isInput}
      />
    </View>
  );
};

export default function CeviriciScreen() {
  const router = useRouter();
  
  // Verileri çek
  const { data: assets = [], isLoading } = useConverterData();
  
  // State'i store'dan al
  const {
    fromAsset,
    toAsset,
    fromAmount,
    toAmount,
    setFromAsset,
    setToAsset,
    setFromAmount,
    swapAssets,
    calculateToAmount,
  } = useConverterStore();

  // İlk açılışta varsayılan varlıkları ata
  useEffect(() => {
    if (assets.length > 0 && !fromAsset && !toAsset) {
      let defaultFrom = assets.find(a => a.symbol === 'USD');
      let defaultTo = assets.find(a => a.symbol === 'TRY');
      
      if (!defaultFrom) {
        defaultFrom = assets[0];
      }
      if (!defaultTo || defaultTo.id === defaultFrom.id) {
        defaultTo = assets.length > 1 ? assets[1] : assets[0];
      }
      
      if (defaultFrom) setFromAsset(defaultFrom);
      // Sadece defaultTo varsa ve fromAsset'ten farklıysa ata
      if (defaultTo && defaultTo.id !== defaultFrom?.id) setToAsset(defaultTo);
    }
  }, [assets, fromAsset, toAsset, setFromAsset, setToAsset]); // <-- EKLENDİ
  
  // Varlıklar yüklendiğinde veya değiştiğinde yeniden hesapla
  useEffect(() => {
    if(fromAsset && toAsset) {
        calculateToAmount();
    }
  }, [fromAsset, toAsset, calculateToAmount]); // <-- EKLENDİ


  const handleSelectAsset = (target: 'from' | 'to') => {
    router.push(`/selectAsset?target=${target}`);
  };

  if (isLoading && assets.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader title="Çevirici" />
        <ActivityIndicator style={{ flex: 1 }} color={Colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Çevirici" />
      <View style={styles.content}>
        <AssetSelectBox
          asset={fromAsset}
          amount={fromAmount}
          onAmountChange={setFromAmount}
          onPress={() => handleSelectAsset('from')}
          isInput={true}
        />

        <TouchableOpacity style={styles.swapButton} onPress={swapAssets}>
          <FontAwesome5 name="exchange-alt" size={24} color={Colors.primary} />
        </TouchableOpacity>

        <AssetSelectBox
          asset={toAsset}
          amount={toAmount}
          onPress={() => handleSelectAsset('to')}
          isInput={false} // Bu input düzenlenemez, sadece sonuç gösterir
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
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  boxContainer: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    height: 80,
  },
  assetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: Colors.border,
  },
  assetIcon: {
    width: 32,
    height: 32,
    marginRight: 8,
  },
  assetSymbol: {
    color: Colors.textPrimary,
    fontSize: FontSize.subtitle,
    fontWeight: '600',
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'right',
    paddingLeft: 16,
  },
  swapButton: {
    alignSelf: 'center',
    marginVertical: 24,
    padding: 12,
    backgroundColor: Colors.card,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: Colors.border,
  },
});
