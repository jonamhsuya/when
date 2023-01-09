import React, { useEffect, useState } from 'react';
import { Alert } from 'react-native';
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

  const [count, setCount] = useState(0);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  useEffect(() => {
    storage.load({
      key: 'firstTime',
    })
      .then(() => {
        // reminders has already been initialized, do nothing
      })
      .catch(() => {
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

    Notifications.setNotificationCategoryAsync(
      identifier = 'notification',
      actions = [
        {
          identifier: 'snooze',
          buttonTitle: 'Snooze ⏰'
        },
        {
          identifier: 'complete',
          buttonTitle: 'Mark Complete ✅'
        }
      ],
    )

    const subscription = Notifications.addNotificationResponseReceivedListener(response => {
      if (response.actionIdentifier === 'snooze') {
        const title = response.notification.request.content.title;
        const newDate = Date.now() + 5 * 60 * 1000;
        storage.load({
          key: 'reminders',
        })
          .then(async ret => {
            let i = 0;
            while (!response.notification.request.identifier.includes(ret[i]['notifID'])) {
              i++;
            }
            const oldDate = new Date(ret[i]['date']);
            const newNotifID = await schedulePushNotification(
              title,
              new Date(newDate),
              true,
              Math.round((newDate - oldDate.getTime()) / (60 * 1000))
            );
            ret[i] = {
              'title': ret[i]['title'],
              'date': ret[i]['date'],
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
            setCount((c) => c + 1);
          })
          .catch(err => {
            console.log(err);
          });
      } else if (response.actionIdentifier === 'complete') {
        storage.load({
          key: 'reminders',
        })
          .then(ret => {
            let i = 0;
            while (!response.notification.request.identifier.includes(ret[i]['notifID'])) {
              i++;
            }
            setTimeout(async () => {
              let temp = ret[i];
              let repeat = ret[i]['repeat'];
              if (repeat === 'Never') {
                ret.splice(i, 1);
                storage.save({
                  key: 'reminders',
                  data: ret,
                  expires: null,
                });
                setCount((c) => c + 1);
              } else {
                let oldDate = new Date(ret[i]['date']);
                let newDate;
                if (repeat === 'By the Minute') {
                  newDate = new Date(new Date(oldDate).getTime() + ret[i]['minutes'] * 60 * 1000);
                } else if (repeat === 'Hourly') {
                  newDate = new Date(new Date(oldDate).getTime() + 60 * 60 * 1000);
                } else if (repeat === 'Daily') {
                  newDate = new Date(new Date(oldDate).getTime() + 24 * 60 * 60 * 1000);
                } else if (repeat === 'Weekly') {
                  newDate = new Date(new Date(oldDate).getTime() + 7 * 24 * 60 * 60 * 1000);
                } else if (repeat === 'Monthly') {
                  newDate = new Date(new Date(oldDate).setMonth(oldDate.getMonth() + 1));
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
              storage.load({
                key: 'pastReminders',
              })
                .then(ret => {
                  ret.unshift(temp);
                  storage.save({
                    key: 'pastReminders',
                    data: ret,
                    expires: null,
                  });
                })
                .catch(err => {
                  console.log(err);
                })
              setCount((c) => c + 1);
            }, 1001);
          })
          .catch(err => {
            console.log(err);
          });
      }
    })
    return () => subscription.remove();
  });


  const askPermissions = async () => {
    const { status: existingStatus } = await Notifications.requestPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      Alert.alert(
        'Are you sure you don\'t want notifications? Reminders+ uses notifications to remind you when you have an upcoming task.',
        '',
        [
          { text: 'Yes, I\'m sure' },
          { text: 'No, I want notifications', style: 'cancel', onPress: () => {
            Alert.alert('You can change notification preferences in Settings.');
          }}
        ]
      )
    }
    return true;
  }

  const onNotification = (notifID) => {
    storage.load({
      key: 'reminders',
    })
      .then(ret => {
        let i = 0;
        while (!notifID.includes(ret[i]['notifID'])) {
          i++;
        }
        if (ret[i]['shouldSpeak']) {
          setTimeout(() => {
            Speech.speak(ret[i]['message']);
            setCount((c) => c + 1);
          }, 1000);
        }
      })
      .catch(err => {
        console.log(err);
      })
  }

  const schedulePushNotification = async (title, date, snooze = false, timeSinceReminder = 0) => {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: snooze ? timeSinceReminder + ' minutes ago' : formatDate(date),
        sound: 'default',
        categoryIdentifier: 'notification',
      },
      trigger: date,
    });
    return id;
  };

  const formatDate = (date) => {
    let now = new Date(Date.now());
    let formattedDate = months[date.getMonth()] + ' ' + date.getDate()
    if (now.getFullYear() !== date.getFullYear()) {
      formattedDate += ', ' + date.getFullYear();
    }
    else if (now.getMonth() === date.getMonth()) {
      if (now.getDate() === date.getDate()) {
        formattedDate = 'Today';
      } else if (now.getDate() === date.getDate() - 1) {
        formattedDate = 'Tomorrow';
      }
    }
    let AMPM = date.getHours() < 12 ? 'AM' : 'PM';
    let hours = date.getHours() % 12 === 0 ? '12' : String(date.getHours() % 12);
    let minutes = date.getMinutes() < 10 ? '0' + String(date.getMinutes()) : String(date.getMinutes());
    formattedDate += ', ' + hours + ':' + minutes + ' ' + AMPM;
    return formattedDate;
  }

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
    <NavigationContainer>
      <SafeAreaProvider>
        <Stack.Navigator
          initialRouteName='Home'
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
  );

};

export default App;