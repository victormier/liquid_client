const monthNamesShort = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthNamesLong = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

export const dateFromSeconds = (seconds) => {
  const date = new Date(0);
  date.setUTCSeconds(seconds);
  return date;
};

export const monthNameLongFromNumber = month => monthNamesLong[month];
export const monthNameShortFromNumber = month => monthNamesShort[month];

export default {
  dateFromSeconds,
};
