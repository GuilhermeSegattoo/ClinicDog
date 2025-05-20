import DrawerNavigatorRoutes from './src/navigation/DrawerNavigator';

function ChatStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name='DrawerNavigator' component={DrawerNavigatorRoutes} />
    </Stack.Navigator>
  );
}
export default ChatStack;