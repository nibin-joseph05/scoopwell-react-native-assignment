import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  NativeScrollEvent,
  NativeSyntheticEvent,
  Platform,
  ScrollView,
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
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

import { COLORS } from "../constants/colors";
import { TYPOGRAPHY } from "../constants/typography";
import { clamp } from "../utils/dateUtils";

interface PickerItemProps {
  item: string;
  index: number;
  itemHeight: number;
  selectedIndex: number;
  scrollY: SharedValue<number>;
}

const MemoizedPickerItem = React.memo(function PickerItem({
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
});

interface DatePickerColumnProps {
  items: string[];
  selectedIndex: number;
  onChange: (index: number) => void;
  accessibilityLabel: string;
  columnStyle?: StyleProp<ViewStyle>;
  itemHeight?: number;
  visibleItemCount?: number;
}

const AnimatedScrollView = Animated.createAnimatedComponent(ScrollView);

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

  const scrollRef = useRef<ScrollView | null>(null);
  const scrollY = useSharedValue(selectedIndex * itemHeight);

  const isDragging = useRef(false);
  const prevItemCount = useRef(items.length);
  const isInitialMount = useRef(true);
  const isInternalChange = useRef(false);

  const contentContainerStyle = useMemo(
    () => ({
      paddingVertical: edgePadding,
    }),
    [edgePadding],
  );

  const resolveIndexFromOffset = useCallback(
    (offsetY: number) =>
      clamp(Math.round(offsetY / itemHeight), 0, items.length - 1),
    [itemHeight, items.length],
  );

  const scrollHandler = useAnimatedScrollHandler({
    onScroll: (event) => {
      scrollY.value = event.contentOffset.y;
    },
  });

  const settleToNearestIndex = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      isDragging.current = false;

      const offsetY = event.nativeEvent.contentOffset.y;
      const nextIndex = resolveIndexFromOffset(offsetY);

      isInternalChange.current = true;
      onChange(nextIndex);
    },
    [onChange, resolveIndexFromOffset],
  );

  const handleScrollEndDrag = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      isDragging.current = false;

      const velocity = event.nativeEvent.velocity?.y ?? 0;
      if (Math.abs(velocity) < 0.05) {
        const offsetY = event.nativeEvent.contentOffset.y;
        const nextIndex = resolveIndexFromOffset(offsetY);
        const snapOffset = nextIndex * itemHeight;

        isInternalChange.current = true;
        onChange(nextIndex);

        scrollRef.current?.scrollTo({ y: snapOffset, animated: true });
      }
    },
    [itemHeight, onChange, resolveIndexFromOffset],
  );

  const handleScrollBeginDrag = useCallback(() => {
    isDragging.current = true;
  }, []);

  useEffect(() => {
    const targetOffset = selectedIndex * itemHeight;
    const itemCountChanged = prevItemCount.current !== items.length;
    prevItemCount.current = items.length;

    scrollY.value = targetOffset;

    if (isDragging.current) return;

    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }

    if (isInitialMount.current) {
      isInitialMount.current = false;
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({ y: targetOffset, animated: false });
      });
      return;
    }

    const timer = setTimeout(
      () => {
        scrollRef.current?.scrollTo({
          y: targetOffset,
          animated: itemCountChanged,
        });
      },
      itemCountChanged ? 50 : 0,
    );

    return () => clearTimeout(timer);
  }, [itemHeight, scrollY, selectedIndex, items.length]);

  const renderedItems = useMemo(
    () =>
      items.map((item, index) => (
        <MemoizedPickerItem
          key={`${item}-${index}`}
          item={item}
          index={index}
          itemHeight={itemHeight}
          selectedIndex={selectedIndex}
          scrollY={scrollY}
        />
      )),
    [items, itemHeight, selectedIndex, scrollY],
  );

  return (
    <View style={[styles.container, { height: pickerHeight }, columnStyle]}>
      <AnimatedScrollView
        ref={scrollRef}
        accessibilityLabel={accessibilityLabel}
        style={{ height: pickerHeight }}
        contentContainerStyle={contentContainerStyle}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        scrollsToTop={false}
        decelerationRate={Platform.OS === "ios" ? 0.993 : 0.988}
        snapToInterval={itemHeight}
        snapToAlignment="start"
        onScrollBeginDrag={handleScrollBeginDrag}
        onScroll={scrollHandler}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={settleToNearestIndex}
        scrollEventThrottle={1}
        nestedScrollEnabled
      >
        {renderedItems}
      </AnimatedScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
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
