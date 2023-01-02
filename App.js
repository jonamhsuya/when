import React, { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import MyReminders from './screens/MyReminders';
import PastReminders from './screens/PastReminders';

import storage from './storage/storage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {

  useEffect(() => {
    storage.load({
      key: 'firstTime',
    })
      .then(ret => {
        // reminders has already been initialized, do nothing
      })
      .catch(err => {
        // user is accessing app for the first time
        // save empty array in storage to store future reminders and past reminders
        storage.save({
          key: 'reminders',
          data: [],
          expires: null,
        });
        storage.save({
          key: 'pastReminders',
          data: [],
          expires: null,
        });
        // store firstTime value so array is not reset every time
        storage.save({
          key: 'firstTime',
          data: false,
          expires: null,
        });
      });
  });

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