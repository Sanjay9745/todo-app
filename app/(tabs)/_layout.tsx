import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import {Tabs} from 'expo-router';

export default function Layout() {
    return (
      <Tabs screenOptions={{headerShown:false}}>
        <Tabs.Screen name="home"  options={{
    title: 'Home',
    tabBarIcon: ({ focused, color, size }) => {
      return <MaterialCommunityIcons name={focused ? 'home' : 'home-outline'} size={size} color={color} />;
    },
  }}   />
        <Tabs.Screen name="calendar"  options={{
    title: 'Home',
    tabBarIcon: ({ focused, color, size }) => {
      return <MaterialCommunityIcons name={focused ? 'calendar' : 'calendar-outline'} size={size} color={color} />;
    },
  }}   />
        <Tabs.Screen name="profile"   options={{
    title: 'Home',
    tabBarIcon: ({ focused, color, size }) => {
      return <Ionicons name={focused ? 'person' : 'person-outline'} size={size} color={color} />;
    },
  }}  />
      </Tabs>
    );
}