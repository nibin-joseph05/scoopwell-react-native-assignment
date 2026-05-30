import React from "react";
import { StyleProp, StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";

import { COLORS } from "../constants/colors";
import { TYPOGRAPHY } from "../constants/typography";

interface BottomButtonsProps {
  onPrevious: () => void;
  onNext: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function BottomButtons({
  onPrevious,
  onNext,
  style,
}: BottomButtonsProps) {
  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onPrevious}
        style={styles.previousButton}
      >
        <Text style={styles.previousText}>Previous</Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.85}
        onPress={onNext}
        style={styles.nextButton}
      >
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  previousButton: {
    width: "48.3%",
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },

  nextButton: {
    width: "48.3%",
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  previousText: {
    fontFamily: TYPOGRAPHY.mediumFamily,
    fontSize: TYPOGRAPHY.buttonTextSize,
    lineHeight: 22,
    fontWeight: "500",
    color: COLORS.border,
  },

  nextText: {
    fontFamily: TYPOGRAPHY.mediumFamily,
    fontSize: TYPOGRAPHY.buttonTextSize,
    lineHeight: 22,
    fontWeight: "500",
    color: "#111111",
  },
});
