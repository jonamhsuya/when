import React, { useEffect, useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import notifee, { EventType } from "@notifee/react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import RNCalendarEvents from "react-native-calendar-events";
// import * as Speech from 'expo-speech';

import Home from "./screens/Home";
import Calendar from "./screens/Calendar";
import CreateNewAlarm from "./screens/CreateNewAlarm";
import CreateNewReminder from "./screens/CreateNewReminder";
import CreateNewEvent from "./screens/CreateNewEvent";
import ViewAlarm from "./screens/ViewAlarm";
import ViewReminder from "./screens/ViewReminder";
import ViewEvent from "./screens/ViewEvent";

import storage from "./storage/storage";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => {
  const [count, setCount] = useState(0);

  storage
    .load({
      key: "firstTime",
    })
    .then(() => {
      // reminders has already been initialized, do nothing
    })
    .catch(() => {
      // user is accessing app for the first time
      // save empty array in storage to store future reminders and completed tasks
      storage.save({
        key: "whens",
        data: [],
        expires: null,
      });
      storage.save({
        key: "completedTasks",
        data: [],
        expires: null,
      });
      // store firstTime value so array is not reset every time
      storage.save({
        key: "firstTime",
        data: false,
        expires: null,
      });
      // create calendars for Whens and store IDs
      RNCalendarEvents.requestPermissions().then((permission) => {
        if (permission === "authorized") {
          let alarms = false;
          let reminders = false;
          let events = false;
          RNCalendarEvents.findCalendars().then((arr) => {
            for (let i = 0; i < arr.length; i++) {
              if (arr[i]["title"] === "Alarms") {
                storage.save({
                  key: "alarmsID",
                  data: arr[i]["id"],
                  expires: null,
                });
                alarms = true;
              } else if (arr[i]["title"] === "Reminders") {
                storage.save({
                  key: "remindersID",
                  data: arr[i]["id"],
                  expires: null,
                });
                reminders = true;
              } else if (arr[i]["title"] === "Events") {
                storage.save({
                  key: "eventsID",
                  data: arr[i]["id"],
                  expires: null,
                });
                events = true;
              }
            }
            if (!alarms) {
              RNCalendarEvents.saveCalendar({
                title: "Alarms",
                color: "navy",
                entityType: "event",
                name: "Alarms",
              }).then((id) => {
                storage.save({
                  key: "alarmsID",
                  data: id,
                  expires: null,
                });
              });
            }
            if (!reminders) {
              RNCalendarEvents.saveCalendar({
                title: "Reminders",
                color: "darkorange",
                entityType: "event",
                name: "Reminders",
              }).then((id) => {
                storage.save({
                  key: "remindersID",
                  data: id,
                  expires: null,
                });
              });
            }
            if (!events) {
              RNCalendarEvents.saveCalendar({
                title: "Events",
                color: "red",
                entityType: "event",
                name: "Events",
              }).then((id) => {
                storage.save({
                  key: "eventsID",
                  data: id,
                  expires: null,
                });
              });
            }
          });
        }
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

  const HomeScreen = () => {
    return (
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            let iconName;

            if (route.name === "Home") {
              iconName = "home";
            } else if (route.name === "Calendar") {
              iconName = "calendar-month";
            }

            return (
              <MaterialCommunityIcons
                name={iconName}
                size={size}
                color={color}
              />
            );
          },
          tabBarActiveTintColor: "#000000",
          tabBarInactiveTintColor: "#999999",
        })}
      >
        <Tab.Screen name="Home" component={Home} />
        <Tab.Screen name="Calendar" component={Calendar} />
      </Tab.Navigator>
    );
  };

  return (
    <NavigationContainer>
      <SafeAreaProvider>
        <Stack.Navigator initialRouteName="HomeScreen">
          <Stack.Screen
            name="HomeScreen"
            component={HomeScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="CreateNewAlarm"
            component={CreateNewAlarm}
            options={{ title: "Create New Alarm" }}
          />
          <Stack.Screen
            name="CreateNewReminder"
            component={CreateNewReminder}
            options={{ title: "Create New Reminder" }}
          />
          <Stack.Screen
            name="CreateNewEvent"
            component={CreateNewEvent}
            options={{ title: "Create New Event" }}
          />
          <Stack.Screen
            name="ViewAlarm"
            component={ViewAlarm}
            options={{ title: "View Alarm" }}
          />
          <Stack.Screen
            name="ViewReminder"
            component={ViewReminder}
            options={{ title: "View Reminder" }}
          />
          <Stack.Screen
            name="ViewEvent"
            component={ViewEvent}
            options={{ title: "View Event" }}
          />
        </Stack.Navigator>
      </SafeAreaProvider>
    </NavigationContainer>
  );
};

export default App;
