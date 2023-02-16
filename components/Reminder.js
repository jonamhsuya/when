import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import storage from "../storage/storage";
import { formatRepeat } from "../functions/formatRepeat";
const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export default Reminder = ({ item, index, onPress }) => {
  const [count, setCount] = useState(0);

  const formatDate = (date, repeat, i) => {
    let now = new Date(Date.now());
    let formattedDate = months[date.getMonth()] + " " + date.getDate();
    if (date < now && date < new Date(item['endRepeat'])) {
      storage
        .load({
          key: "whens",
        })
        .then((ret) => {
          if (repeat !== "Never") {
            if (repeat === "Hourly") {
              date.setHours(date.getHours() + 1);
            } else if (repeat === "Daily") {
              date.setDate(date.getDate() + 1);
            } else if (repeat === "Weekly") {
              date.setDate(date.getDate() + 7);
            } else if (repeat === "Yearly") {
              date.setFullYear(date.getFullYear() + 1);
            }
            ret[i]["date"] = date.toISOString();
            storage.save({
              key: "whens",
              data: ret,
              expires: null,
            });
            setCount((c) => c + 1);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
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
    let hours =
      date.getHours() % 12 === 0 ? "12" : String(date.getHours() % 12);
    let minutes =
      date.getMinutes() < 10
        ? "0" + String(date.getMinutes())
        : String(date.getMinutes());
    formattedDate += ", " + hours + ":" + minutes + " " + AMPM;
    return formattedDate;
  };

  return (
    <View key={index} style={styles.reminder}>
      <MaterialCommunityIcons
        name={"reminder"}
        size={20}
        style={{ alignSelf: "center", margin: 10, marginRight: 15 }}
        color="black"
      />
      <View style={{ width: 245 }}>
        <Text
          style={
            new Date(item["date"]) > new Date(Date.now())
              ? styles.text
              : styles.overdueText
          }
        >
          {item["title"]}
        </Text>
        <Text
          style={
            new Date(item["date"]) > new Date(Date.now())
              ? styles.date
              : styles.overdueDate
          }
        >
          {formatDate(new Date(item["date"]), item["repeat"], index)}
          {formatRepeat(item["repeat"], item["minutes"])}
        </Text>
      </View>
      <TouchableOpacity onPress={onPress}>
        <MaterialCommunityIcons name={"lead-pencil"} size={25} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  reminder: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 1,
    padding: 10,
    margin: 5,
    width: Dimensions.get("window").width - 40,
    height: 70,
    shadowOffset: { width: 0, height: 0 },
    backgroundColor: "lemonchiffon",
  },

  text: {
    fontWeight: "bold",
    fontSize: 16,
  },

  overdueText: {
    fontWeight: "bold",
    fontSize: 16,
    textDecorationLine: "line-through",
  },

  date: {
    fontWeight: "bold",
    fontSize: 12,
  },

  overdueDate: {
    fontWeight: "bold",
    fontSize: 12,
    textDecorationLine: "line-through",
  },
});
