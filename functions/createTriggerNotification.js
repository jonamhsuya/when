import notifee, { TriggerType, RepeatFrequency } from '@notifee/react-native';
import { formatDate } from "./formatDate";

export const createTriggerNotification = async (date, title, repeat) => {
    await notifee.requestPermission();
    const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime(),
        repeatFrequency: repeat === 'Never' ? RepeatFrequency.NONE :
                            repeat === 'Hourly' ? RepeatFrequency.HOURLY :
                            repeat === 'Daily' ? RepeatFrequency.DAILY :
                            repeat === 'Weekly' ? RepeatFrequency.WEEKLY :
                            RepeatFrequency.NONE
    };
    const id = await notifee.createTriggerNotification(
        {
            title: title,
            body: repeat === 'Never' ? formatDate(date) : '',
            ios: {
                // categoryId: 'reminder',
                sound: 'default'
            }
        },
        trigger,
    );
    return id;
}