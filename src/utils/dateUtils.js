
export function getDatesBetween(startDate, endDate) {
  let dates = [];
  let currentDate = new Date(startDate);
  let dayIndex = 1;

  while (currentDate <= new Date(endDate)) {
    let formattedDate = currentDate.toISOString().split("T")[0];
    dates.push({
      value: formattedDate,
      label: `Day ${dayIndex++}`,
    });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}

export function formatDateTime(dateString) {
  if (!dateString) return "N/A";

  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  }).format(date);
}

export function convertDaysToReadableFormat(days) {
  let integerDays = Math.floor(days);
  let hours = Math.round((days - integerDays) * 24);
  let result = "";
  if (integerDays > 0) {
    result += `${integerDays} day${integerDays !== 1 ? "s" : ""}`;
  }
  if (hours > 0) {
    if (result) result += " and ";
    result += `${hours} hour${hours !== 1 ? "s" : ""}`;
  }
  return result || "0 hours";
}
