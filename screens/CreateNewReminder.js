import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown';
import * as Notifications from 'expo-notifications';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from '../styles/styles';
import storage from '../storage/storage';

const CreateNewReminder = ({ navigation }) => {

    const [title, setTitle] = useState('');
    const [date, setDate] = useState(new Date(Date.now()));
    const [time, setTime] = useState(new Date(Date.now()));
    const [shouldSpeak, setShouldSpeak] = useState(false);
    const [message, setMessage] = useState(title);
    const [repeat, setRepeat] = useState('');
    const [minutes, setMinutes] = useState(0);

    const frequencies = ['Never', 'By the Minute', 'Hourly', 'Daily', 'Weekly', 'Monthly', 'Yearly'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
        else if (repeat === '') {
            alert('Please select a repeat frequency.')
        }
        else {
            const notifID = await schedulePushNotification();
            storage.load({
                key: 'reminders',
            })
                .then(ret => {
                    ret.push({
                        'title': title,
                        'date': date,
                        'notifID': notifID,
                        'shouldSpeak': shouldSpeak,
                        'message': message,
                        'repeat': repeat,
                        'minutes': minutes
                    });
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
                body: formatDate(),
                sound: 'default',
                categoryIdentifier: 'notification',
            },
            trigger: date,
        });
        return id;
    }

    const formatDate = () => {
        let now = new Date(Date.now());
        let formattedDate = months[date.getMonth()] + ' ' + date.getDate()
        if (now.getFullYear() !== date.getFullYear()) {
            formattedDate += ', ' + date.getFullYear();
        }
        else if (now.getMonth() === date.getMonth()) {
            if (now.getDate() === date.getDate()) {
                formattedDate = 'Today';
            } else if (now.getDate() === date.getDate() - 1) {
                formattedDate = 'Tomorrow';
            }
        }
        let AMPM = date.getHours() < 12 ? 'AM' : 'PM';
        let hours = date.getHours() % 12 === 0 ? '12' : String(date.getHours() % 12);
        let minutes = date.getMinutes() < 10 ? '0' + String(date.getMinutes()) : String(date.getMinutes());
        formattedDate += ', ' + hours + ':' + minutes + ' ' + AMPM;
        return formattedDate;
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
                    placeholder='Title'
                    placeholderTextColor={'lightgray'}
                    value={title}
                    onChangeText={(t) => { setTitle(t); setMessage(t); }}
                    style={styles.textInput}
                />
                <View style={styles.createReminderGroup}>
                    <View style={styles.filledBox}>
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
                    <View style={styles.filledBox}>
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
                        <Text style={styles.text}>Repeat</Text>
                    </View>
                    <SelectDropdown
                        data={frequencies}
                        buttonStyle={{
                            alignSelf: 'flex-end',
                            marginHorizontal: 20,
                            marginVertical: 10,
                            width: Dimensions.get('window').width - 170,
                            backgroundColor: 'lightgray',
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
                {repeat === 'By the Minute' &&
                    <View style={styles.minutesGroup}>
                        <Text style={styles.smallText}>Every</Text>
                        <TextInput
                            keyboardType='numeric'
                            value={minutes}
                            onChangeText={(m) => setMinutes(m)}
                            style={styles.minuteTextInput}
                        />
                        <Text style={styles.smallText}>minutes</Text>
                    </View>
                }
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
                        placeholder='Enter message to be spoken...'
                        placeholderTextColor={'lightgray'}
                        value={message}
                        onChangeText={(m) => setMessage(m)}
                        style={styles.smallTextInput}
                    />}
                <TouchableOpacity
                    style={styles.longButton}
                    onPress={addAndReturn}
                >
                    <MaterialCommunityIcons name={'plus'} size={40} style={{ alignSelf: 'center' }} color='black' />
                    {/* <Text style={{ fontSize: 50, textAlign: 'center' }}>Create</Text> */}
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );

};

export default CreateNewReminder;