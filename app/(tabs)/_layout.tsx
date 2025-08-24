// app/(tabs)/_layout.tsx

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
        headerStyle: {
          backgroundColor: Colors.background,
        },
        headerTitleStyle: {
          color: Colors.textPrimary,
        },
      }}
    >
      <Tabs.Screen
    name="favoriler" // app/(tabs)/favoriler.tsx dosyasının adı
    options={{
      title: 'Favoriler',
      tabBarIcon: ({ color }) => <FontAwesome size={24} name="star" color={color} />,
    }}
  />

      <Tabs.Screen
        name="index" // Bu dosya app/(tabs)/index.tsx'e karşılık gelir
        options={{
          title: 'Döviz',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="dollar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="crypto"
        options={{
          title: 'Kripto',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="bitcoin" color={color} />,
        }}
      />
      <Tabs.Screen
        name="altin"
        options={{
          title: 'Metaller',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="database" color={color} />,
        }}
      />
      <Tabs.Screen
        name="portfolio"
        options={{
          title: 'Portföy',
          tabBarIcon: ({ color }) => <FontAwesome size={24} name="pie-chart" color={color} />,
        }}
      />
    </Tabs>
  );
}