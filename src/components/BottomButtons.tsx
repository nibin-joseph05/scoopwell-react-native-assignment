import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

export default function BottomButtons() {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.previousButton}>
        <Text style={styles.previousText}>Previous</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.nextButton}>
        <Text style={styles.nextText}>Next</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },

  previousButton: {
    width: "46%",
    height: 56,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
  },

  nextButton: {
    width: "46%",
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  previousText: {
    fontSize: 18,
    fontWeight: "500",
  },

  nextText: {
    fontSize: 18,
    fontWeight: "600",
  },
});