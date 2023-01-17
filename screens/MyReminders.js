import React, { useState } from 'react';
import { Text, TouchableOpacity, View, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import styles from '../styles/styles';
import storage from '../storage/storage';
import { cancelNotification } from '../functions/cancelNotification';

const MyReminders = ({ navigation }) => {

    const [data, setData] = useState([]);
    const [count, setCount] = useState(0);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const formatDate = (date, repeat, i) => {
        let now = new Date(Date.now());
        let formattedDate = months[date.getMonth()] + ' ' + date.getDate()
        if (date < now) {

            storage.load({
                key: 'reminders',
            })
                .then(ret => {
                    if (repeat !== 'Never') {
                        if (repeat === 'Hourly') {
                            date.setHours(date.getHours() + 1);
                        } else if (repeat === 'Daily') {
                            date.setDate(date.getDate() + 1);
                        } else if (repeat === 'Weekly') {
                            date.setDate(date.getDate() + 7);
                        }
                        ret[i]['date'] = date;
                        storage.save({
                            key: 'reminders',
                            data: ret,
                            expires: null
                        });
                    } else {
                        let temp = ret[i];
                        ret.splice(i, 1);
                        storage.save({
                            key: 'reminders',
                            data: ret,
                            expires: null
                        })
                        storage.load({
                            key: 'completedTasks',
                        })
                            .then(ret => {
                                ret.unshift(temp);
                                storage.save({
                                    key: 'completedTasks',
                                    data: ret,
                                    expires: null
                                })
                            })
                            .catch(err => {
                                console.log(err.message);
                            });
                    }
                    setCount((c) => c + 1);
                })
                .catch(err => {
                    console.log(err);
                })
        }
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
        formattedDate += '  |  ' + hours + ':' + minutes + ' ' + AMPM;
        return formattedDate;
    }

    const formatRepeat = (repeat, minutes) => {
        if (repeat === 'Never') {
            return '';
        } else if (repeat !== 'By the Minute') {
            return '  |  ' + repeat;
        } else {
            return '  |  Every ' + (minutes === '1' ? 'Minute' : minutes + ' Minutes');
        }
    }

    useFocusEffect(() => {
        storage.load({
            key: 'reminders',
        })
            .then(ret => {
                setData(ret);
            })
            .catch(err => {
                console.log(err.message);
            })
    })

    const noReminders = <Text style={styles.noReminders}>No reminders. Create a new one!</Text>

    return (
        <SafeAreaView>
            {data.length === 0 ? noReminders :
                <ScrollView style={styles.reminderView} scrollEnabled={data.length * 65 > Dimensions.get('window').height - 400}>
                    {data.map((item, index) => (
                        <View key={index} style={styles.reminder}>
                            <View style={{ width: 300 }}>
                                <Text style={styles.reminderText}>{item['title']}</Text>
                                <Text style={styles.reminderDate}>{formatDate(new Date(item['date']), item['repeat'], index)}{formatRepeat(item['repeat'], item['minutes'])}</Text>
                            </View>
                            {/* <TouchableOpacity
                                style={{ marginRight: 22 }}
                                onPress={() => {
                                    storage.load({
                                        key: 'reminders',
                                    })
                                        .then(ret => {
                                            try {
                                                cancelNotification(ret[index]['notifID']);
                                            } catch (err) {
                                                console.log(err);
                                            }
                                            let temp = ret[index];
                                            ret.splice(index, 1);
                                            storage.save({
                                                key: 'reminders',
                                                data: ret,
                                                expires: null
                                            })
                                            storage.load({
                                                key: 'completedTasks',
                                            })
                                                .then(ret => {
                                                    ret.unshift(temp);
                                                    storage.save({
                                                        key: 'completedTasks',
                                                        data: ret,
                                                        expires: null
                                                    })
                                                })
                                                .catch(err => {
                                                    console.log(err.message);
                                                });
                                            setData(ret);
                                        })
                                        .catch(err => {
                                            console.log(err.message);
                                        });
                                    setCount((c) => c + 1);
                                }}
                            >
                                <MaterialCommunityIcons name='check-bold' size={25} />
                            </TouchableOpacity> */}
                            <TouchableOpacity
                                onPress={() => navigation.navigate('ViewReminder', {
                                    key: index,
                                    title: item['title'],
                                    date: item['date'],
                                    notifID: item['notifID'],
                                    // shouldSpeak: item['shouldSpeak'],
                                    // message: item['message'],
                                    repeat: item['repeat'],
                                    minutes: item['minutes']
                                })}
                            >
                                <MaterialCommunityIcons name={'lead-pencil'} size={25} />
                            </TouchableOpacity>
                        </View>
                    ))}
                </ScrollView>}
            <TouchableOpacity
                style={styles.longButton}
                onPress={() => { navigation.navigate('CreateNewReminder') }}
            >
                <MaterialCommunityIcons name={'playlist-plus'} size={40} style={{ alignSelf: 'center' }} color='black' />
            </TouchableOpacity>
        </SafeAreaView>
    );

};

export default MyReminders;