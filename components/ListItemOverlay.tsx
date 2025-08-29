// components/ListItemOverlay.tsx

import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useThemeColors } from '../hooks/useTheme';

interface ListItemOverlayProps {
  children: React.ReactNode;
}

export const ListItemOverlay: React.FC<ListItemOverlayProps> = ({ children }) => {
  const { isDark } = useThemeColors();

  // EĞER AÇIK TEMADA İSEK, HİÇBİR ŞEY YAPMA!
  // Sadece içeriği bir View içinde, doğru padding ile render et. Gradyan YOK.
  if (!isDark) {
    return <View style={styles.content}>{children}</View>;
  }

  // EĞER KOYU TEMADA İSEK, o güzel gradyanı UYGULA.
  const gradientColors = ['rgba(0,0,0,0.9)', 'rgba(0,0,0,0.3)', 'transparent'];

  return (
    <LinearGradient
      colors={gradientColors as any}
      locations={[0.2, 0.7, 1]}
      style={styles.gradient}
    >
      <View style={styles.content}>
        {children}
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    justifyContent: 'space-between',
  },
});
