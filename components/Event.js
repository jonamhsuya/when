import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  Dimensions,
  StyleSheet,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";

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

export default Event = ({ item, index, onPress }) => {
  const [count, setCount] = useState(0);

  const formatDate = (startDate, endDate, repeat, i) => {
    let now = new Date(Date.now());
    let formattedStartDate = months[startDate.getMonth()] + " " + startDate.getDate();
    let formattedEndDate = months[endDate.getMonth()] + " " + endDate.getDate();
    if (endDate < now && endDate < new Date(item['endRepeat'])) {
      storage
        .load({
          key: "whens",
        })
        .then((ret) => {
          if (repeat !== "Never") {
            if (repeat === "Hourly") {
              startDate.setHours(startDate.getHours() + 1);
              endDate.setHours(endDate.getHours() + 1);
            } else if (repeat === "Daily") {
              startDate.setDate(startDate.getDate() + 1);
              endDate.setDate(endDate.getDate() + 1);
            } else if (repeat === "Weekly") {
              startDate.setDate(startDate.getDate() + 7);
              endDate.setDate(endDate.getDate() + 7);
            } else if (repeat === "Yearly") {
              startDate.setFullYear(startDate.getFullYear() + 1);
              endDate.setFullYear(endDate.getFullYear() + 1);
            }
            ret[i]["startDate"] = startDate.toISOString();
            ret[i]["endDate"] = startDate.toISOString();
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
    if (now.getFullYear() !== startDate.getFullYear()) {
      formattedStartDate += ", " + startDate.getFullYear();
    } else if (now.getMonth() === startDate.getMonth()) {
      if (now.getDate() === startDate.getDate()) {
        formattedStartDate = "Today";
      } else if (now.getDate() === startDate.getDate() - 1) {
        formattedStartDate = "Tomorrow";
      }
    }
    if (
      startDate.getFullYear() === endDate.getFullYear() &&
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getDate() === endDate.getDate()
    ) {
      formattedEndDate = "";
    } else {
      if (now.getFullYear() !== endDate.getFullYear()) {
        formattedEndDate += ", " + endDate.getFullYear();
      } else if (now.getMonth() === endDate.getMonth()) {
        if (now.getDate() === endDate.getDate() - 1) {
          formattedStartDate = "Tomorrow";
        }
      }
    }
    let startAMPM = startDate.getHours() < 12 ? "AM" : "PM";
    let startHours = startDate.getHours() % 12 === 0 ? "12" : String(startDate.getHours() % 12);
    let startMinutes = startDate.getMinutes() < 10 ? "0" + String(startDate.getMinutes()) : String(startDate.getMinutes());
    let endAMPM = endDate.getHours() < 12 ? "AM" : "PM";
    let endHours = endDate.getHours() % 12 === 0 ? "12" : String(endDate.getHours() % 12);
    let endMinutes = endDate.getMinutes() < 10 ? "0" + String(endDate.getMinutes()) : String(endDate.getMinutes());
    formattedStartDate += ", " + startHours + ":" + startMinutes + " " + startAMPM;
    formattedEndDate += formattedEndDate !== "" ? ", " : "";
    formattedEndDate +=  + endHours + ":" + endMinutes + " " + endAMPM;
    return formattedStartDate + " to " + formattedEndDate;
  };

  return (
    <View key={index} style={styles.event}>
      <View style={styles.topBar} />
      <View style={styles.eventContainer}>
        <MaterialCommunityIcons
          name={"calendar"}
          size={20}
          style={{ alignSelf: "center", margin: 10, marginRight: 20 }}
          color="black"
        />
        <View style={{ width: Dimensions.get('screen').width * 0.625 }}>
          <Text
            style={
              new Date(item["endDate"]) > new Date(Date.now())
                ? styles.text
                : styles.overdueText
            }
          >
            {item["title"]}
          </Text>
          <Text
            style={
              new Date(item["endDate"]) > new Date(Date.now())
                ? styles.date
                : styles.overdueDate
            }
          >
            {formatDate(new Date(item["startDate"]), new Date(item["endDate"]), item['repeat'], index)}
            {formatRepeat(item["repeat"], item["minutes"])}
          </Text>
        </View>
        <TouchableOpacity onPress={onPress} style={{margin: 10}}>
          <MaterialCommunityIcons name={"lead-pencil"} size={25} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  event: {
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 2.5,
    margin: 5,
    height: 70,
    backgroundColor: "white",
  },

  topBar: {
    alignSelf: "center",
    width: Dimensions.get("window").width * 0.625 + 115,
    height: 15,
    borderBottomWidth: 1,
    borderTopRightRadius: 2.5,
    borderTopLeftRadius: 2.5,
    backgroundColor: "#EE0000",
  },

  eventContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // width: Dimensions.get("window").width - 40,
    height: 55,
    paddingHorizontal: 10,
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
    fontSize: 10,
  },

  overdueDate: {
    fontWeight: "bold",
    fontSize: 10,
    textDecorationLine: "line-through",
  },
});
