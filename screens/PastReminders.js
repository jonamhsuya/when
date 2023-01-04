import { useState } from 'react';
import { Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from '../styles/styles';
import storage from '../storage/storage';

const PastReminders = ({ navigation }) => {

    const [data, setData] = useState([]);

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const formatDate = (dateString) => {
        let date = new Date(dateString)
        let now = new Date(Date.now());
        let formattedDate = months[date.getMonth()] + ' ' + date.getDate()
        if (now.getFullYear() !== date.getFullYear()) {
            formattedDate += ', ' + date.getFullYear();
        }
        else if (now.getMonth() === date.getMonth()) {
            if (now.getDate() === date.getDate()) {
                formattedDate = 'Today';
            } else if (now.getDate() === date.getDate() + 1) {
                formattedDate = 'Yesterday';
            }
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
            <View key={index} style={styles.reminder}>
                <View>
                    <Text style={styles.reminderText}>{item['title']}</Text>
                    <Text style={styles.reminderDate}>{formatDate(item['date'])}, {formatTime(item['date'])}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ViewPastReminder', {
                        key: index,
                        title: item['title'],
                        date: item['date'],
                        notifID: item['notifID'],
                        shouldSpeak: item['shouldSpeak'],
                        message: item['message']
                    })}
                >
                    <MaterialCommunityIcons name={'lead-pencil'} size={25} />
                </TouchableOpacity>
            </View>
        )
    });

    const noPastReminders = <Text style={styles.noReminders}>No past reminders.</Text>

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