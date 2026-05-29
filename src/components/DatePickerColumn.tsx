import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { COLORS } from "../constants/colors";

interface Props {
  values: string[];
  selectedIndex: number;
}

export default function DatePickerColumn({
  values,
  selectedIndex,
}: Props) {
  return (
    <View style={styles.container}>
      {values.map((item, index) => (
        <Text
          key={`${item}-${index}`}
          style={[
            styles.item,
            index === selectedIndex && styles.selectedItem,
          ]}
        >
          {item}
        </Text>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },

  item: {
    fontSize: 24,
    color: COLORS.textInactive,
    marginVertical: 8,
  },

  selectedItem: {
    fontSize: 30,
    fontWeight: "700",
    color: COLORS.textPrimary,
  },
});