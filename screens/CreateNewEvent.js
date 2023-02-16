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

const CreateNewEvent = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [startDate, setStartDate] = useState(new Date(Date.now()));
  const [endDate, setEndDate] = useState(new Date(Date.now() + 60 * 60 * 1000));
  const [repeat, setRepeat] = useState("Never");
  const [endRepeat, setEndRepeat] = useState(new Date(Date.now() + 60 * 60 * 1000));
  const [minutes, setMinutes] = useState(0);

  const frequencies = ["Never", "Hourly", "Daily", "Weekly"];

  const addAndReturn = async () => {
    if (title === "") {
      Alert.alert("Please enter a title.");
    } else if (startDate < new Date(Date.now())) {
      Alert.alert("Please choose a start date in the future.");
    } else if (endDate < startDate) {
      Alert.alert("The end date must be after the start date.");
    } else if (repeat === "") {
      Alert.alert("Please select a repeat frequency.");
    } else {
      const notifID = await createTriggerNotification(startDate, title, repeat);
      storage
        .load({
          key: "whens",
        })
        .then((ret) => {
          createEvent("event", title, ret.length, startDate, endDate, repeat, endRepeat);
          ret.push({
            type: "event",
            title: title,
            startDate: startDate,
            endDate: endDate,
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

  const onChangeStartDate = (event, selectedDate) => {
    setStartDate(selectedDate);
    startDate.setSeconds(0);
  };

  const onChangeEndDate = (event, selectedDate) => {
    setEndDate(selectedDate);
    endDate.setSeconds(0);
  };

  const onChangeEndRepeat = (event, selectedDate) => {
    setEndRepeat(selectedDate);
    endRepeat.setHours(endDate.getHours(), endDate.getMinutes() + 1, 0);
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
            <Text style={styles.boxText}>Start</Text>
          </View>
          <DateTimePicker
            testID="dateTimePicker"
            value={startDate}
            mode={"datetime"}
            is24Hour={true}
            onChange={onChangeStartDate}
            style={styles.picker}
          />
        </View>
        <View style={styles.createReminderGroup}>
          <View style={styles.filledBox}>
            <Text style={styles.boxText}>End</Text>
          </View>
          <DateTimePicker
            testID="dateTimePicker"
            value={endDate}
            mode={"datetime"}
            is24Hour={true}
            onChange={onChangeEndDate}
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

export default CreateNewEvent;
