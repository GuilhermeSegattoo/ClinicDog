import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Home from '../screens/Home';
import Chat from '../screens/Chat';
import Profile from '../screens/Profile'; 
import AddPet from '../screens/AddPet';
const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Chat" component={Chat} />
      <Tab.Screen name="Profile" component={Profile} />
      <Tab.Screen name="AddPet" component={AddPet} />
    </Tab.Navigator>
  );
}
