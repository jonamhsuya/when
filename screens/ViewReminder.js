import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

import styles from '../styles/styles';
import storage from '../storage/storage';


const ViewReminder = ({ route, navigation }) => {

    const [index, setIndex] = useState(route.params['key']);
    const [title, setTitle] = useState(route.params['title']);
    const [date, setDate] = useState(new Date(route.params['date']));
    const [time, setTime] = useState(new Date(route.params['date']));
    const [notifID, setNotifID] = useState(route.params['notifID']);
    const [shouldSpeak, setShouldSpeak] = useState(route.params['shouldSpeak']);
    const [message, setMessage] = useState(route.params['message']);

    const saveAndReturn = async () => {
        if (title === '') {
            alert('Please enter a title.')
        }
        else if (date < new Date(Date.now())) {
            alert('Please choose a date in the future.');
        }
        else if (shouldSpeak && message === '') {
            alert('Please enter a message.')
        }
        else {
            await cancelNotification(notifID);
            const newNotifID = await schedulePushNotification();
            storage.load({
                key: 'reminders',
            })
                .then(ret => {
                    ret[index] = { 'title': title, 'date': date, 'notifID': newNotifID, 'shouldSpeak': shouldSpeak, 'message': message };
                    storage.save({
                        key: 'reminders',
                        data: ret
                    });
                })
                .catch(err => {
                    console.warn(err.message);
                });
            navigation.navigate('Home');
        }
    }

    const schedulePushNotification = async () => {
        const id = await Notifications.scheduleNotificationAsync({
            content: {
                title: title,
            },
            trigger: date,
        });
        return id;
    };

    const cancelNotification = async (notifID) => {
        await Notifications.cancelScheduledNotificationAsync(notifID);
    }

    const deleteAndReturn = () => {
        storage.load({
            key: 'reminders',
        })
            .then(ret => {
                cancelNotification(notifID);
                ret.splice(index, 1);
                storage.save({
                    key: 'reminders',
                    data: ret
                })
            })
            .catch(err => {
                console.warn(err.message);
            });
        navigation.navigate('Home');
    }

    const onChangeDate = (event, selectedDate) => {
        setDate(selectedDate);
        date.setHours(time.getHours(), time.getMinutes(), 0);
    };

    const onChangeTime = (event, selectedTime) => {
        setTime(selectedTime);
        date.setHours(time.getHours(), time.getMinutes(), 0);
    };

    const onChangeShouldSpeak = () => {
        setShouldSpeak(previousState => !previousState);
    };


    return (
        <SafeAreaView>
            <ScrollView
                scrollEnabled={false}
                keyboardShouldPersistTaps='handled'
                style={styles.scrollView}
            >
                <TextInput
                    style={styles.textInput}
                    placeholder='Title'
                    value={title}
                    onChangeText={(t) => setTitle(t)}
                />
                <View style={styles.createReminderGroup}>
                    <View style={styles.box}>
                        <Text style={styles.boxText}>Date</Text>
                    </View>
                    <DateTimePicker
                        testID='dateTimePicker'
                        value={date}
                        mode={'date'}
                        is24Hour={true}
                        onChange={onChangeDate}
                        style={styles.picker}
                    />
                </View>
                <View style={styles.createReminderGroup}>
                    <View style={styles.box}>
                        <Text style={styles.boxText}>Time</Text>
                    </View>
                    <DateTimePicker
                        testID='dateTimePicker'
                        value={time}
                        mode={'time'}
                        is24Hour={true}
                        onChange={onChangeTime}
                        style={styles.picker}
                    />
                </View>
                <View style={styles.line} />
                <View style={styles.createReminderGroup}>
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
                {shouldSpeak &&
                    <TextInput
                        placeholder='What would you like to be spoken?'
                        placeholderTextColor={'lightgray'}
                        value={message}
                        onChangeText={(m) => setMessage(m)}
                        style={styles.smallTextInput}
                    />}
                <TouchableOpacity
                    style={styles.topButton}
                    onPress={saveAndReturn}
                >
                    <Text style={{ fontSize: 24, textAlign: 'center' }}>Save</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={styles.button}
                    onPress={deleteAndReturn}
                >
                    <Text style={{ fontSize: 24, textAlign: 'center', color: 'red' }}>Delete</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );

};

export default ViewReminder;