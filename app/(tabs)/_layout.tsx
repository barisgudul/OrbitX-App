import { FontAwesome } from '@expo/vector-icons'; // Örnek ikon kütüphanesi
import { Tabs } from 'expo-router';

export default function TabsLayout() {
  return (
    <Tabs>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Döviz',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="dollar" color={color} />,
        }}
      />
      <Tabs.Screen
        name="altin"
        options={{
          title: 'Altın',
          tabBarIcon: ({ color }) => <FontAwesome size={28} name="database" color={color} />, // Uygun bir ikon bul
        }}
      />
    </Tabs>
  );
}