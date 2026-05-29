import { StyleSheet } from "react-native";

import { COLORS } from "../constants/colors";

export const globalStyles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  row: {
    flexDirection: "row",
  },

  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});
