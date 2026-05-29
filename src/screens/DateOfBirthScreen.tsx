import { SafeAreaView, Text, View, StyleSheet } from "react-native";

import ProgressDots from "../components/ProgressDots";
import BottomButtons from "../components/BottomButtons";
import DatePickerColumn from "../components/DatePickerColumn";

import { days, months, years } from "../data/dateData";
import { globalStyles } from "../styles/globalStyles";

export default function DateOfBirthScreen() {
  return (
    <SafeAreaView style={globalStyles.screenContainer}>
      <ProgressDots />

      <Text style={styles.title}>
        Choose your date of birth
      </Text>

      <Text style={styles.subtitle}>
        Tell us your current age to personalize your plan.
      </Text>

      <View style={styles.pickerContainer}>
        <DatePickerColumn
          values={days.slice(20, 27)}
          selectedIndex={3}
        />

        <DatePickerColumn
          values={months.slice(5, 12)}
          selectedIndex={3}
        />

        <DatePickerColumn
          values={years.slice(43, 50)}
          selectedIndex={3}
        />
      </View>

      <BottomButtons />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 24,
    fontWeight: "600",
  },

  subtitle: {
    fontSize: 16,
    color: "#777",
    marginTop: 10,
  },

  pickerContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },
});