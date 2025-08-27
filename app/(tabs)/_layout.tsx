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