// components/FakeHeader.tsx
import { FontAwesome5 } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, FontSize } from '../constants/Theme';

interface FakeHeaderProps {
  title: string;
}

export const FakeHeader: React.FC<FakeHeaderProps> = ({ title }) => {
  const router = useRouter();
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <FontAwesome5 name="chevron-left" size={18} color={Colors.textPrimary} />
      </TouchableOpacity>
      <Text style={styles.title}>{title}</Text>
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
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: { 
    padding: 12, // 8'den 12'ye çıkardım - daha büyük dokunma alanı
    borderRadius: 20,
    backgroundColor: Colors.card,
    borderWidth: 1, // Sınır ekledim
    borderColor: Colors.border,
  },
  title: { 
    color: Colors.textPrimary, 
    fontSize: FontSize.subtitle, 
    fontWeight: 'bold' 
  },
  placeholder: { 
    width: 24 
  }, // Başlığın tam ortada kalması için
});
