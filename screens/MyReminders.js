import { useState } from 'react';
import { Text, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import styles from '../styles/styles';
import storage from '../storage/storage';

const MyReminders = ({ navigation }) => {

    const [data, setData] = useState([]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const formatDate = (dateString) => {
        let date = new Date(dateString)
        let formattedDate = months[date.getMonth()] + ' ' + date.getDate()
        if (new Date(Date.now()).getFullYear !== date.getFullYear()) {
            formattedDate += ', ' + date.getFullYear();
        }
        return formattedDate;
    }

    const formatTime = (timeString) => {
        let time = new Date(timeString)
        let formattedTime = ''
        let AMPM = time.getHours() < 12 ? 'AM' : 'PM';
        let hours = time.getHours() % 12 === 0 ? '12' : String(time.getHours() % 12);
        let minutes = time.getMinutes() < 10 ? '0' + String(time.getMinutes()) : String(time.getMinutes());
        formattedTime += hours + ':' + minutes + ' ' + AMPM;
        return formattedTime;
    }

    useFocusEffect(() => {
        storage.load({
            key: 'reminders',
        })
            .then(ret => {
                setData(ret);
            })
            .catch(err => {
                console.warn(err.message);
            });
    });

    const reminders = data.map((item, index) => {
        return (
            <TouchableOpacity
                key={index}
                style={styles.reminder}
                onPress={() => navigation.navigate('ViewReminder', {
                    key: index,
                    title: item['title'],
                    date: item['date'],
                    notifID: item['notifID'],
                    shouldSpeak: item['shouldSpeak'],
                    message: item['message']
                })}
            >
                <>
                    <Text style={styles.reminderText}>{item['title']}</Text>
                    <Text style={styles.reminderDate}>{formatTime(item['date'])}, {formatDate(item['date'])}</Text>
                </>
            </TouchableOpacity>
        )
    });

    const noReminders = <Text style={styles.noReminders}>No reminders yet. Create a new one!</Text>

    return (
        <SafeAreaView>
            {reminders.length === 0 ? noReminders :
                <ScrollView style={styles.reminderView} scrollEnabled={data.length * 50 > Dimensions.get('window').height - 400}>
                    {reminders}
                </ScrollView>}
            <TouchableOpacity
                style={styles.topButton}
                onPress={() => {navigation.navigate('CreateNewReminder')}}
            >
                <Text style={{ fontSize: 36, textAlign: 'center' }}>+</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );

};

export default MyReminders;
