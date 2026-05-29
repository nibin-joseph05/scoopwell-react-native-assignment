export const DEFAULT_START_YEAR = 1900;

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function isLeapYear(year: number): boolean {
  if (year % 400 === 0) {
    return true;
  }

  if (year % 100 === 0) {
    return false;
  }

  return year % 4 === 0;
}

export function getDaysInMonth(monthIndex: number, year: number): number {
  if (monthIndex === 1) {
    return isLeapYear(year) ? 29 : 28;
  }

  return new Date(year, monthIndex + 1, 0).getDate();
}

export function buildDayOptions(monthIndex: number, year: number): string[] {
  const days = getDaysInMonth(monthIndex, year);

  return Array.from({ length: days }, (_, index) =>
    String(index + 1).padStart(2, "0"),
  );
}

export function buildYearOptions(
  startYear = DEFAULT_START_YEAR,
  endYear = new Date().getFullYear(),
): string[] {
  const count = Math.max(endYear - startYear + 1, 1);

  return Array.from({ length: count }, (_, index) => String(startYear + index));
}
