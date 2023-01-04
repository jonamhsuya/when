import React, { useEffect } from 'react';
import { Button } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import * as Notifications from 'expo-notifications';
import * as Speech from 'expo-speech';

import MyReminders from './screens/MyReminders';
import PastReminders from './screens/PastReminders';
import CreateNewReminder from './screens/CreateNewReminder';
import ViewReminder from './screens/ViewReminder';
import ViewPastReminder from './screens/ViewPastReminder';

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
        askPermissions();

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

    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,
      }),
      handleSuccess: async (notifID) => {
        onNotification(notifID);
      }
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
            <Stack.Screen
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
            />
          </Stack.Navigator>
        </SafeAreaProvider>
      </NavigationContainer>
    </>
  );

};

export default App;


const askPermissions = async () => {
  const { status: existingStatus } = await Notifications.requestPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  if (finalStatus !== 'granted') {
    return false;
  }
  return true;
};

const onNotification = (notifID) => {
  let temp;
  storage.load({
    key: 'reminders',
  })
    .then(ret => {
      for (let i = 0; i < ret.length; i++) {
        if (notifID.includes(ret[i]['notifID'])) {
          if (ret[i]['shouldSpeak']) {
            setTimeout(() => Speech.speak(ret[i]['message']), 1000);
          }
          setTimeout(async () => {
            let repeat = ret[i]['repeat'];
            if (repeat === 'Never') {
              temp = ret[i];
              ret.splice(i, 1);
              storage.save({
                key: 'reminders',
                data: ret,
                expires: null,
              });
              storage.load({
                key: 'pastReminders',
              })
                .then(ret => {
                  ret.push(temp);
                  storage.save({
                    key: 'pastReminders',
                    data: ret,
                    expires: null,
                  });
                })
                .catch(err => {
                  console.log(err);
                })
            } else {
              let oldDate = ret[i]['date'];
              let newDate;
              if (repeat === 'By the Minute') {
                newDate = new Date(new Date(oldDate).getTime() + ret[i]['minutes'] * 60 * 1000);
              } else if (repeat === 'Hourly') {
                newDate = new Date(new Date(oldDate).getTime() + 3600 * 1000);
              } else if (repeat === 'Daily') {
                newDate = new Date(new Date(oldDate).getTime() + 24 * 3600 * 1000);
              } else if (repeat === 'Weekly') {
                newDate = new Date(new Date(oldDate).getTime() + 7 * 24 * 3600 * 1000);
              } else if (repeat === 'Monthly') {
                newDate = new Date(new Date(oldDate).setMonth(oldDate.getMonth() === 12 ? 1 : oldDate.getMonth() + 1));
              } else {
                newDate = new Date(new Date(oldDate).setFullYear(oldDate.getFullYear() + 1));
              }
              let newNotifID = await schedulePushNotification(ret[i]['title'], newDate);
              ret[i] = {
                'title': ret[i]['title'],
                'date': newDate,
                'notifID': newNotifID,
                'shouldSpeak': ret[i]['shouldSpeak'],
                'message': ret[i]['message'],
                'repeat': ret[i]['repeat'],
                'minutes': ret[i]['minutes']
              };
              storage.save({
                key: 'reminders',
                data: ret,
                expires: null,
              });
            }
          }, 1001);
        }
      }
    })
    .catch(err => {
      console.log(err);
    })
}

const schedulePushNotification = async (title, date) => {
  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: title,
    },
    trigger: date,
  });
  return id;
};