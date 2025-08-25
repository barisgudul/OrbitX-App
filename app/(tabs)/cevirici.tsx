// app/(tabs)/cevirici.tsx (NİHAİ VE EN AKILLI VERSİYON)

import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { Image, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { CustomHeader } from '../../components/CustomHeader';
import { Colors } from '../../constants/Theme';
import { useCombinedMarketData } from '../../hooks/useCombinedMarketData';
import { FinancialAsset } from '../../types';

export default function CeviriciScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { data: allAssets = [] } = useCombinedMarketData();
  
  const [fromAsset, setFromAsset] = useState<FinancialAsset | null>(null);
  const [toAsset, setToAsset] = useState<FinancialAsset | null>(null);
  const [amount, setAmount] = useState('1');
  const [activeInput, setActiveInput] = useState<'from' | 'to'>('from');

  // TEK, AKILLI useEffect: Hem varsayılanları ayarlar hem de seçimleri yönetir
  const handleAssetSelection = useCallback((selected: FinancialAsset, target: string) => {
    if (target === 'from') {
      // Eğer seçilen varlık, 'toAsset' ile aynıysa, onları yer değiştir (swap)
      if (toAsset?.id === selected.id) {
        setToAsset(fromAsset);
      }
      setFromAsset(selected);
    } else if (target === 'to') {
      // Eğer seçilen varlık, 'fromAsset' ile aynıysa, onları yer değiştir (swap)
      if (fromAsset?.id === selected.id) {
        setFromAsset(toAsset);
      }
      setToAsset(selected);
    }
  }, [fromAsset, toAsset]);

  const setDefaultAssets = useCallback(() => {
    if (allAssets.length > 0) {
      if (!fromAsset) {
        setFromAsset(allAssets.find(a => a.symbol === 'USD') || allAssets[0]);
      }
      if (!toAsset) {
        // Varsayılan olarak TRY'yi bulmaya çalışalım. API'de varsa harika olur.
        // Yoksa, ikinci en popüler döviz olan EUR'yu atayalım.
        setFromAsset(allAssets.find(a => a.symbol === 'USD') || allAssets[0]);
        setToAsset(allAssets.find(a => a.symbol === 'TRY') || allAssets.find(a => a.symbol === 'EUR') || allAssets[1]);
      }
    }
  }, [allAssets, fromAsset, toAsset]);

  useEffect(() => {
    // 1. Varlık seçim sayfasından bir parametre geldiyse, onu uygula
    if (params.selectedAsset) {
      try {
        const selected = JSON.parse(params.selectedAsset as string);
        handleAssetSelection(selected, params.target as string);
        // Parametre işlendi, temizleyelim (isteğe bağlı ama iyi pratik)
        router.setParams({ selectedAsset: undefined, target: undefined });
        return; // Parametre işlendiği için varsayılan atama kısmına geçme
      } catch (e) { console.error(e); }
    }

    // 2. Eğer parametre yoksa ve state'ler boşsa, varsayılanları ata
    setDefaultAssets();
  }, [params, allAssets, handleAssetSelection, setDefaultAssets]);

  const fromRate = fromAsset?.satis || 0;
  const toRate = toAsset?.satis || 0;
  const amountNumber = parseFloat(amount.replace(',', '.')) || 0;

  const fromAmountDisplay = activeInput === 'from' ? amount : (amountNumber * toRate / fromRate).toLocaleString('tr-TR', { maximumFractionDigits: 6 });
  const toAmountDisplay = activeInput === 'to' ? amount : (amountNumber * fromRate / toRate).toLocaleString('tr-TR', { maximumFractionDigits: 2 });

  const handleSwap = () => {
    const tempAsset = fromAsset;
    setFromAsset(toAsset);
    setToAsset(tempAsset);
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Çevirici" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          
          <View style={styles.converterBox}>
            {/* KAYNAK VARLIK */}
            <View style={styles.row}>
              <TouchableOpacity style={styles.assetButton} onPress={() => router.push(`/selectAsset?target=from`)}>
                <Image source={{ uri: fromAsset?.image }} style={styles.assetImage} />
                <Text style={styles.assetSymbol}>{fromAsset?.symbol}</Text>
                <FontAwesome5 name="chevron-down" size={12} color={Colors.textSecondary} />
              </TouchableOpacity>
              <TextInput
                style={styles.amountInput}
                value={fromAmountDisplay}
                onChangeText={(text) => {
                  setActiveInput('from');
                  setAmount(text);
                }}
                keyboardType="numeric"
                selectTextOnFocus
              />
            </View>

            <View style={styles.separator}>
              <View style={styles.line} />
              <TouchableOpacity onPress={handleSwap} style={styles.swapButton}>
                <FontAwesome5 name="exchange-alt" size={16} color={Colors.primary} />
              </TouchableOpacity>
              <View style={styles.line} />
            </View>

            {/* HEDEF VARLIK */}
            <View style={styles.row}>
              <TouchableOpacity style={styles.assetButton} onPress={() => router.push(`/selectAsset?target=to`)}>
                <Image source={{ uri: toAsset?.image }} style={styles.assetImage} />
                <Text style={styles.assetSymbol}>{toAsset?.symbol}</Text>
                <FontAwesome5 name="chevron-down" size={12} color={Colors.textSecondary} />
              </TouchableOpacity>
              <TextInput
                style={styles.amountInput}
                value={toAmountDisplay}
                onChangeText={(text) => {
                  setActiveInput('to');
                  setAmount(text);
                }}
                keyboardType="numeric"
                selectTextOnFocus
              />
            </View>
          </View>
          
          {fromAsset && toAsset && (
            <Text style={styles.rateText}>
              1 {fromAsset.symbol} ≈ {(fromRate / toRate).toFixed(4)} {toAsset.symbol}
            </Text>
          )}

        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  converterBox: { backgroundColor: Colors.card, borderRadius: 20, padding: 20, borderWidth: 1, borderColor: Colors.border },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  assetButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, padding: 12, borderRadius: 12 },
  assetImage: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  assetSymbol: { color: Colors.textPrimary, fontSize: 18, fontWeight: '600', marginRight: 8 },
  amountInput: { color: Colors.textPrimary, fontSize: 28, fontWeight: 'bold', textAlign: 'right', flex: 1 },
  separator: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  line: { flex: 1, height: 1, backgroundColor: Colors.border },
  swapButton: { padding: 12, borderWidth: 1, borderColor: Colors.border, borderRadius: 20, marginHorizontal: 16 },
  rateText: { color: Colors.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 24 },
});