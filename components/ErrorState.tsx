// components/ErrorState.tsx

import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors, FontSize } from '../constants/Theme';

interface ErrorStateProps {
  onRetry: () => void; // Tekrar deneme fonksiyonu
}

export const ErrorState: React.FC<ErrorStateProps> = ({ onRetry }) => {
  return (
    <View style={styles.container}>
      {/* DEĞİŞİKLİK BURADA: 'wifi-slash' çok daha uygun ve var olan bir ikon */}
      <FontAwesome name="exclamation-circle" size={60} color={Colors.textSecondary} />
      <Text style={styles.title}>Bir Sorun Oluştu</Text>
      <Text style={styles.message}>
        Veriler yüklenemedi. Lütfen internet bağlantınızı kontrol edin ve tekrar deneyin.
      </Text>
      <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
        <Text style={styles.retryButtonText}>Tekrar Dene</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    padding: 20,
  },
  title: {
    color: Colors.textPrimary,
    fontSize: FontSize.subtitle,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
  message: {
    color: Colors.textSecondary,
    fontSize: FontSize.body,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 25,
  },
  retryButtonText: {
    color: Colors.textPrimary,
    fontSize: FontSize.body,
    fontWeight: 'bold',
  },
});