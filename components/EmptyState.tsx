// components/EmptyState.tsx
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FontSize } from '../constants/Theme';
import { useThemeColors } from '../hooks/useTheme';

interface EmptyStateProps {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  title: string;
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => {
  const colors = useThemeColors();
  
  return (
    <View style={styles.container}>
      <FontAwesome name={icon} size={60} color={colors.textSecondary} />
      <Text style={[styles.title, { color: colors.textPrimary }]}>{title}</Text>
      <Text style={[styles.message, { color: colors.textSecondary }]}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: FontSize.subtitle, fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
  message: { fontSize: FontSize.body, textAlign: 'center' },
});
