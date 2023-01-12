import notifee from '@notifee/react-native';

export const cancelNotification = async (notifID) => {
    await notifee.cancelNotification(notifID);
}