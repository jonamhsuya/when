import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, ScrollView, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';
import SelectDropdown from 'react-native-select-dropdown';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from '../styles/styles';
import storage from '../storage/storage';
import { createTriggerNotification } from '../functions/createTriggerNotification';


const ViewCompletedTask = ({ route, navigation }) => {

    const [index, setIndex] = useState(route.params['key']);
    const [title, setTitle] = useState(route.params['title']);
    const [date, setDate] = useState(new Date(Date.now()));
    const [time, setTime] = useState(new Date(Date.now()));
    // const [shouldSpeak, setShouldSpeak] = useState(route.params['shouldSpeak']);
    // const [message, setMessage] = useState(route.params['message']);
    const [repeat, setRepeat] = useState(route.params['repeat']);
    const [minutes, setMinutes] = useState(route.params['minutes']);

    const frequencies = ['Never', 'Hourly', 'Daily', 'Weekly'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const addAndReturn = async () => {
        if (title === '') {
            Alert.alert('Please enter a title.');
        }
        else if (date < new Date(Date.now())) {
            Alert.alert('Please choose a date in the future.');
        }
        // else if (shouldSpeak && message === '') {
        //     Alert.alert('Please enter a message.');
        // }
        else {
            const notifID = await createTriggerNotification(date, title);

            storage.load({
                key: 'completedTasks',
            })
                .then(ret => {
                    ret.splice(index, 1);
                    storage.save({
                        key: 'completedTasks',
                        data: ret
                    })
                })
                .catch(err => {
                    console.warn(err.message);
                });

            storage.load({
                key: 'reminders',
            })
                .then(ret => {
                    ret.push({
                        'title': title,
                        'date': date,
                        'notifID': notifID,
                        // 'shouldSpeak': shouldSpeak,
                        // 'message': message,
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
            navigation.navigate('Home', { screen: 'My Reminders' });
        }
    }

    const deleteAndReturn = () => {
        storage.load({
            key: 'completedTasks',
        })
            .then(ret => {
                ret.splice(index, 1);
                storage.save({
                    key: 'completedTasks',
                    data: ret
                })
            })
            .catch(err => {
                console.warn(err.message);
            });
        navigation.navigate('Home', { screen: 'MyReminders' });
    }

    const onChangeDate = (event, selectedDate) => {
        setDate(selectedDate);
        date.setHours(time.getHours(), time.getMinutes(), 0);
    };

    const onChangeTime = (event, selectedTime) => {
        setTime(selectedTime);
        date.setHours(time.getHours(), time.getMinutes(), 0);
    };

    // const onChangeShouldSpeak = () => {
    //     setShouldSpeak(previousState => !previousState);
    // };


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
                        defaultValue={repeat}
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
                {shouldSpeak &&
                    <TextInput
                        placeholder='Enter message to be spoken...'
                        placeholderTextColor={'lightgray'}
                        value={message}
                        onChangeText={(m) => setMessage(m)}
                        style={styles.smallTextInput}
                    />} */}
                <View style={styles.buttonContainer}>
                    <TouchableOpacity
                        style={styles.shortButton}
                        onPress={addAndReturn}
                    >
                        <MaterialCommunityIcons name={'plus'} size={40} style={{ alignSelf: 'center' }} color='black' />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.shortButton}
                        onPress={deleteAndReturn}
                    >
                        <MaterialCommunityIcons name={'trash-can-outline'} size={40} style={{ alignSelf: 'center' }} color='black' />
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );

};

export default ViewCompletedTask;