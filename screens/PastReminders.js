import { useState } from 'react';
import { Text, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';

import styles from '../styles/styles';
import storage from '../storage/storage';

const PastReminders = ({ navigation }) => {

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
            key: 'pastReminders',
        })
            .then(ret => {
                setData(ret);
            })
            .catch(err => {
                console.warn(err.message);
            });
    });

    const pastReminders = data.map((item, index) => {
        return (
            <TouchableOpacity
                key={index}
                style={styles.reminder}
                onPress={() => navigation.navigate('ViewPastReminder', {
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

    const noPastReminders = <Text style={styles.noReminders}>No past reminders yet.</Text>

    return (
        <SafeAreaView>
            {pastReminders.length === 0 ? noPastReminders : 
            <ScrollView style={styles.reminderView}>
                {pastReminders}
            </ScrollView>}
        </SafeAreaView>
    );

};

export default PastReminders;