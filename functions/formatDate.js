const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export const formatDate = (date) => {
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
    let AMPM = date.getHours() < 12 ? 'AM' : 'PM';
    let hours = date.getHours() % 12 === 0 ? '12' : String(date.getHours() % 12);
    let minutes = date.getMinutes() < 10 ? '0' + String(date.getMinutes()) : String(date.getMinutes());
    formattedDate += ', ' + hours + ':' + minutes + ' ' + AMPM;
    return formattedDate;
  }