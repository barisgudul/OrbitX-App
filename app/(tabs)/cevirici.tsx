// app/(tabs)/cevirici.tsx 

import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { AnimatePresence, MotiView } from 'moti';
import React, { useEffect, useState } from 'react';
// GEREKLİ IMPORT'LARI EKLE
import { ActivityIndicator, Image, Keyboard, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

import { CustomHeader } from '../../components/CustomHeader';
import { SocialDrawer } from '../../components/SocialDrawer';
import { FontSize } from '../../constants/Theme';
import { useConverterData } from '../../hooks/useConverterData';
import { useThemeColors } from '../../hooks/useTheme';
import { useConverterStore } from '../../store/converterStore';
const HEADER_HEIGHT = 60;
// HIZLI MİKTAR BUTONU İÇİN YENİ, AKILLI BİLEŞEN
const QuickAmountButton: React.FC<{ 
    amount: number, 
    onPress: (amount: number) => void,
    isActive: boolean, // Artık aktif olup olmadığını biliyor
    colors: any, // Tema renkleri
}> = ({ amount, onPress, isActive, colors }) => (
    <TouchableOpacity 
        style={[
            styles.quickButton, 
            isActive && { 
                backgroundColor: colors.primary, 
                borderColor: colors.primary 
            }
        ]} // Aktifse stilini değiştir
        onPress={() => onPress(amount)}
    >
        <Text style={[
            styles.quickButtonText, 
            { color: colors.textSecondary },
            isActive && { color: colors.background }
        ]}>{amount}</Text>
    </TouchableOpacity>
);

export default function CeviriciScreen() {
    const router = useRouter();
    const { data: assets = [], isLoading } = useConverterData();
    const [isDrawerVisible, setIsDrawerVisible] = useState(false);
    const colors = useThemeColors();
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
        <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
            {/* EKRANIN TAMAMINI DOKUNULABİLİR BİR ALANLA SAR */}
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                {/* TouchableWithoutFeedback sadece tek bir child alabilir, o yüzden her şeyi bir View içine koyuyoruz */}
                <View style={{ flex: 1 }}> 
                    <CustomHeader title="Çevirici" onDrawerToggle={() => setIsDrawerVisible(true)} />
                    
                    <View style={styles.content}>
                        <MotiView 
                            from={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ type: 'timing', duration: 400 }}
                            style={[
                                styles.conversionCard, 
                                { 
                                    backgroundColor: colors.card, 
                                    borderColor: colors.border,
                                    ...colors.shadows.medium // Bu daha büyük, medium gölge olsun
                                }
                            ]}
                        >
                            {/* GİRİŞ BÖLÜMÜ */}
                            <View style={styles.inputSection}>
                                <TouchableOpacity style={styles.assetSelector} onPress={handleSelectAsset}>
                                    {fromAsset?.image && <Image source={{ uri: fromAsset.image }} style={styles.assetIcon} />}
                                    <Text style={[styles.assetName, { color: colors.textPrimary }]}>{fromAsset?.name || 'Varlık Seç'}</Text>
                                    <FontAwesome5 name="chevron-down" size={16} color={colors.textSecondary} />
                                </TouchableOpacity>
                                <TextInput
                                    style={[styles.mainInput, { color: colors.textPrimary }]}
                                    value={fromAmount}
                                    onChangeText={setFromAmount}
                                    keyboardType="numeric"
                                    placeholder="0"
                                    placeholderTextColor={colors.textSecondary}
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
                                            colors={colors}
                                        />
                                    ))}
                                </View>
                            </View>

                            <View style={styles.dividerContainer}>
                                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                                <View style={[styles.dividerIcon, { backgroundColor: colors.card, borderColor: colors.border }]}>
                                    <FontAwesome5 name="arrow-down" size={20} color={colors.primary} />
                                </View>
                                <View style={[styles.dividerLine, { backgroundColor: colors.border }]} />
                            </View>

                            {/* ÇIKIŞ BÖLÜMÜ GÜNCELLENDİ */}
                            <View style={[styles.outputSection, { backgroundColor: colors.cardSecondary }]}>
                                <View style={styles.outputRow}>
                                    {/* DEĞİŞİKLİK 1: YAZIYI KISALTTIK */}
                                    <Text style={[styles.outputLabel, { color: colors.textSecondary }]}>Alış Değeri</Text>
                                    <AnimatePresence>
                                        <MotiView key={`alis-${toAmountAlis}`} from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }}>
                                            {/* DEĞİŞİKLİK 2: FİYATI AKILLANDIRDIK */}
                                            <Text style={[styles.outputPrimary, { color: colors.primary }]} numberOfLines={1} adjustsFontSizeToFit>₺{toAmountAlis || '0,00'}</Text>
                                        </MotiView>
                                    </AnimatePresence>
                                </View>
                                <View style={styles.outputRow}>
                                    {/* DEĞİŞİKLİK 3: YAZIYI KISALTTIK */}
                                    <Text style={[styles.outputLabel, { color: colors.textSecondary }]}>Satış Değeri</Text>
                                     <AnimatePresence>
                                        <MotiView key={`satis-${toAmountSatis}`} from={{ opacity: 0, translateY: 10 }} animate={{ opacity: 1, translateY: 0 }}>
                                            {/* DEĞİŞİKLİK 4: FİYATI AKILLANDIRDIK */}
                                            <Text style={[styles.outputSecondary, { color: colors.textPrimary }]} numberOfLines={1} adjustsFontSizeToFit>₺{toAmountSatis || '0,00'}</Text>
                                        </MotiView>
                                    </AnimatePresence>
                                </View>
                            </View>
                        </MotiView>
                    </View>
                </View>
            </TouchableWithoutFeedback>

            {/* Sosyal Medya Drawer */}
            <SocialDrawer 
                isVisible={isDrawerVisible}
                onToggle={() => setIsDrawerVisible(!isDrawerVisible)}
                topOffset={HEADER_HEIGHT}
            />
        </SafeAreaView>
    );
}

