// components/CustomHeader.tsx (NİHAİ VERSİYON)

import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors } from '../constants/Theme';

// Bileşen artık title prop'u alıyor
interface CustomHeaderProps {
  title: string;
}

export const CustomHeader: React.FC<CustomHeaderProps> = ({ title }) => {
  return (
    <View style={styles.container}>
      {/* Sol Taraf: Logo ve Marka Adı */}
      <View style={styles.logoContainer}>
        <FontAwesome name="circle-o-notch" size={22} color={Colors.primary} />
        <Text style={styles.brandText}>OrbitX</Text>
      </View>
      
      {/* Sağ Taraf: Ekran Adı */}
      <Text style={styles.titleText}>{title}</Text>
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
    backgroundColor: Colors.background,
    paddingHorizontal: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.border,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  brandText: {
    color: Colors.textPrimary,
    fontSize: 22,
    fontWeight: 'bold',
    marginLeft: 10,
    letterSpacing: 0.5,
  },
  // YENİ STİL: Sağdaki ekran adı için
  titleText: {
    color: Colors.textSecondary,
    fontSize: 16,
    fontWeight: '500',
  },
});