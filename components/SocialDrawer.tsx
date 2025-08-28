// components/SocialDrawer.tsx

import { FontAwesome5 } from '@expo/vector-icons';
import * as Linking from 'expo-linking';
import React, { useCallback, useEffect } from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

import { BorderRadius, FontSize, Shadows, Spacing } from '../constants/Theme';
import { useIsDark, useThemeColors, useThemeToggle } from '../hooks/useTheme';

const { height: screenHeight } = Dimensions.get('window');
const DRAWER_WIDTH = 300;

interface SocialDrawerProps {
  isVisible: boolean;
  onToggle: () => void;
  topOffset: number;
}

export const SocialDrawer: React.FC<SocialDrawerProps> = ({ isVisible, onToggle, topOffset }) => {
  const colors = useThemeColors();
  const toggleTheme = useThemeToggle();
  const isDark = useIsDark();
  
  const translateX = useSharedValue(-DRAWER_WIDTH);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const closeDrawer = useCallback(() => {
    translateX.value = withSpring(-DRAWER_WIDTH, { damping: 18, stiffness: 120 });
    setTimeout(onToggle, 250);
  }, [translateX, onToggle]);

  useEffect(() => {
    if (isVisible) {
      translateX.value = withSpring(0, { damping: 18, stiffness: 120 });
    }
  }, [isVisible, translateX]);

  const panGesture = Gesture.Pan()
    .onUpdate((event) => {
      if (event.translationX < 0) {
        translateX.value = event.translationX;
      }
    })
    .onEnd((event) => {
      if (event.translationX < -DRAWER_WIDTH / 3 || event.velocityX < -500) {
        closeDrawer();
      } else {
        translateX.value = withSpring(0, { damping: 18, stiffness: 120 });
      }
    });

  const handleWhatsApp = () => Linking.openURL('https://wa.me/905422361936');
  const handleInstagram = () => Linking.openURL('https://www.instagram.com/baris.gudul');

  return (
    <>
      {isVisible && (
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={closeDrawer}
        />
      )}

      <GestureDetector gesture={panGesture}>
        <Animated.View
          style={[
            styles.drawer,
            { 
              backgroundColor: colors.card, 
              borderRightColor: colors.border,
              top: topOffset,
              height: screenHeight - topOffset
            },
            animatedStyle
          ]}
        >
          <View style={styles.drawerContent}>
            <View style={styles.drawerHeader}>
              <View style={[styles.headerIconContainer, { backgroundColor: isDark ? 'rgba(9, 105, 218, 0.2)' : 'rgba(9, 105, 218, 0.1)' }]}>
                <FontAwesome5 name="atom" size={28} color={colors.primary} />
              </View>
              <Text style={[styles.drawerTitle, { color: colors.textPrimary }]}>OrbitX</Text>
              <Text style={[styles.drawerSubtitle, { color: colors.textSecondary }]}>Finansal Varlık Platformu</Text>
            </View>

            <TouchableOpacity style={[styles.button, { backgroundColor: colors.background }]} onPress={toggleTheme}>
              <FontAwesome5 name={isDark ? 'sun' : 'moon'} size={20} color={isDark ? colors.accentOrange : colors.accentPurple} />
              <Text style={[styles.buttonText, { color: colors.textPrimary }]}>
                {isDark ? 'Açık Tema' : 'Koyu Tema'}
              </Text>
              <FontAwesome5 name="chevron-right" size={16} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>İLETİŞİM</Text>
            </View>

            <TouchableOpacity style={[styles.button, { backgroundColor: colors.background }]} onPress={handleWhatsApp}>
              <FontAwesome5 name="whatsapp" size={24} color="#25D366" />
              <Text style={[styles.buttonText, { color: colors.textPrimary }]}>WhatsApp</Text>
              <FontAwesome5 name="chevron-right" size={16} color={colors.textSecondary} />
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, { backgroundColor: colors.background }]} onPress={handleInstagram}>
              <FontAwesome5 name="instagram" size={24} color="#E4405F" />
              <Text style={[styles.buttonText, { color: colors.textPrimary }]}>Instagram</Text>
              <FontAwesome5 name="chevron-right" size={16} color={colors.textSecondary} />
            </TouchableOpacity>

            <View style={styles.bottomInfo}>
              <Text style={[styles.versionText, { color: colors.textTertiary }]}>v1.0.0 © 2024 OrbitX</Text>
            </View>
          </View>
        </Animated.View>
      </GestureDetector>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    zIndex: 998,
  },
  drawer: {
    position: 'absolute',
    left: 0,
    width: DRAWER_WIDTH,
    zIndex: 999,
    borderTopRightRadius: BorderRadius.lg,
    borderBottomRightRadius: BorderRadius.lg,
    ...Shadows.large,
  },
  drawerContent: {
    flex: 1,
    padding: Spacing.md,
  },
  drawerHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
    paddingBottom: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(139, 148, 158, 0.2)',
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  drawerTitle: {
    fontSize: FontSize.title,
    fontWeight: 'bold',
  },
  drawerSubtitle: {
    fontSize: FontSize.body,
  },
  sectionHeader: {
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
    paddingHorizontal: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    opacity: 0.7,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: 'rgba(139, 148, 158, 0.2)',
  },
  buttonText: {
    flex: 1,
    fontSize: FontSize.body,
    fontWeight: '500',
    marginLeft: Spacing.md,
  },
  bottomInfo: {
    alignItems: 'center',
    marginTop: 'auto',
    paddingBottom: Spacing.md,
  },
  versionText: {
    fontSize: FontSize.caption,
  },
});
