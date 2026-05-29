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
  numericOnly: boolean;
  textAlign: "center" | "flex-start";
  scrollY: SharedValue<number>;
}

const MemoizedPickerItem = React.memo(function PickerItem({
  item,
  index,
  itemHeight,
  numericOnly,
  textAlign,
  scrollY,
}: PickerItemProps) {
  const animatedRegularStyle = useAnimatedStyle(() => {
    const distanceFromCenter = Math.abs(scrollY.value / itemHeight - index);

    return {
      opacity: interpolate(
        distanceFromCenter,
        [0, 0.5, 1, 2, 3],
        [0, 0.3, 0.7, 0.45, 0.25],
        Extrapolation.CLAMP,
      ),
      color: interpolateColor(
        distanceFromCenter,
        [0, 1, 2, 3],
        [
          COLORS.textPrimary,
          COLORS.textMuted,
          COLORS.textFaded,
          COLORS.textInactive,
        ],
      ),
    };
  }, [index, itemHeight, scrollY]);

  const animatedBoldStyle = useAnimatedStyle(() => {
    const distanceFromCenter = Math.abs(scrollY.value / itemHeight - index);

    return {
      opacity: interpolate(
        distanceFromCenter,
        [0, 0.5, 1],
        [1, 0, 0],
        Extrapolation.CLAMP,
      ),
      color: COLORS.textPrimary,
    };
  }, [index, itemHeight, scrollY]);

  return (
    <View style={[styles.row, { height: itemHeight, alignItems: textAlign }]}>
      <Animated.Text
        allowFontScaling={false}
        style={[
          styles.text,
          numericOnly && styles.tabularNums,
          {
            fontFamily: TYPOGRAPHY.regularFamily,
            fontWeight: "400",
          },
          animatedRegularStyle,
        ]}
      >
        {item}
      </Animated.Text>
      <Animated.Text
        allowFontScaling={false}
        style={[
          styles.text,
          styles.boldTextOverlay,
          numericOnly && styles.tabularNums,
          {
            fontFamily: TYPOGRAPHY.mediumFamily,
            fontWeight: "600",
          },
          animatedBoldStyle,
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
  numericOnly?: boolean;
  textAlign?: "center" | "flex-start";
  itemHeight?: number;
  visibleItemCount?: number;
}

const DatePickerColumn = React.memo(function DatePickerColumn({
  items,
  selectedIndex,
  onChange,
  accessibilityLabel,
  columnStyle,
  numericOnly = true,
  textAlign = "center",
  itemHeight = 58,
  visibleItemCount = 7,
}: DatePickerColumnProps) {
  const pickerHeight = itemHeight * visibleItemCount;
  const edgePadding = (pickerHeight - itemHeight) / 2;

  const listRef = useRef<FlatList<string> | null>(null);
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

        listRef.current?.scrollToOffset({ offset: snapOffset, animated: true });
      }
    },
    [itemHeight, onChange, resolveIndexFromOffset],
  );

  const handleScrollBeginDrag = useCallback(() => {
    isDragging.current = true;
  }, []);

  const keyExtractor = useCallback(
    (item: string, index: number) => `${item}-${index}`,
    [],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<string> | null | undefined, index: number) => ({
      index,
      length: itemHeight,
      offset: itemHeight * index,
    }),
    [itemHeight],
  );

  const renderItem = useCallback(
    ({ item, index }: { item: string; index: number }) => (
      <MemoizedPickerItem
        item={item}
        index={index}
        itemHeight={itemHeight}
        numericOnly={numericOnly}
        textAlign={textAlign}
        scrollY={scrollY}
      />
    ),
    [itemHeight, numericOnly, textAlign, scrollY],
  );

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
      return;
    }

    const timer = setTimeout(
      () => {
        listRef.current?.scrollToOffset({
          offset: targetOffset,
          animated: itemCountChanged,
        });
      },
      itemCountChanged ? 50 : 0,
    );

    return () => clearTimeout(timer);
  }, [itemHeight, scrollY, selectedIndex, items.length]);

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
        initialScrollIndex={selectedIndex}
        showsVerticalScrollIndicator={false}
        bounces={false}
        overScrollMode="never"
        scrollsToTop={false}
        initialNumToRender={12}
        maxToRenderPerBatch={8}
        windowSize={5}
        getItemLayout={getItemLayout}
        decelerationRate={Platform.OS === "ios" ? 0.993 : 0.988}
        snapToInterval={itemHeight}
        snapToAlignment="start"
        onScrollBeginDrag={handleScrollBeginDrag}
        onScroll={scrollHandler}
        onScrollEndDrag={handleScrollEndDrag}
        onMomentumScrollEnd={settleToNearestIndex}
        scrollEventThrottle={16}
      />
    </View>
  );
});

export default DatePickerColumn;

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
  },
  tabularNums: {
    fontVariant: ["tabular-nums"],
  },
  boldTextOverlay: {
    position: "absolute",
  },
});
