// components/FakeHeader.tsx
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useThemeColors } from '../hooks/useTheme';

interface FakeHeaderProps {
  title: string;
}

export const FakeHeader: React.FC<FakeHeaderProps> = ({ title }) => {
  const router = useRouter();
  const colors = useThemeColors();
  return (
    <View style={[styles.container, { backgroundColor: colors.background, borderBottomColor: colors.border }]}>
              <TouchableOpacity onPress={() => router.back()} style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <FontAwesome5 name="chevron-left" size={18} color={colors.textPrimary} />
      </TouchableOpacity>
      
      {/* Orta: OrbitX Başlığı */}
      <View style={styles.centerContainer}>
                  <FontAwesome5 name="circle-o-notch" size={18} color={colors.primary} />
                  <Text style={[styles.brandText, { color: colors.textPrimary }]}>OrbitX</Text>
      </View>
      
      <View style={styles.placeholder} />
    </View>
  );
};

const styles = StyleSheet.create({
    container: { 
    height: 80, // 60'tan 80'e çıkardım - daha rahat erişim için
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    paddingTop: 20, // Üstten padding ekledim
    borderBottomWidth: 1,
  },
  backButton: { 
    padding: 12, // 8'den 12'ye çıkardım - daha büyük dokunma alanı
    borderRadius: 20,
    borderWidth: 1, // Sınır ekledim
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
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    letterSpacing: 0.5,
  },
  placeholder: { 
    width: 24 
  }, // Başlığın tam ortada kalması için
});
