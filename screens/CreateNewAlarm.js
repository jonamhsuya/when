import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Switch,
  ScrollView,
  Dimensions,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import DateTimePicker from "@react-native-community/datetimepicker";
import SelectDropdown from "react-native-select-dropdown";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import styles from "../styles/styles";
import storage from "../storage/storage";
import { createTriggerNotification } from "../functions/createTriggerNotification";
import { createEvent } from "../functions/createEvent";

const CreateNewAlarm = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date(Date.now()));
  const [time, setTime] = useState(new Date(Date.now()));
  const [repeat, setRepeat] = useState("Never");
  const [endRepeat, setEndRepeat] = useState(new Date(Date.now()));
  const [minutes, setMinutes] = useState(0);

  const frequencies = ["Never", "Hourly", "Daily", "Weekly", "Yearly"];

  const addAndReturn = async () => {
    if (title === "") {
      Alert.alert("Please enter a title.");
    } else if (date < new Date(Date.now())) {
      Alert.alert("Please choose a date in the future.");
    } else if (repeat === "") {
      Alert.alert("Please select a repeat frequency.");
    } else {
      const notifID = await createTriggerNotification(date, title, repeat);
      storage
        .load({
          key: "whens",
        })
        .then((ret) => {
          createEvent("alarm", title, ret.length, date, date, repeat, endRepeat);
          ret.push({
            type: "alarm",
            title: title,
            date: date,
            notifID: notifID,
            eventID: "",
            // 'shouldSpeak': shouldSpeak,
            // 'message': message,
            repeat: repeat,
            endRepeat: endRepeat,
            minutes: minutes,
          });
          storage.save({
            key: "whens",
            data: ret,
          });
        })
        .catch((err) => {
          console.warn(err.message);
        });
      navigation.navigate("Home");
    }
  };

  const onChangeDate = (event, selectedDate) => {
    setDate(selectedDate);
    date.setHours(time.getHours(), time.getMinutes(), 0);
  };

  const onChangeTime = (event, selectedTime) => {
    setTime(selectedTime);
    date.setHours(time.getHours(), time.getMinutes(), 0);
  };

  const onChangeEndRepeat = (event, selectedDate) => {
    setEndRepeat(selectedDate);
    endRepeat.setHours(date.getHours(), date.getMinutes() + 1, 0);
  };

  //   const onChangeShouldSpeak = () => {
  //     setShouldSpeak((previousState) => !previousState);
  //   };

  return (
    <SafeAreaView>
      <ScrollView
        scrollEnabled={false}
        keyboardShouldPersistTaps="handled"
        style={styles.scrollView}
      >
        <TextInput
          placeholder="Title"
          placeholderTextColor={"lightgray"}
          value={title}
          onChangeText={(t) => setTitle(t)}
          style={styles.textInput}
        />
        <View style={styles.createReminderGroup}>
          <View style={styles.filledBox}>
            <Text style={styles.boxText}>Date</Text>
          </View>
          <DateTimePicker
            testID="dateTimePicker"
            value={date}
            mode={"date"}
            is24Hour={true}
            onChange={onChangeDate}
            style={styles.picker}
          />
        </View>
        <View style={styles.createReminderGroup}>
          <View style={styles.filledBox}>
            <Text style={styles.boxText}>Time</Text>
          </View>
          <DateTimePicker
            testID="dateTimePicker"
            value={time}
            mode={"time"}
            is24Hour={true}
            onChange={onChangeTime}
            style={styles.picker}
          />
        </View>
        <View style={styles.line} />
        <View style={styles.createReminderGroup}>
          <View style={styles.box}>
            <Text style={styles.text}>Repeat</Text>
          </View>
          <SelectDropdown
            data={frequencies}
            defaultValue={repeat}
            buttonStyle={{
              alignSelf: "flex-end",
              marginHorizontal: 20,
              marginVertical: 10,
              width: Dimensions.get("window").width - 170,
              backgroundColor: "lightgray",
              borderRadius: 10,
            }}
            dropdownStyle={{ borderRadius: 10 }}
            onSelect={(selectedItem, index) => {
              setRepeat(selectedItem);
            }}
            buttonTextAfterSelection={(selectedItem, index) => {
              return selectedItem;
            }}
            rowTextForSelection={(item, index) => {
              return item;
            }}
          />
        </View>
        {repeat !== "Never" && (
          <View style={styles.createReminderGroup}>
            <View style={styles.box}>
              <Text style={styles.text}>End Repeat</Text>
            </View>
            <DateTimePicker
              testID="dateTimePicker"
              value={endRepeat}
              mode={"date"}
              is24Hour={true}
              onChange={onChangeEndRepeat}
              style={styles.picker}
            />
          </View>
        )}
        {/* <View style={styles.createReminderGroup}>
          <View style={styles.box}>
            <Text style={styles.text}>Speech</Text>
          </View>
          <View style={styles.buffer} />
          <Switch
            // trackColor={{ true: '#ff6347' }}
            onValueChange={onChangeShouldSpeak}
            value={shouldSpeak}
            style={styles.picker}
          />
        </View>
        {shouldSpeak && (
          <TextInput
            placeholder="Enter message to be spoken..."
            placeholderTextColor={"lightgray"}
            value={message}
            onChangeText={(m) => setMessage(m)}
            style={styles.smallTextInput}
          />
        )} */}
        <Text></Text>
        {frequencies.indexOf(repeat) < frequencies.indexOf("Daily") && repeat !== "Never" && (
          <Text style={styles.noWhens}>
            Note that any frequency higher than Daily will not be displayed on
            Calendar.
          </Text>
        )}
        <TouchableOpacity style={styles.longButton} onPress={addAndReturn}>
          <MaterialCommunityIcons
            name={"plus"}
            size={40}
            style={{ alignSelf: "center" }}
            color="black"
          />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CreateNewAlarm;
