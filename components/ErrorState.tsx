// components/ErrorState.tsx

import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { FontSize } from '../constants/Theme';
import { useThemeColors } from '../hooks/useTheme';

interface ErrorStateProps {
  onRetry: () => void; // Tekrar deneme fonksiyonu
}

export const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => {
  const colors = useThemeColors();
  
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* DEĞİŞİKLİK BURADA: 'wifi-slash' çok daha uygun ve var olan bir ikon */}
      <FontAwesome name="exclamation-circle" size={60} color={colors.textSecondary} />
      <Text style={[styles.title, { color: colors.textPrimary }]}>Bir Sorun Oluştu</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>
        Veriler yüklenemedi. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.
      </Text>
      <TouchableOpacity style={[styles.retryButton, { backgroundColor: colors.primary }]} onPress={onRetry}>
        <Text style={[styles.retryButtonText, { color: colors.textPrimary }]}>Tekrar Dene</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: FontSize.subtitle,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  message: {
    fontSize: FontSize.body,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  retryButtonText: {
    fontSize: FontSize.body,
    fontWeight: 'bold',
  },
});