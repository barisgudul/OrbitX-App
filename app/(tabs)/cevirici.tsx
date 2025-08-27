// app/(tabs)/cevirici.tsx (KLAVYE KONTROLÜ EKLENDİ)

import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect } from 'react';
// GEREKLİ IMPORT'LARI EKLE
import { ActivityIndicator, Image, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import { CustomHeader } from '../../components/CustomHeader';
import { Colors, FontSize } from '../../constants/Theme';
import { useConverterData } from '../../hooks/useConverterData';
import { useConverterStore } from '../../store/converterStore';

// HIZLI MİKTAR BUTONU İÇİN YENİ, AKILLI BİLEŞEN
const QuickAmountButton: React.FC<{ 
    amount: number, 
    onPress: (amount: number) => void,
    isActive: boolean, // Artık aktif olup olmadığını biliyor
}> = ({ amount, onPress, isActive }) => (
    <TouchableOpacity 
        style={[styles.quickButton, isActive && styles.quickButtonActive]} // Aktifse stilini değiştir
        onPress={() => onPress(amount)}
    >
        <Text style={[styles.quickButtonText, isActive && styles.quickButtonTextActive]}>{amount}</Text>
    </TouchableOpacity>
);

export default function CeviriciScreen() {
    const router = useRouter();
    const { data: assets = [], isLoading } = useConverterData();
    const {
        fromAsset,
        toAsset,
        fromAmount,
        toAmountAlis,
        toAmountSatis,
        setFromAsset,
        setToAsset,
        setFromAmount,
        setQuickAmount,
        // Store'dan yeni fonksiyonu al
        calculateToAmount,
    } = useConverterStore();

    useEffect(() => {
        if (assets.length > 0 && (!fromAsset || !toAsset)) {
            const defaultFrom = assets.find(a => a.tip === 'altin' && a.id.includes('GRAM'));
            if (defaultFrom) setFromAsset(defaultFrom);
            const defaultTo = assets.find(a => a.symbol === 'TRY');
            if (defaultTo) setToAsset(defaultTo);
        }
    }, [assets, fromAsset, toAsset, setFromAsset, setToAsset]);

    useEffect(() => {
        if (fromAsset && toAsset) calculateToAmount();
    }, [fromAsset, toAsset, fromAmount, calculateToAmount]);

    const handleSelectAsset = () => {
        router.push(`/selectAsset?target=from`);
    };

    if (isLoading && assets.length === 0) {
        return ( <SafeAreaView style={styles.container}><CustomHeader title="Çevirici" /><ActivityIndicator style={{flex: 1}} /></SafeAreaView> );
    }

    const quickAmounts = [1, 10, 100, 1000];

    return (
        <SafeAreaView style={styles.container}>
            {/* EKRANIN TAMAMINI DOKUNULABİLİR BİR ALANLA SAR */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                {/* TouchableWithoutFeedback sadece tek bir child alabilir, o yüzden her şeyi bir View içine koyuyoruz */}
                <View style={{ flex: 1 }}> 
                    <CustomHeader title="Çevirici" />
                    <View style={styles.content}>
                        <MotiView 
                            from={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'timing', duration: 400 }}
                            style={styles.conversionCard}
                        >
                            {/* GİRİŞ BÖLÜMÜ */}
                            <View style={styles.inputSection}>
                                <TouchableOpacity style={styles.assetSelector} onPress={handleSelectAsset}>
                                    {fromAsset?.image && <Image source={{ uri: fromAsset.image }} style={styles.assetIcon} />}
                                    <Text style={styles.assetName}>{fromAsset?.name || 'Varlık Seç'}</Text>
                                    <FontAwesome5 name="chevron-down" size={16} color={Colors.textSecondary} />
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.mainInput}
                                    value={fromAmount}
                                    onChangeText={setFromAmount}
                                    keyboardType="numeric"
                                    placeholder="0"
                                    placeholderTextColor={Colors.textSecondary}
                                    selectTextOnFocus
                                />
                                {/* HIZLI BUTONLAR ARTIK KARTIN İÇİNDE */}
                                <View style={styles.quickButtonsContainer}>
                                    {quickAmounts.map(amount => (
                                        <QuickAmountButton 
                                            key={amount}
                                            amount={amount} 
                                            onPress={setQuickAmount}
                                            isActive={fromAmount === amount.toString()} // Aktif mi diye kontrol et
                                        />
                                    ))}
                                </View>
                            </View>

                            <View style={styles.dividerContainer}>
                                <View style={styles.dividerLine} />
                                <View style={styles.dividerIcon}>
                                    <FontAwesome5 name="arrow-down" size={20} color={Colors.primary} />
                                </View>
                                <View style={styles.dividerLine} />
                            </View>

                            {/* ÇIKIŞ BÖLÜMÜ GÜNCELLENDİ */}
                            <View style={styles.outputSection}>
                                <View style={styles.outputRow}>
                                    {/* DEĞİŞİKLİK 1: YAZIYI KISALTTIK */}
                                    <Text style={styles.outputLabel}>Alış Değeri</Text>
                                    <AnimatePresence>
                                        <MotiView key={`alis-${toAmountAlis}`} from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }}>
                                            {/* DEĞİŞİKLİK 2: FİYATI AKILLANDIRDIK */}
                                            <Text style={styles.outputPrimary} numberOfLines={1} adjustsFontSizeToFit>₺{toAmountAlis || '0,00'}</Text>
                                        </MotiView>
                                    </AnimatePresence>
                                </View>
                                <View style={styles.outputRow}>
                                    {/* DEĞİŞİKLİK 3: YAZIYI KISALTTIK */}
                                    <Text style={styles.outputLabel}>Satış Değeri</Text>
                                     <AnimatePresence>
                                        <MotiView key={`satis-${toAmountSatis}`} from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }}>
                                            {/* DEĞİŞİKLİK 4: FİYATI AKILLANDIRDIK */}
                                            <Text style={styles.outputSecondary} numberOfLines={1} adjustsFontSizeToFit>₺{toAmountSatis || '0,00'}</Text>
                                        </MotiView>
                                    </AnimatePresence>
                                </View>
                            </View>
                        </MotiView>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
}

