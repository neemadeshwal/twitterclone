// Function to get an array of months
function getMonths() {
  return [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
}

// Function to get an array of years from 1900 to the current year
function getYears() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let year = 1900; year <= currentYear; year++) {
    years.push(year);
  }
  return years;
}

// Function to get an array of days from 1 to 31
function getDays() {
  return Array.from({ length: 31 }, (_, i) => i + 1);
}

// Usage
export const months = getMonths();
export const years = getYears();
export const days = getDays();
