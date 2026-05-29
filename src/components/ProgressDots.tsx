import { View } from "react-native";
import { COLORS } from "../constants/colors";

export default function ProgressDots() {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 8,
        marginBottom: 28,
      }}
    >
      {[0, 1, 2, 3, 4].map((dot) => (
        <View
          key={dot}
          style={{
            width: 5,
            height: 5,
            borderRadius: 2.5,
            marginHorizontal: 2.5,
            backgroundColor:
              dot === 0
                ? COLORS.dotActive
                : COLORS.dotInactive,
          }}
        />
      ))}
    </View>
  );
}