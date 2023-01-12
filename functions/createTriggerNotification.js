import notifee, { TriggerType } from '@notifee/react-native';
import { formatDate } from "./formatDate";

export const createTriggerNotification = async (date, title) => {
    await notifee.requestPermission();
    const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: date.getTime()
    };
    const id = await notifee.createTriggerNotification(
        {
            title: title,
            body: formatDate(date),
            ios: {
                categoryId: 'reminder',
                sound: 'default'
            }
        },
        trigger,
    );
    return id;
}