import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  FlatList,
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  type SharedValue,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { COLORS } from "../constants/colors";
import { TYPOGRAPHY } from "../constants/typography";
import { clamp } from "../utils/dateUtils";

interface DatePickerColumnProps {
  items: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  accessibilityLabel: string;
  columnStyle?: StyleProp<ViewStyle>;
  itemHeight?: number;
  visibleItemCount?: number;
}

interface PickerItemProps {
  item: string;
  index: number;
  itemHeight: number;
  selectedIndex: number;
  scrollY: SharedValue<number>;
}

function PickerItem({
  item,
  index,
  itemHeight,
  selectedIndex,
  scrollY,
}: PickerItemProps) {
  const animatedTextStyle = useAnimatedStyle(() => {
    const distanceFromCenter = Math.abs(scrollY.value / itemHeight - index);

    return {
      opacity: interpolate(
        distanceFromCenter,
        [0, 1, 2, 3],
        [1, 0.7, 0.36, 0.14],
        Extrapolation.CLAMP,
      ),
      color: interpolateColor(
        distanceFromCenter,
        [0, 1, 2, 3],
        [
          COLORS.textPrimary,
          "#9FA3A8",
          COLORS.textFaded,
          COLORS.textInactive,
        ],
      ),
    };
  }, [index, itemHeight, scrollY]);

  return (
    <View style={[styles.row, { height: itemHeight }]}>
      <Animated.Text
        allowFontScaling={false}
        style={[
          styles.text,
          {
            lineHeight: Math.round(itemHeight * 0.66),
            fontFamily:
              selectedIndex === index
                ? TYPOGRAPHY.mediumFamily
                : TYPOGRAPHY.regularFamily,
            fontWeight: selectedIndex === index ? "600" : "400",
          },
          animatedTextStyle,
        ]}
      >
        {item}
      </Animated.Text>
    </View>
  );
}

export default function DatePickerColumn({
  items,
  selectedIndex,
  onChange,
  accessibilityLabel,
  columnStyle,
  itemHeight = 58,
  visibleItemCount = 7,
}: DatePickerColumnProps) {
  const pickerHeight = itemHeight * visibleItemCount;
  const edgePadding = (pickerHeight - itemHeight) / 2;

  const listRef = useRef<FlatList<string> | null>(null);
  const scrollY = useSharedValue(selectedIndex * itemHeight);

  const contentContainerStyle = useMemo(
    () => ({
      paddingVertical: edgePadding,
    }),
    [edgePadding],
  );

  const keyExtractor = useCallback((item: string, index: number) => `${item}-${index}`, []);

  const getItemLayout = useCallback(
    (_: ArrayLike<string> | null | undefined, index: number) => ({
      index,
      length: itemHeight,
      offset: itemHeight * index,
    }),
    [itemHeight],
  );

  const resolveIndexFromOffset = useCallback(
    (offsetY: number) =>
      clamp(Math.floor((offsetY + itemHeight / 2) / itemHeight), 0, items.length - 1),
    [itemHeight, items.length],
  );

  const settleToNearestIndex = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const nextIndex = resolveIndexFromOffset(offsetY);

      onChange(nextIndex);

      listRef.current?.scrollToOffset({
        offset: nextIndex * itemHeight,
        animated: true,
      });
    },
    [itemHeight, onChange, resolveIndexFromOffset],
  );

  const handleScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      scrollY.value = event.nativeEvent.contentOffset.y;
    },
    [scrollY],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => (
      <PickerItem
        item={item}
        index={index}
        itemHeight={itemHeight}
        selectedIndex={selectedIndex}
        scrollY={scrollY}
      />
    ),
    [itemHeight, scrollY, selectedIndex],
  );

  useEffect(() => {
    const targetOffset = selectedIndex * itemHeight;
    scrollY.value = targetOffset;

    listRef.current?.scrollToOffset({
      offset: targetOffset,
      animated: false,
    });
  }, [itemHeight, scrollY, selectedIndex]);

  return (
    <View style={[styles.container, { height: pickerHeight }, columnStyle]}>
      <Animated.FlatList
        ref={listRef}
        accessibilityLabel={accessibilityLabel}
        data={items}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        style={{ height: pickerHeight }}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        removeClippedSubviews={Platform.OS === "android"}
        initialNumToRender={9}
        maxToRenderPerBatch={9}
        windowSize={7}
        getItemLayout={getItemLayout}
        decelerationRate={Platform.OS === "ios" ? "fast" : 0.985}
        snapToInterval={itemHeight}
        snapToAlignment="start"
        onScroll={handleScroll}
        onMomentumScrollEnd={settleToNearestIndex}
        scrollEventThrottle={16}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  row: {
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: TYPOGRAPHY.pickerSize,
    letterSpacing: 0.15,
    includeFontPadding: false,
    textAlignVertical: "center",
    fontVariant: ["tabular-nums"],
  },
});