// YENİDEN DÜZENLENMİŞ, DAHA ŞIK STİLLER
const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    content: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
    
    conversionCard: {
        width: '100%',
        backgroundColor: Colors.card,
        borderRadius: 24,
        borderWidth: 1,
        borderColor: Colors.border,
        overflow: 'hidden',
    },
    
    inputSection: {
        padding: 20,
    },
    assetSelector: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 16,
    },
    assetIcon: { width: 28, height: 28, marginRight: 10 },
    assetName: { color: Colors.textPrimary, fontSize: FontSize.subtitle, fontWeight: '600', marginRight: 8 },
    mainInput: {
        color: Colors.textPrimary,
        fontSize: 48,
        fontWeight: 'bold',
        textAlign: 'right',
        paddingVertical: 10,
    },
    quickButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 16,
    },
    quickButton: {
        backgroundColor: 'rgba(139, 148, 158, 0.1)',
        paddingVertical: 8,
        flex: 1, // Alanı eşit paylaşsınlar
        marginHorizontal: 4,
        borderRadius: 12,
        alignItems: 'center',
    },
    quickButtonActive: {
        backgroundColor: Colors.primary, // Aktif olunca renk değiştir
        borderColor: Colors.primary,
    },
    quickButtonText: {
        color: Colors.textSecondary,
        fontWeight: '600',
    },
    quickButtonTextActive: {
        color: Colors.background, // Aktif olunca yazı rengini de değiştir
    },

    dividerContainer: { flexDirection: 'row', alignItems: 'center' },
    dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
    dividerIcon: {
        width: 44, height: 44, borderRadius: 22,
        backgroundColor: Colors.card,
        borderTopWidth: 1, borderBottomWidth: 1, borderColor: Colors.border,
        justifyContent: 'center', alignItems: 'center',
    },

    outputSection: {
        backgroundColor: 'rgba(1, 4, 9, 0.5)',
        paddingHorizontal: 20, // Yatay padding
        paddingVertical: 10,   // Dikey padding
    },
    outputRow: {
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingVertical: 10
    },
    outputLabel: { 
        color: Colors.textSecondary, 
        fontSize: FontSize.body,
        marginRight: 10, // Yazı ile fiyat arasına boşluk koy
    },
    // DEĞİŞİKLİK 5: FİYAT STİLLERİNİ ESNEK HALE GETİRDİK
    outputPrimary: { 
        color: Colors.primary, 
        fontSize: 24, 
        fontWeight: 'bold',
        flexShrink: 1, // Bu çok önemli: Eğer sığmazsan, küçül.
        textAlign: 'right', // Sağa yaslı kal
    },
    outputSecondary: { 
        color: Colors.textPrimary, 
        fontSize: 18, 
        fontWeight: '500',
        flexShrink: 1, // Bu da küçülsün
        textAlign: 'right',
    },
});