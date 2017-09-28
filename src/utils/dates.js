export const dateFromSeconds = (seconds) => {
  const date = new Date(0);
  date.setUTCSeconds(seconds);
  return date;
};

export default {
  dateFromSeconds,
};
