import { useEffect, useMemo, useState } from "react";

import { MONTH_OPTIONS } from "../data/dateData";
import {
  buildDayOptions,
  buildYearOptions,
  clamp,
  DEFAULT_START_YEAR,
} from "../utils/dateUtils";

interface UseDateOfBirthPickerResult {
  dayOptions: string[];
  monthOptions: string[];
  yearOptions: string[];
  selectedDayIndex: number;
  selectedMonthIndex: number;
  selectedYearIndex: number;
  selectedDate: Date;
  setSelectedDayIndex: (index: number) => void;
  setSelectedMonthIndex: (index: number) => void;
  setSelectedYearIndex: (index: number) => void;
}

const DEFAULT_DATE = {
  day: 25,
  monthIndex: 8,
  year: 1996,
};

export function useDateOfBirthPicker(): UseDateOfBirthPickerResult {
  const yearOptions = useMemo(
    () => buildYearOptions(DEFAULT_START_YEAR, new Date().getFullYear()),
    [],
  );

  const resolvedYear = yearOptions.includes(String(DEFAULT_DATE.year))
    ? DEFAULT_DATE.year
    : Number(yearOptions[Math.floor(yearOptions.length / 2)]);

  const [selectedYear, setSelectedYear] = useState<number>(resolvedYear);
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(
    DEFAULT_DATE.monthIndex,
  );
  const [selectedDay, setSelectedDay] = useState<number>(DEFAULT_DATE.day);

  const dayOptions = useMemo(
    () => buildDayOptions(selectedMonthIndex, selectedYear),
    [selectedMonthIndex, selectedYear],
  );

  useEffect(() => {
    const maxDay = dayOptions.length;

    if (selectedDay > maxDay) {
      setSelectedDay(maxDay);
    }
  }, [dayOptions.length, selectedDay]);

  const selectedYearIndex = useMemo(() => {
    return Math.max(yearOptions.indexOf(String(selectedYear)), 0);
  }, [selectedYear, yearOptions]);

  const selectedDayIndex = clamp(selectedDay - 1, 0, dayOptions.length - 1);

  const selectedDate = useMemo(() => {
    return new Date(selectedYear, selectedMonthIndex, selectedDay);
  }, [selectedYear, selectedMonthIndex, selectedDay]);

  return {
    dayOptions,
    monthOptions: MONTH_OPTIONS,
    yearOptions,
    selectedDayIndex,
    selectedMonthIndex,
    selectedYearIndex,
    selectedDate,
    setSelectedDayIndex: (index: number) => {
      const nextIndex = clamp(index, 0, dayOptions.length - 1);
      setSelectedDay(nextIndex + 1);
    },
    setSelectedMonthIndex: (index: number) => {
      const nextIndex = clamp(index, 0, MONTH_OPTIONS.length - 1);
      setSelectedMonthIndex(nextIndex);
    },
    setSelectedYearIndex: (index: number) => {
      const nextIndex = clamp(index, 0, yearOptions.length - 1);
      setSelectedYear(Number(yearOptions[nextIndex]));
    },
  };
}
