import { useState } from "react";
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
import RNCalendarEvents from "react-native-calendar-events";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import styles from "../styles/styles";
import storage from "../storage/storage";
import { createTriggerNotification } from "../functions/createTriggerNotification";
import { cancelNotification } from "../functions/cancelNotification";
import { updateEvent } from "../functions/updateEvent";

const ViewAlarm = ({ route, navigation }) => {
  const [index, setIndex] = useState(route.params["key"]);
  const [title, setTitle] = useState(route.params["title"]);
  const [date, setDate] = useState(new Date(route.params["date"]));
  const [time, setTime] = useState(new Date(route.params["date"]));
  const [notifID, setNotifID] = useState(route.params["notifID"]);
  const [eventID, setEventID] = useState(route.params["eventID"]);
  // const [shouldSpeak, setShouldSpeak] = useState(route.params['shouldSpeak']);
  // const [message, setMessage] = useState(route.params['message']);
  const [repeat, setRepeat] = useState(route.params["repeat"]);
  const [endRepeat, setEndRepeat] = useState(new Date(route.params["endRepeat"]));
  const [minutes, setMinutes] = useState(route.params["minutes"]);

  const frequencies = ["Never", "Hourly", "Daily", "Weekly"];

  const saveAndReturn = async () => {
    if (title === "") {
      Alert.alert("Please enter a title.");
    } else if (date < new Date(Date.now())) {
      Alert.alert("Please choose a date in the future.");
    }
    // else if (shouldSpeak && message === '') {
    //     Alert.alert('Please enter a message.')
    // }
    else {
      cancelNotification(notifID);
      const newNotifID = await createTriggerNotification(date, title);
      storage
        .load({
          key: "whens",
        })
        .then((ret) => {
          ret[index] = {
            type: "alarm",
            title: title,
            date: date,
            notifID: newNotifID,
            eventID: eventID,
            // 'shouldSpeak': shouldSpeak,
            // 'message': message,
            repeat: repeat,
            endRepeat: endRepeat,
            minutes: minutes,
          };
          storage.save({
            key: "whens",
            data: ret,
          });
        })
        .catch((err) => {
          console.warn(err.message);
        });

      updateEvent(eventID, "alarm", title, date, date, repeat, endRepeat);
      navigation.navigate("Home");
    }
  };

  const deleteAndReturn = (futureEvents, notOnCalendar=false) => {
    storage
      .load({
        key: "whens",
      })
      .then((ret) => {
        whens = ret;
        cancelNotification(notifID);
        RNCalendarEvents.removeEvent(eventID, {exceptionDate: date.toISOString(), futureEvents: futureEvents})
        .then(success => {
          if (futureEvents || date.getTime() + 1 >= new Date(route.params["endRepeat"]).getTime()) {
            whens.splice(index, 1);
          }
          else {
            let add = 60 * 60 * 1000; // one hour
            if (frequencies.indexOf(repeat) >= frequencies.indexOf("Daily")) {
              add *= 24;
            }
            if (frequencies.indexOf(repeat) >= frequencies.indexOf("Weekly")) {
              add *= 7;
            }
            let newDate = new Date(date.getTime() + add);
            whens[index]["date"] = newDate.toISOString();
          }
          storage.save({
            key: "whens",
            data: whens,
          });
          navigation.navigate("Home");
        })
        .catch((err) => {
          if (notOnCalendar) {
            if (futureEvents || date.getTime() + 1 >= new Date(route.params["endRepeat"]).getTime()) {
              whens.splice(index, 1);
            }
            else {
              let add = 24 * 60 * 60 * 1000; // one day
              if (frequencies.indexOf(repeat) <= frequencies.indexOf("Hourly")) {
                add /= 24
              }
              let newDate = new Date(date.getTime() + add);
              whens[index]["date"] = newDate.toISOString();
            }
            storage.save({
              key: "whens",
              data: whens,
            });
            navigation.navigate("Home");
          }
          else {
            console.warn(err);
            Alert.alert(
              "There was an error in removing your When. Please try again."
            );
          }
        });
      })
      .catch((err) => {
        console.warn(err.message);
      });
  };

  const onChangeDate = (event, selectedDate) => {
    setDate(selectedDate);
    date.setHours(time.getHours(), time.getMinutes(), 0, 0);
  };

  const onChangeTime = (event, selectedTime) => {
    setTime(selectedTime);
    date.setHours(time.getHours(), time.getMinutes(), 0, 0);
  };

  const onChangeEndRepeat = (event, selectedDate) => {
    setEndRepeat(selectedDate);
    endRepeat.setHours(date.getHours(), date.getMinutes(), 0, 1);
  };

  // const onChangeShouldSpeak = () => {
  //     setShouldSpeak(previousState => !previousState);
  // };

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
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.shortButton} onPress={saveAndReturn}>
            <MaterialCommunityIcons
              name={"content-save-outline"}
              size={40}
              style={{ alignSelf: "center" }}
              color="black"
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.shortButton}
            onPress={() => {
              if (route.params["repeat"] !== "Never") {
                Alert.alert('Do you want to delete this alarm only, or all future alarms as well?', '', [
                  {text: 'Delete This Alarm Only', onPress: () => deleteAndReturn(false,
                    frequencies.indexOf(route.params["repeat"]) < frequencies.indexOf("Daily"))},
                  {text: 'Delete All Future Alarms', onPress: () => deleteAndReturn(true,
                    frequencies.indexOf(route.params["repeat"]) < frequencies.indexOf("Daily"))},
                  {text: 'Cancel', style: 'cancel'},
                ]);
              } else {
                Alert.alert('Are you sure you want to delete this alarm?', '', [
                  {text: 'Delete', onPress: () => deleteAndReturn(true)},
                  {text: 'Cancel', style: 'cancel'},
                ]);
              }
            }}
          >
            <MaterialCommunityIcons
              name={"trash-can-outline"}
              size={40}
              style={{ alignSelf: "center" }}
              color="black"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ViewAlarm;
