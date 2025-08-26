// app/(tabs)/cevirici.tsx
import { FontAwesome5 } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Keyboard,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { CustomHeader } from '../../components/CustomHeader';
import { Colors } from '../../constants/Theme';
import { useCombinedMarketData } from '../../hooks/useCombinedMarketData';
import { FinancialAsset } from '../../types';

export default function CeviriciScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { data: allAssets = [], isLoading } = useCombinedMarketData();

  // Sadece döviz + altın (parite tamamen hariç)
  const converterAssets = useMemo(
    () => allAssets.filter((a) => a.tip === 'doviz' || a.tip === 'altin'),
    [allAssets]
  );

  const [fromAsset, setFromAsset] = useState<FinancialAsset | null>(null);
  const [toAsset, setToAsset] = useState<FinancialAsset | null>(null);
  const [amount, setAmount] = useState('1');
  const [activeInput, setActiveInput] = useState<'from' | 'to'>('from');

  // --- Sonsuz döngü korumaları ---
  // 1) Varsayılanları sadece 1 kez kur
  const didInitDefaultsRef = useRef(false);
  // 2) Parametreler uygulandı mı?
  const lastAppliedParamKeyRef = useRef<string | null>(null);

  // Refs to hold latest from/to without triggering the params effect re-run
  const fromAssetRef = useRef<FinancialAsset | null>(null);
  const toAssetRef = useRef<FinancialAsset | null>(null);

  // Keep refs in sync with state (safe to add these deps since they won't affect the params effect)
  useEffect(() => {
    fromAssetRef.current = fromAsset;
    toAssetRef.current = toAsset;
  }, [fromAsset, toAsset]);

  // Varsayılanları (USD -> EUR) **yalnızca bir kez** ata
  useEffect(() => {
    if (didInitDefaultsRef.current) return;
    if (converterAssets.length === 0) return;

    const defaultFrom =
      converterAssets.find((a) => a.symbol === 'USD') || converterAssets[0];
    const defaultTo =
      converterAssets.find((a) => a.symbol === 'EUR' && a.id !== defaultFrom?.id) ||
      converterAssets.find((a) => a.id !== defaultFrom?.id) ||
      converterAssets[1] ||
      defaultFrom;

    setFromAsset(defaultFrom);
    setToAsset(defaultTo?.id === defaultFrom?.id ? converterAssets[0] : defaultTo);
    didInitDefaultsRef.current = true;
  }, [converterAssets]); // sadece converterAssets'e bak

  // Seçim ekranından dönen parametreleri **yalnızca değiştiğinde** uygula
  useEffect(() => {
    const selectedAssetParam = params?.selectedAsset as string | undefined;
    const targetParam = params?.target as ('from' | 'to') | undefined;

    if (!selectedAssetParam || !targetParam) return;
    if (converterAssets.length === 0) return;

    const key = `${selectedAssetParam}|${targetParam}`;
    if (lastAppliedParamKeyRef.current === key) return; // aynı parametre tekrar gelmiş → yoksay

    try {
      const parsed = JSON.parse(decodeURIComponent(selectedAssetParam)) as FinancialAsset;

      // listedeki referansı bul (yeni obje basmamak için)
      const selectedFromList =
        converterAssets.find((a) => a.id === parsed.id) ||
        converterAssets.find((a) => a.symbol === parsed.symbol) ||
        null;

      if (!selectedFromList) {
        // Bulamazsak uyarı göster ve bu parametreyi tüketilmiş say
        console.warn('Seçilen varlık listede bulunamadı:', parsed);
        lastAppliedParamKeyRef.current = key;
        return;
      }

      // Use refs to avoid adding from/to to deps and causing loops
      const prevFrom = fromAssetRef.current;
      const prevTo = toAssetRef.current;

      if (targetParam === 'from') {
        // Eğer seçilen varlık şu anki 'to' ile aynıysa, rastgele farklı bir varlık atamak yerine
        // mantıklı olanı yapıp swap edelim: seçilen -> from, önceki from -> to
        if (prevTo?.id === selectedFromList.id) {
          setFromAsset(selectedFromList);
          setToAsset(prevFrom ?? (converterAssets.find((a) => a.id !== selectedFromList.id) || selectedFromList));
        } else if (prevFrom?.id !== selectedFromList.id) {
          setFromAsset(selectedFromList);
        }
      } else {
        // target === 'to'
        if (prevFrom?.id === selectedFromList.id) {
          setToAsset(selectedFromList);
          setFromAsset(prevTo ?? (converterAssets.find((a) => a.id !== selectedFromList.id) || selectedFromList));
        } else if (prevTo?.id !== selectedFromList.id) {
          setToAsset(selectedFromList);
        }
      }

      lastAppliedParamKeyRef.current = key; // parametreyi tüket
    } catch (e) {
      console.error('Parametre parse edilirken hata:', e);
      Alert.alert('Hata', 'Varlık seçimi yapılamadı. Lütfen tekrar deneyin.');
      lastAppliedParamKeyRef.current = 'invalid'; // tekrar denemesin
    }
    // Sadece parametre stringleri ve listenin hazır olup olmaması tetiklesin
  }, [params?.selectedAsset, params?.target, converterAssets]);

  // Girdi doğrulama
  const handleAmountChange = (text: string) => {
    const normalizedText = text.replace(',', '.');
    if (normalizedText === '' || !isNaN(parseFloat(normalizedText))) {
      setAmount(normalizedText);
    }
  };

  // Swap
  const handleSwap = () => {
    setFromAsset((prevFrom) => {
      const newFrom = toAsset ?? prevFrom;
      setToAsset(prevFrom ?? toAsset);
      return newFrom ?? null;
    });
    setActiveInput((p) => (p === 'from' ? 'to' : 'from'));
    setAmount('1');
  };

  // Hesaplamalar
  const { fromAmountDisplay, toAmountDisplay, conversionRate } = useMemo(() => {
    const fromRate = fromAsset?.satis || 0;
    const toRate = toAsset?.satis || 0;
    const amountNumber = parseFloat(amount.replace(',', '.')) || 0;
    if (fromRate === 0 || toRate === 0)
      return {
        fromAmountDisplay: amount,
        toAmountDisplay: '0',
        conversionRate: '0.0000',
      };

    const calculatedTo = (amountNumber * fromRate) / toRate;
    const calculatedFrom = (amountNumber * toRate) / fromRate;

    return {
      fromAmountDisplay:
        activeInput === 'from'
          ? amount
          : calculatedFrom.toLocaleString('tr-TR', { maximumFractionDigits: 6 }),
      toAmountDisplay:
        activeInput === 'to'
          ? amount
          : calculatedTo.toLocaleString('tr-TR', { maximumFractionDigits: 2 }),
      conversionRate: (fromRate / toRate).toFixed(4),
    };
  }, [amount, activeInput, fromAsset, toAsset]);

  if (isLoading || !fromAsset || !toAsset) {
    return (
      <SafeAreaView style={styles.container}>
        <CustomHeader title="Çevirici" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.rateText}>Varlıklar yükleniyor...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Çevirici" />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.content}>
          <View style={styles.converterBox}>
            <View style={styles.row}>
              <TouchableOpacity
                style={styles.assetButton}
                onPress={() =>
                  router.push({ pathname: '/selectAsset', params: { target: 'from' } })
                }
              >
                {!!fromAsset.image && (
                  <Image source={{ uri: fromAsset.image }} style={styles.assetImage} />
                )}
                <Text style={styles.assetSymbol}>{fromAsset.symbol}</Text>
                <FontAwesome5 name="chevron-down" size={12} color={Colors.textSecondary} />
              </TouchableOpacity>
              <TextInput
                style={styles.amountInput}
                value={fromAmountDisplay}
                onChangeText={(text) => {
                  setActiveInput('from');
                  handleAmountChange(text);
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

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.assetButton}
                onPress={() =>
                  router.push({ pathname: '/selectAsset', params: { target: 'to' } })
                }
              >
                {!!toAsset.image && (
                  <Image source={{ uri: toAsset.image }} style={styles.assetImage} />
                )}
                <Text style={styles.assetSymbol}>{toAsset.symbol}</Text>
                <FontAwesome5 name="chevron-down" size={12} color={Colors.textSecondary} />
              </TouchableOpacity>
              <TextInput
                style={styles.amountInput}
                value={toAmountDisplay}
                onChangeText={(text) => {
                  setActiveInput('to');
                  handleAmountChange(text);
                }}
                keyboardType="numeric"
                selectTextOnFocus
              />
            </View>
          </View>

          <Text style={styles.rateText}>
            1 {fromAsset.symbol} ≈ {conversionRate} {toAsset.symbol}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, padding: 20, justifyContent: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  converterBox: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  row: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  assetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 12,
    borderRadius: 12,
  },
  assetImage: { width: 32, height: 32, borderRadius: 16, marginRight: 8 },
  assetSymbol: { color: Colors.textPrimary, fontSize: 18, fontWeight: '600', marginRight: 8 },
  amountInput: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1,
  },
  separator: { flexDirection: 'row', alignItems: 'center', marginVertical: 12 },
  line: { flex: 1, height: 1, backgroundColor: Colors.border },
  swapButton: {
    padding: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    marginHorizontal: 16,
  },
  rateText: { color: Colors.textSecondary, fontSize: 14, textAlign: 'center', marginTop: 24 },
});
