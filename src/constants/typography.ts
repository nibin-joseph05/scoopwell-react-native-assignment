import { Platform } from "react-native";

const IOS_FONT_FAMILY = "System";
const ANDROID_FONT_FAMILY = "sans-serif";

export const TYPOGRAPHY = {
  regularFamily: Platform.select({
    ios: IOS_FONT_FAMILY,
    android: ANDROID_FONT_FAMILY,
    default: "System",
  }),
  mediumFamily: Platform.select({
    ios: IOS_FONT_FAMILY,
    android: "sans-serif-medium",
    default: "System",
  }),
  titleSize: 28,
  subtitleSize: 15,
  pickerSize: 39,
  buttonTextSize: 18,
};
