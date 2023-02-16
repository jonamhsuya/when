import RNCalendarEvents from "react-native-calendar-events";
import storage from "../storage/storage";

export const updateEvent = async (id, type, title, startDate, endDate, repeat="", endRepeat=null) => {
  storage
    .load({
      key: (type += "sID"),
    })
    .then((ret) => {
      RNCalendarEvents.saveEvent(title, {
        id: id,
        calendarId: ret,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        recurrence: repeat.toLowerCase(),
        recurrenceRule: {frequency: repeat.toLowerCase(), endDate: endRepeat !== null ? endRepeat.toISOString() : ""}
      });
    });
};