// YENİDEN DÜZENLENMİŞ, DAHA ŞIK STİLLER
const styles = StyleSheet.create({
    container: { flex: 1 },

    content: { flex: 1, padding: 24, justifyContent: 'center', alignItems: 'center' },
    
    conversionCard: {
        width: '100%',
        borderRadius: 24,
        borderWidth: 1, // Kenarlık olsun
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
    assetName: { fontSize: FontSize.subtitle, fontWeight: '600', marginRight: 8 },
    mainInput: {
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
        // Aktif olunca renk değiştir
    },
    quickButtonText: {
        fontWeight: '600',
    },
    quickButtonTextActive: {
        // Aktif olunca yazı rengini de değiştir
    },

    dividerContainer: { flexDirection: 'row', alignItems: 'center' },
    dividerLine: { flex: 1, height: 1 },
    dividerIcon: {
        width: 44, height: 44, borderRadius: 22,
        borderTopWidth: 1, borderBottomWidth: 1,
        justifyContent: 'center', alignItems: 'center',
    },

    outputSection: {
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
        fontSize: FontSize.body,
        marginRight: 10, // Yazı ile fiyat arasına boşluk koy
    },
    // DEĞİŞİKLİK 5: FİYAT STİLLERİNİ ESNEK HALE GETİRDİK
    outputPrimary: { 
        fontSize: 24, 
        fontWeight: 'bold',
        flexShrink: 1, // Bu çok önemli: Eğer sığmazsan, küçül.
        textAlign: 'right', // Sağa yaslı kal
    },
    outputSecondary: { 
        fontSize: 18, 
        fontWeight: '500',
        flexShrink: 1, // Bu da küçülsün
        textAlign: 'right',
    },
});