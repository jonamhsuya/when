import RNCalendarEvents from "react-native-calendar-events";
import storage from "../storage/storage";

export const createEvent = async (type, title, index, startDate, endDate, repeat="", endRepeat=null) => {
  storage
    .load({
      key: (type += "sID"),
    })
    .then((ret) => {
      RNCalendarEvents.saveEvent(title, {
        calendarId: ret,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        recurrence: repeat.toLowerCase(),
        recurrenceRule: {frequency: repeat.toLowerCase(), endDate: endRepeat !== null ? endRepeat.toISOString() : ""}
      }).then((id) => {
        const eventID = id;
        storage
          .load({
            key: "whens",
          })
          .then((ret) => {
            ret[index]["eventID"] = eventID;
          });
      });
    });
};
