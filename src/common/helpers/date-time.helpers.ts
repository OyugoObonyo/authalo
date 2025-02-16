export function addIntervalToDate(date: Date, interval: number): Date {
  const newDate = new Date(date);
  newDate.setUTCSeconds(date.getUTCSeconds() + interval);
  return newDate;
}
