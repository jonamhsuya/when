import { useState } from 'react';
import { Text, TouchableOpacity, View, ScrollView, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

import styles from '../styles/styles';
import storage from '../storage/storage';

const MyReminders = ({ navigation }) => {

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
            } else if (now.getDate() === date.getDate() - 1) {
                formattedDate = 'Tomorrow';
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

    const formatRepeat = (repeat, minutes) => {
        if (repeat !== 'By the Minute') {
            return repeat;
        } else {
            return 'Every ' + (minutes === '1' ? 'Minute' : minutes + ' Minutes');
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
                console.warn(err.message);
            });
    });

    const reminders = data.map((item, index) => {
        return (
            <View key={index} style={styles.reminder}>
                <View>
                    <Text style={styles.reminderText}>{item['title']}</Text>
                    <Text style={styles.reminderDate}>{formatDate(item['date'])}  |  {formatTime(item['date'])}  |  {formatRepeat(item['repeat'], item['minutes'])}</Text>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ViewReminder', {
                        key: index,
                        title: item['title'],
                        date: item['date'],
                        notifID: item['notifID'],
                        shouldSpeak: item['shouldSpeak'],
                        message: item['message'],
                        repeat: item['repeat'],
                        minutes: item['minutes']
                    })}
                >
                    <MaterialCommunityIcons name={'lead-pencil'} size={25} />
                </TouchableOpacity>
            </View>
        )
    });

    const noReminders = <Text style={styles.noReminders}>No reminders. Create a new one!</Text>

    return (
        <SafeAreaView>
            {reminders.length === 0 ? noReminders :
                <ScrollView style={styles.reminderView} scrollEnabled={data.length * 50 > Dimensions.get('window').height - 400}>
                    {reminders}
                </ScrollView>}
            <TouchableOpacity
                style={styles.longButton}
                onPress={() => { navigation.navigate('CreateNewReminder') }}
            >
                <MaterialCommunityIcons name={'playlist-plus'} size={40} style={{ alignSelf: 'center' }} color='black' />
                {/* <Text style={{ fontSize: 36, textAlign: 'center' }}>+</Text> */}
            </TouchableOpacity>
        </SafeAreaView>
    );

};

export default MyReminders;