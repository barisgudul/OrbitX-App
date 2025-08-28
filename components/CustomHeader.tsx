// components/CustomHeader.tsx 

import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '../hooks/useTheme';

// Bileşen artık title prop'u ve drawer toggle fonksiyonu alıyor
interface CustomHeaderProps {
  title: string;
  onDrawerToggle?: () => void;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({ title, onDrawerToggle }) => {
  const colors = useThemeColors();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
      {/* Sol Taraf: Drawer Butonu */}
      {onDrawerToggle && (
        <TouchableOpacity style={[styles.drawerButton, { backgroundColor: colors.card, borderColor: colors.border }]} onPress={onDrawerToggle}>
          <FontAwesome name="bars" size={20} color={colors.primary} />
        </TouchableOpacity>
      )}
      
      {/* Orta: OrbitX Başlığı */}
      <View style={styles.centerContainer}>
        <FontAwesome name="circle-o-notch" size={22} color={colors.primary} />
        <Text style={[styles.brandText, { color: colors.textPrimary }]}>OrbitX</Text>
      </View>
      
      {/* Sağ Taraf: Ekran Adı */}
      <Text style={[styles.titleText, { color: colors.textSecondary }]}>{title}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 60,
    width: '100%',
    flexDirection: 'row',
    // DEĞİŞİKLİK: Elemanları iki uca yaslıyoruz
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  drawerButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
  },
  centerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute',
    left: 0,
    right: 0,
    justifyContent: 'center',
  },
  brandText: {
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  // YENİ STİL: Sağdaki ekran adı için
  titleText: {
    fontSize: 16,
    fontWeight: '500',
  },
});