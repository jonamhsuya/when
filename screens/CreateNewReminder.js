import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Notifications from 'expo-notifications';

import styles from '../styles/styles';
import storage from '../storage/storage';

const CreateNewReminder = ({ navigation }) => {

    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date(Date.now()));
    const [time, setTime] = useState(new Date(Date.now()));
    const [shouldSpeak, setShouldSpeak] = useState(false);
    const [message, setMessage] = useState(title);

    const addAndReturn = async () => {
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
            const notifID = schedulePushNotification();
            storage.load({
                key: 'reminders',
            })
                .then(ret => {
                    ret.push({ 'title': title, 'date': date, 'notifID': notifID, 'shouldSpeak': shouldSpeak, 'message': message });
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
                    placeholder='Title'
                    placeholderTextColor={'lightgray'}
                    value={title}
                    onChangeText={(t) => { setTitle(t); setMessage(t); }}
                    style={styles.textInput}
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
                    onPress={addAndReturn}
                >
                    <Text style={{ fontSize: 24, textAlign: 'center' }}>Create</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );

};

export default CreateNewReminder;