import React, { useState } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Dimensions,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";

import styles from "../styles/styles";
import storage from "../storage/storage";
import Alarm from "../components/Alarm";
import Reminder from "../components/Reminder";
import Event from "../components/Event";

const Home = ({ navigation }) => {
  const [data, setData] = useState([]);
  const [title, setTitle] = useState("Title");
  const [modalVisible, setModalVisible] = useState(false);

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

  const formatRepeat = (repeat, minutes) => {
    if (repeat === "Never") {
      return "";
    } else if (repeat !== "By the Minute") {
      return "  |  " + repeat;
    } else {
      return (
        "  |  Every " + (minutes === "1" ? "Minute" : minutes + " Minutes")
      );
    }
  };

  useFocusEffect(() => {
    storage
      .load({
        key: "whens",
      })
      .then((ret) => {
        setData(ret);
      })
      .catch((err) => {
        console.log(err.message);
      });
  });

  const noWhens = (
    <Text style={styles.noWhens}>No Whens. Create a new one!</Text>
  );

  return (
    <SafeAreaView>
      {data.length === 0 ? (
        noWhens
      ) : (
        <ScrollView
          style={styles.reminderView}
          scrollEnabled={
            data.length * 75 > Dimensions.get("window").height - 400
          }
        >
          {data.map((item, index) => (
            <View key={index}>
              {item["type"] === "alarm" && (
                <Alarm
                  item={item}
                  index={index}
                  onPress={() =>
                    navigation.navigate("ViewAlarm", {
                      key: index,
                      title: item["title"],
                      date: item["date"],
                      notifID: item["notifID"],
                      eventID: item["eventID"],
                      // shouldSpeak: item['shouldSpeak'],
                      // message: item['message'],
                      repeat: item["repeat"],
                      endRepeat: item['endRepeat'],
                      minutes: item["minutes"],
                    })
                  }
                />
              )}
              {item["type"] === "reminder" && (
                <Reminder
                  item={item}
                  index={index}
                  onPress={() =>
                    navigation.navigate("ViewReminder", {
                      key: index,
                      title: item["title"],
                      date: item["date"],
                      notifID: item["notifID"],
                      eventID: item["eventID"],
                      // shouldSpeak: item['shouldSpeak'],
                      // message: item['message'],
                      repeat: item["repeat"],
                      endRepeat: item['endRepeat'],
                      minutes: item["minutes"],
                    })
                  }
                />
              )}
              {item["type"] === "event" && (
                <Event
                  item={item}
                  index={index}
                  onPress={() =>
                    navigation.navigate("ViewEvent", {
                      key: index,
                      title: item["title"],
                      startDate: item["startDate"],
                      endDate: item['endDate'],
                      notifID: item["notifID"],
                      eventID: item["eventID"],
                      // shouldSpeak: item['shouldSpeak'],
                      // message: item['message'],
                      repeat: item["repeat"],
                      endRepeat: item['endRepeat'],
                      minutes: item["minutes"],
                    })
                  }
                />
              )}
            </View>
          ))}
        </ScrollView>
      )}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modal}>
          <TouchableOpacity
            onPress={() => {
              setModalVisible(!modalVisible);
            }}
          >
            <View
              style={{
                alignItems: "flex-start",
                width: Dimensions.get("window").width - 50,
              }}
            >
              <Feather
                name={"x"}
                size={25}
                style={{ marginHorizontal: 20, marginBottom: 10 }}
              />
            </View>
          </TouchableOpacity>
          <Text style={styles.header}>Pick a type for your When.</Text>
          <TouchableOpacity
            style={[styles.modalButton]}
            onPress={() => {
              setModalVisible(!modalVisible);
              navigation.navigate("CreateNewAlarm");
            }}
          >
            <MaterialCommunityIcons
              name={"alarm"}
              size={40}
              style={{ alignSelf: "center", margin: 10, marginRight: 20 }}
              color="navy"
            />
            <View style={{ alignItems: "flex-start", width: 200 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "navy",
                }}
              >
                Alarm
              </Text>
              <Text>Best for something that really needs your attention.</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton]}
            onPress={() => {
              setModalVisible(!modalVisible);
              navigation.navigate("CreateNewReminder");
            }}
          >
            <MaterialCommunityIcons
              name={"reminder"}
              size={40}
              style={{ alignSelf: "center", margin: 10, marginRight: 20 }}
              color="darkorange"
            />
            <View style={{ alignItems: "flex-start", width: 200 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "darkorange",
                }}
              >
                Reminder
              </Text>
              <Text>
                Best for all sorts of tasks, like cooking or doing laundry.
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalButton]}
            onPress={() => {
              setModalVisible(!modalVisible);
              navigation.navigate("CreateNewEvent");
            }}
          >
            <MaterialCommunityIcons
              name={"calendar"}
              size={40}
              style={{ alignSelf: "center", margin: 10, marginRight: 20 }}
              color="red"
            />
            <View style={{ alignItems: "flex-start", width: 200 }}>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 22,
                  fontWeight: "bold",
                  color: "red",
                }}
              >
                Event
              </Text>
              <Text>Best for upcoming events, like a class or meeting.</Text>
            </View>
          </TouchableOpacity>
        </View>
      </Modal>
      <TouchableOpacity
        style={styles.longButton}
        onPress={() => {
          setModalVisible(true);
        }}
      >
        <MaterialCommunityIcons
          name={"plus"}
          size={40}
          style={{ alignSelf: "center" }}
          color="black"
        />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
