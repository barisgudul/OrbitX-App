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
    height: 60, 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 16, 
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  backButton: { 
    padding: 8,
    borderRadius: 20,
    backgroundColor: Colors.card,
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
