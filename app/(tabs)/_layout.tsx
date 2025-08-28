// app/(tabs)/_layout.tsx 
import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { useThemeColors } from '../../hooks/useTheme';

export default function TabsLayout() {
  const colors = useThemeColors(); // HOOK'U ÇAĞIR!

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary, // DİNAMİK RENK KULLAN
        tabBarInactiveTintColor: colors.textSecondary,
        tabBarStyle: {
          backgroundColor: colors.background, // DİNAMİK RENK KULLAN
          borderTopColor: colors.border,
        },
        headerShown: false, 
      }}
    >
      
      <Tabs.Screen name="favoriler" options={{ title: 'Favoriler', tabBarIcon: ({ color }) => <FontAwesome size={24} name="star" color={color} /> }} />
      <Tabs.Screen name="index" options={{ title: 'Döviz', tabBarIcon: ({ color }) => <FontAwesome size={24} name="dollar" color={color} /> }} />
      <Tabs.Screen name="parite" options={{ title: 'Parite', tabBarIcon: ({ color }) => <FontAwesome size={24} name="bar-chart" color={color} /> }} />
      <Tabs.Screen name="altin" options={{ title: 'Altın', tabBarIcon: ({ color }) => <FontAwesome size={24} name="diamond" color={color} /> }} />
      <Tabs.Screen name="cevirici" options={{ title: 'Çevirici', tabBarIcon: ({ color }) => <FontAwesome size={24} name="exchange" color={color} /> }} />
    </Tabs>
  );
}