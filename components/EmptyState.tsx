// components/EmptyState.tsx
import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Colors, FontSize } from '../constants/Theme';

interface EmptyStateProps {
  icon: React.ComponentProps<typeof FontAwesome>['name'];
  title: string;
  message: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon, title, message }) => (
  <View style={styles.container}>
    <FontAwesome name={icon} size={60} color={Colors.textSecondary} />
    <Text style={styles.title}>{title}</Text>
    <Text style={styles.message}>{message}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { color: Colors.textPrimary, fontSize: FontSize.subtitle, fontWeight: 'bold', marginTop: 20, marginBottom: 8 },
  message: { color: Colors.textSecondary, fontSize: FontSize.body, textAlign: 'center' },
});
