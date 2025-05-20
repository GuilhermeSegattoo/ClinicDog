import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import LoginScreen from "../screens/LoginScreen";
import DashboardScreen from "../screens/DashboardScreen";
import DetailScreen from "../screens/DetailScreen";
import ProfileScreen from "../screens/ProfileScreen";
import AddPet from "../screens/AddPet";

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

function TabRoutes() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Início" component={DashboardScreen} />
      <Tab.Screen name="Detalhes" component={DetailScreen} />
    </Tab.Navigator>
  );
}

function DrawerRoutes() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen name="Home" component={TabRoutes} />
      <Drawer.Screen name="Perfil" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

export default function Routes({ isAuthenticated }) {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {!isAuthenticated ? (
          <Stack.Screen name="Login" component={LoginScreen} />
        ) : (
          <>
            <Stack.Screen name="MainApp" component={DrawerRoutes} />
            <Stack.Screen name="AddPet" component={AddPet} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
