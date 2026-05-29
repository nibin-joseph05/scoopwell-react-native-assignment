import { Alert, StyleSheet, Text, View, useWindowDimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ProgressDots from "../components/ProgressDots";
import BottomButtons from "../components/BottomButtons";
import DatePickerColumn from "../components/DatePickerColumn";

import { COLORS } from "../constants/colors";
import { SPACING } from "../constants/spacing";
import { TYPOGRAPHY } from "../constants/typography";
import { useDateOfBirthPicker } from "../hooks/useDateOfBirthPicker";
import { globalStyles } from "../styles/globalStyles";

interface DateOfBirthScreenProps {
  onPrevious?: () => void;
  onNext?: (date: Date) => void;
}

export default function DateOfBirthScreen({
  onPrevious,
  onNext,
}: DateOfBirthScreenProps = {}) {
  const { height, width } = useWindowDimensions();
  const widthRatio = width / 402;
  const heightRatio = height / 874;

  const horizontalPadding = Math.round(SPACING.screenHorizontal * widthRatio);
  const pickerItemHeight = Math.max(54, Math.min(60, Math.round(58 * heightRatio)));
  const dotsMarginTop = Math.max(8, Math.round(34 * heightRatio));
  const dotsMarginBottom = Math.max(20, Math.round(30 * heightRatio));
  const subtitleMarginTop = Math.max(6, Math.round(8 * heightRatio));
  const pickerMarginTop = Math.max(18, Math.round(24 * heightRatio));
  const buttonBottomGap = Math.max(10, Math.round(14 * heightRatio));

  const {
    dayOptions,
    monthOptions,
    yearOptions,
    selectedDayIndex,
    selectedMonthIndex,
    selectedYearIndex,
    selectedDate,
    setSelectedDayIndex,
    setSelectedMonthIndex,
    setSelectedYearIndex,
  } = useDateOfBirthPicker();

  const selectedMonth = monthOptions[selectedMonthIndex];
  const selectedDay = dayOptions[selectedDayIndex];
  const selectedYear = yearOptions[selectedYearIndex];

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
      return;
    }

    Alert.alert(
      "Going Back",
      "You can return to the previous step anytime to update your details.",
    );
  };

  const handleNext = () => {
    if (onNext) {
      onNext(selectedDate);
      return;
    }

    Alert.alert(
      "Date Confirmed!",
      `Your date of birth has been set to:\n\n${selectedDay} ${selectedMonth} ${selectedYear}\n\nYou can change this anytime from your profile.`,
    );
  };

  return (
    <SafeAreaView edges={["top", "bottom"]} style={globalStyles.screenContainer}>
      <View style={[styles.contentContainer, { paddingHorizontal: horizontalPadding }]}>
        <ProgressDots
          currentStep={1}
          totalSteps={5}
          style={{ marginTop: dotsMarginTop, marginBottom: dotsMarginBottom }}
        />

        <Text style={styles.title}>Choose your date of birth</Text>

        <Text style={[styles.subtitle, { marginTop: subtitleMarginTop }]}>
          Tell us your current age to personalize your plan.
        </Text>

        <View style={[styles.divider, { marginTop: pickerMarginTop }]} />

        <View style={[styles.pickerContainer, { marginTop: 0 }]}>
          <DatePickerColumn
            accessibilityLabel="Day picker"
            items={dayOptions}
            selectedIndex={selectedDayIndex}
            onChange={setSelectedDayIndex}
            columnStyle={styles.dayColumn}
            itemHeight={pickerItemHeight}
          />

          <DatePickerColumn
            accessibilityLabel="Month picker"
            items={monthOptions}
            selectedIndex={selectedMonthIndex}
            onChange={setSelectedMonthIndex}
            columnStyle={styles.monthColumn}
            itemHeight={pickerItemHeight}
          />

          <DatePickerColumn
            accessibilityLabel="Year picker"
            items={yearOptions}
            selectedIndex={selectedYearIndex}
            onChange={setSelectedYearIndex}
            columnStyle={styles.yearColumn}
            itemHeight={pickerItemHeight}
          />
        </View>

        <BottomButtons
          onPrevious={handlePrevious}
          onNext={handleNext}
          style={{
            marginHorizontal: Math.round(-10 * widthRatio),
            marginBottom: buttonBottomGap,
          }}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
  },

  title: {
    fontFamily: TYPOGRAPHY.mediumFamily,
    fontSize: TYPOGRAPHY.titleSize,
    lineHeight: 33,
    fontWeight: "600",
    color: "#1D1D1F",
    letterSpacing: -0.2,
  },

  subtitle: {
    fontFamily: TYPOGRAPHY.regularFamily,
    fontSize: TYPOGRAPHY.subtitleSize,
    lineHeight: 23,
    color: COLORS.textSecondary,
  },

  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: "#E8E8E8",
  },

  pickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "stretch",
    flex: 1,
  },

  dayColumn: {
    flex: 0.95,
  },

  monthColumn: {
    flex: 1.18,
    marginHorizontal: SPACING.pickerGap,
  },

  yearColumn: {
    flex: 1.17,
  },
});
