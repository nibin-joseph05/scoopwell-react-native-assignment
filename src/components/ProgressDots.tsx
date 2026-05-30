import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { COLORS } from "../constants/colors";

interface ProgressDotsProps {
  currentStep?: number;
  totalSteps?: number;
  style?: StyleProp<ViewStyle>;
}

export default function ProgressDots({
  currentStep = 1,
  totalSteps = 5,
  style,
}: ProgressDotsProps) {
  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

  return (
    <View style={[styles.container, style]}>
      {steps.map((step) => (
        <View
          key={step}
          style={[
            styles.dot,
            step === currentStep ? styles.activeDot : styles.inactiveDot,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 3,
  },
  activeDot: {
    backgroundColor: COLORS.dotActive,
  },
  inactiveDot: {
    backgroundColor: COLORS.dotInactive,
  },
});
