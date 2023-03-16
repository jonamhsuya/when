import notifee, { TriggerType, RepeatFrequency } from "@notifee/react-native";
import * as Notifications from "expo-notifications"

/* const formatDate = (date) => {
  let now = new Date(Date.now());
  let formattedDate = months[date.getMonth()] + " " + date.getDate();
  if (now.getFullYear() !== date.getFullYear()) {
    formattedDate += ", " + date.getFullYear();
  } else if (now.getMonth() === date.getMonth()) {
    if (now.getDate() === date.getDate()) {
      formattedDate = "Today";
    } else if (now.getDate() === date.getDate() - 1) {
      formattedDate = "Tomorrow";
    }
  }
  let AMPM = date.getHours() < 12 ? "AM" : "PM";
  let hours = date.getHours() % 12 === 0 ? "12" : String(date.getHours() % 12);
  let minutes =
    date.getMinutes() < 10
      ? "0" + String(date.getMinutes())
      : String(date.getMinutes());
  formattedDate += ", " + hours + ":" + minutes + " " + AMPM;
  return formattedDate;
}; */

export const createTriggerNotification = async (date, title, repeat) => {
  await notifee.requestPermission();
  const trigger = {
    type: TriggerType.TIMESTAMP,
    timestamp: date.getTime(),
    repeatFrequency:
      repeat === "Hourly"
        ? RepeatFrequency.HOURLY
        : repeat === "Daily"
        ? RepeatFrequency.DAILY
        : repeat === "Weekly"
        ? RepeatFrequency.WEEKLY
        : RepeatFrequency.NONE,
  };
  const id = await notifee.createTriggerNotification(
    {
      title: title,
      body: "Now",
      ios: {
        // categoryId: 'reminder',
        sound: "default",
      },
    },
    trigger
  );
  return id;
};
