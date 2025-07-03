import { Tabs } from 'expo-router';
import { Chrome as Home, Plus, Settings } from 'lucide-react-native';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#8B4513',
          borderTopColor: '#A0522D',
          borderTopWidth: 1,
        },
        tabBarActiveTintColor: '#FFD700',
        tabBarInactiveTintColor: '#D2B48C',
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Desk',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="add"
        options={{
          title: 'Add',
          tabBarIcon: ({ size, color }) => (
            <Plus size={size} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ size, color }) => (
            <Settings size={size} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}