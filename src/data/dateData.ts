export const days = Array.from(
  { length: 31 },
  (_, i) => String(i + 1).padStart(2, "0")
);

export const months = [
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

export const years = Array.from(
  { length: 80 },
  (_, i) => String(2026 - 80 + i)
);