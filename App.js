import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import MyReminders from './screens/MyReminders';
import PastReminders from './screens/PastReminders';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {

  const HomeScreen = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'My Reminders') {
              iconName = 'format-list-checkbox'
            } else if (route.name === 'Past Reminders') {
              iconName = 'archive-clock'
            }

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: 'tomato',
          tabBarInactiveTintColor: 'gray',
        })}
      >
        <Tab.Screen name='My Reminders' component={MyReminders} />
        <Tab.Screen name='Past Reminders' component={PastReminders} />
      </Tab.Navigator>
    );
  }

  return (
    <>
      <NavigationContainer>
        <SafeAreaProvider>
          <Stack.Navigator
            initialRouteName={'Home'}
          >
            <Stack.Screen
              name='Home'
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            {/* <Stack.Screen
              name='CreateNewReminder'
              component={CreateNewReminder}
              options={{ title: 'Create New Reminder' }}
            />
            <Stack.Screen
              name='ViewReminder'
              component={ViewReminder}
              options={{ title: 'View Reminder' }}
            />
            <Stack.Screen
              name='ViewPastReminder'
              component={ViewPastReminder}
              options={{ title: 'View Past Reminder' }}
            /> */}
          </Stack.Navigator>
        </SafeAreaProvider>
      </NavigationContainer>
    </>
  );

};

export default App;