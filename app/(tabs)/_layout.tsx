// app/(tabs)/_layout.tsx (EN TEMİZ HALİ)

import { FontAwesome } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Colors } from '../../constants/Theme';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textSecondary,
        tabBarStyle: {
          backgroundColor: Colors.background,
          borderTopColor: Colors.border,
        },
        // DEĞİŞİKLİK: Başlığı tamamen Expo Router'dan kaldırıyoruz
        headerShown: false, 
      }}
    >
      {/* options içindeki tüm 'header' proplarını sildik */}
      <Tabs.Screen name="favoriler" options={{ title: 'Favoriler', tabBarIcon: ({ color }) => <FontAwesome size={24} name="star" color={color} /> }} />
      <Tabs.Screen name="index" options={{ title: 'Döviz', tabBarIcon: ({ color }) => <FontAwesome size={24} name="dollar" color={color} /> }} />
      <Tabs.Screen name="parite" options={{ title: 'Parite', tabBarIcon: ({ color }) => <FontAwesome size={24} name="bar-chart" color={color} /> }} />
      <Tabs.Screen name="altin" options={{ title: 'Altın', tabBarIcon: ({ color }) => <FontAwesome size={24} name="diamond" color={color} /> }} />
      <Tabs.Screen name="cevirici" options={{ title: 'Çevirici', tabBarIcon: ({ color }) => <FontAwesome size={24} name="exchange" color={color} /> }} />
    </Tabs>
  );
}