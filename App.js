import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import notifee, { TriggerType, EventType } from '@notifee/react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
// import * as Speech from 'expo-speech';

import MyReminders from './screens/MyReminders';
import CompletedTasks from './screens/CompletedTasks';
import CreateNewReminder from './screens/CreateNewReminder';
import ViewReminder from './screens/ViewReminder';
import ViewCompletedTask from './screens/ViewCompletedTask';

import storage from './storage/storage';
import { formatDate } from './functions/formatDate';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {

  const [count, setCount] = useState(0);

  storage.load({
    key: 'firstTime',
  })
    .then(() => {
      // reminders has already been initialized, do nothing
    })
    .catch(() => {
      // user is accessing app for the first time
      setCategories();
      // save empty array in storage to store future reminders and completed tasks
      storage.save({
        key: 'reminders',
        data: [],
        expires: null,
      });
      storage.save({
        key: 'completedTasks',
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

  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      if (type === EventType.DELIVERED) {
        setCount((c) => c + 1);
      } else if (type === EventType.ACTION_PRESS) {
        onActionPress(detail.notification, detail.pressAction);
      }
    });
  }, []);

  notifee.onBackgroundEvent(async ({ type, detail }) => {
    const { notification, pressAction } = detail;

    if (type === EventType.ACTION_PRESS) {
      onActionPress(notification, pressAction);
    }
  });

  const onActionPress = (notification, pressAction) => {
    storage.load({
      key: 'reminders',
    })
      .then(async ret => {
        let i = 0;
        while (notification.id !== ret[i]['notifID']) {
          i++;
        }
        if (pressAction.id === 'snooze') {
          const title = notification.title;
          const newDate = Date.now() + 5 * 60 * 1000;
          const oldDate = new Date(ret[i]['date']);
          const newNotifID = await createTriggerNotification(
            title,
            new Date(newDate),
            true,
            Math.round((newDate - oldDate.getTime()) / (60 * 1000))
          );
          ret[i]['notifID'] = newNotifID;
        } else if (pressAction.id === 'done') {
          let temp = ret[i];
          ret.splice(i, 1);
          storage.load({
            key: 'completedTasks',
          })
            .then(ret => {
              ret.unshift(temp);
              storage.save({
                key: 'completedTasks',
                data: ret,
                expires: null,
              });
            })
            .catch(err => {
              console.log(err);
            })
        }
        storage.save({
          key: 'reminders',
          data: ret,
          expires: null,
        });
      })
      .catch(err => {
        console.log(err);
      });
    setCount((c) => c + 1);
  }

  const HomeScreen = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === 'My Reminders') {
              iconName = 'format-list-checkbox'
            } else if (route.name === 'Completed Tasks') {
              iconName = 'check-bold'
            }

            return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#D32027',
          tabBarInactiveTintColor: '#AAAAAA',
        })}
      >
        <Tab.Screen name='My Reminders' component={MyReminders} />
        <Tab.Screen name='Completed Tasks' component={CompletedTasks} />
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
            name='ViewCompletedTask'
            component={ViewCompletedTask}
            options={{ title: 'View Completed Task' }}
          />
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );

};

export default App;


const createTriggerNotification = async (title, date, snooze = false, minutesSinceOriginal = 0) => {
  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime()
  };
  const id = await notifee.createTriggerNotification(
    {
      title: title,
      body: snooze ? minutesSinceOriginal + ' minutes ago' : formatDate(date),
      ios: {
        categoryId: 'reminder',
        sound: 'default'
      }
    },
    trigger,
  );
  return id;
}

const setCategories = async () => {
  await notifee.setNotificationCategories([
    {
      id: 'reminder',
      actions: [
        {
          id: 'snooze',
          title: 'Snooze ⏰',
        },
        {
          id: 'done',
          title: 'Done ✅',
        },
      ],
    },
  ]);
}