/**
 * Return the day with month
 * @param  {String} date Date with ISO format.
 * @return {String}      Properly formatted day with month.
 */
export const getDayMonth = (date: string) => {
  const dataArr = new Date(date).toDateString().split(" ");
  return dataArr[2] + " " + dataArr[1];
};
