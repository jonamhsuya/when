import { StyleSheet, Dimensions } from 'react-native';

const styles = StyleSheet.create({

  header: {
    textAlign: 'center',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 20,

  },

  reminderView: {
    margin: 20,
    width: Dimensions.get('window').width - 40,
    height: Dimensions.get('window').height - 400,
  },

  buttonContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },

  shortButton: {
    alignSelf: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    margin: 15,
    marginTop: 50,
    padding: 10,
    width: 125,
    borderRadius: 20,
    shadowOpacity: 1.0,
    shadowRadius: 2.5,
    shadowOffset: { width: 0, height: 0 },
  },

  longButton: {
    alignSelf: 'center',
    backgroundColor: 'white',
    margin: 15,
    marginTop: 50,
    padding: 10,
    width: 300,
    borderRadius: 20,
    shadowOpacity: 1.0,
    shadowRadius: 2.5,
    shadowOffset: { width: 0, height: 0 },
  },

  audioButton: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignSelf: 'center',
    backgroundColor: 'white',
    margin: 15,
    padding: 10,
    width: 125,
    borderRadius: 10,
    shadowOpacity: 1.0,
    shadowRadius: 2.5,
    shadowOffset: { width: 0, height: 0 },
  },

  reminder: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    padding: 10,
    margin: 5,
    width: Dimensions.get('window').width - 40,
    height: 60,
    shadowOffset: { width: 0, height: 0 },
    backgroundColor: 'lemonchiffon',
  },

  reminderText: {
    fontWeight: 'bold',
    fontSize: 16,
  },

  reminderDate: {
    fontWeight: 'bold',
    fontSize: 12,
  },

  overdueReminder: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignSelf: 'center',
    borderWidth: 1,
    padding: 10,
    margin: 5,
    width: Dimensions.get('window').width - 40,
    height: 60,
    shadowOffset: { width: 0, height: 0 },
    backgroundColor: 'lightpink',
  },

  textInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    marginHorizontal: 25,
    height: 50,
  },

  smallTextInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white',
    fontSize: 16,
    margin: 10,
    marginHorizontal: 25,
    height: 50,
  },

  minuteTextInput: {
    borderColor: 'black',
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    backgroundColor: 'white',
    fontSize: 16,
    margin: 10,
    marginHorizontal: 25,
    width: 50,
    height: 35,
  },

  createReminderGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 25,
  },

  minutesGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginHorizontal: 50,
  },

  box: {
    width: 100,
  },

  filledBox: {
    width: 100,
    backgroundColor: 'black',
    borderWidth: 1,
    borderRadius: 7.5,
  },

  boxText: {
    fontWeight: 'bold',
    fontSize: 18,
    padding: 5,
    marginRight: 20,
    color: 'white',
    textAlign: 'center',
    width: 100,
  },

  text: {
    fontWeight: 'bold',
    fontSize: 18,
    padding: 5,
    marginRight: 20,
    color: 'black',
  },

  smallText: {
    fontSize: 14,
    padding: 5,
    marginRight: 20,
    color: 'black',
  },

  picker: {
    alignSelf: 'flex-end',
    marginHorizontal: 20,
    marginVertical: 10,
    width: Dimensions.get('window').width - 170,
  },

  noReminders: {
    textAlign: 'center',
    fontStyle: 'italic',
  },

  line: {
    borderBottomColor: "black",
    borderBottomWidth: 1,
    margin: 20,
  },

  buffer: {
    width: Dimensions.get('window').width - 170 - 52.5,
  },

  pickerBuffer: {
    width: Dimensions.get('window').width - 170 - 210,
  },

  scrollView: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },

});

export default styles;