import React, { useState } from 'react';
import { Text, TouchableOpacity, View, ScrollView, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import styles from '../styles/styles';
import storage from '../storage/storage';

const CompletedTasks = ({ navigation }) => {

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

    const deleteAll = () => {
        storage.load({
            key: 'completedTasks',
        })
            .then(ret => {
                storage.save({
                    key: 'completedTasks',
                    data: [],
                    expires: null
                })
                setData([]);
            })
            .catch(err => {
                console.log(err.message);
            });
    }

    useFocusEffect(
        React.useCallback(() => {
            storage.load({
                key: 'completedTasks',
            })
                .then(ret => {
                    setData(ret);
                })
                .catch(err => {
                    console.log(err.message);
                });
        }, [data])
    )

    const noCompletedTasks = <Text style={styles.noReminders}>No completed tasks.</Text>

    return (
        <SafeAreaView>
            {data.length === 0 ? noCompletedTasks :
                <ScrollView style={styles.reminderView} scrollEnabled={data.length * 65 > Dimensions.get('window').height - 400}>
                    {data.map((item, index) => {
                        return (
                            <View key={index} style={styles.reminder}>
                                <View>
                                    <Text style={styles.reminderText}>{item['title']}</Text>
                                    <Text style={styles.reminderDate}>{formatDate(item['date'])}  |  {formatTime(item['date'])}</Text>
                                </View>
                                <TouchableOpacity
                                    style={{marginLeft: 195}}
                                    onPress={() => navigation.navigate('ViewCompletedTask', {
                                        key: index,
                                        title: item['title'],
                                        // shouldSpeak: item['shouldSpeak'],
                                        // message: item['message'],
                                        repeat: item['repeat'],
                                        minutes: item['minutes']
                                    })}
                                >
                                    <MaterialCommunityIcons name={'lead-pencil'} size={25} />
                                </TouchableOpacity>
                            </View>
                        )
                    })}
                </ScrollView>}
            {data.length > 0 &&
                <TouchableOpacity
                    style={styles.longButton}
                    onPress={() => {
                        Alert.alert(
                            'Are you sure you want to clear all completed tasks?',
                            '',
                            [
                                { text: 'Cancel', style: 'cancel' },
                                { text: 'OK', onPress: deleteAll }
                            ]
                        )
                    }}
                >
                    <MaterialCommunityIcons name={'trash-can-outline'} size={40} style={{ alignSelf: 'center' }} color='black' />
                    {/* <Text style={{ fontSize: 36, textAlign: 'center' }}>+</Text> */}
                </TouchableOpacity>}
        </SafeAreaView>
    );

};

export default CompletedTasks;