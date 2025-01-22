const months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
export function getDateTime(timeStamp: string) {
  const now = new Date();
  const date = new Date(timeStamp);

  // Get time difference in milliseconds
  const diff = now.getTime() - date.getTime();

  // Convert to seconds
  const seconds = Math.floor(diff / 1000);

  // Convert to minutes
  const minutes = Math.floor(seconds / 60);

  // Convert to hours
  const hours = Math.floor(minutes / 60);

  // Convert to days
  const days = Math.floor(hours / 24);
  const years = now.getFullYear() - date.getFullYear();
  console.log(date.getFullYear());

  // Return appropriate time format
  if (seconds < 60) {
    return { type: "seconds", value: seconds };
  } else if (minutes < 60) {
    return { type: "minutes", value: minutes };
  } else if (hours < 24) {
    return { type: "hours", value: hours };
  } else if (days < 7) {
    return { type: "days", value: days };
  } else if (years == 0) {
    return {
      type: "month",
      value: `${months[date.getMonth()]} ${date.getDate()}`,
    };
  } else {
    return {
      type: "date",
      value: `${
        months[date.getMonth()]
      } ${date.getDate()},${date.getFullYear()}`,
    };
  }
}

// Example usage:
export const formatTimeAgo = (timeData: {
  type: string;
  value: number | string;
}) => {
  if (timeData.type === "date") {
    return timeData.value;
  }
  if (timeData.type === "month") {
    return timeData.value;
  }

  return `${timeData.value}${timeData.type[0]}`;
};

// // Example:
// const timestamp = "2025-01-02T12:19:32.817Z";
// const timeAgo = getDateTime(timestamp);
// console.log(formatTimeAgo(timeAgo)); // "X minutes ago" or "Y hours ago" etc.
