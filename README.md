# Scoopwell React Native Assignment

This repository contains the solution for the React Native UI challenge assigned by Scoopwell for the Fullstack Developer role. The core objective of this assignment was to perfectly replicate a sophisticated, fluid, and heavily animated natively-driven Date of Birth Picker based on a provided reference design.

## Reference Design

Below is the strict design reference utilized to construct this screen:

![Reference Design](./Default.png)

## Objective & Implementation Features

The challenge was not just to build a functional date picker, but to achieve true 60fps native performance and pixel-perfect design alignment across iOS and Android. This implementation avoids third-party picker libraries and builds a highly optimized custom solution using Reanimated.

- **Native-Thread Animations**: All scroll mechanics, typography crossfading, and opacity interpolations are mapped strictly over the native UI bridge via `react-native-reanimated`.
- **Intelligent Virtualization**: Implemented custom `Animated.FlatList` virtualization to handle hundreds of date options (e.g., 100+ years) rendering simultaneously without dropping frames, completely circumventing typical React reconciliation UI lag.
- **Dynamic Date Logic**: Complex leap year and month-end boundary evaluations ensure days elegantly adjust natively (e.g. going from January 31 to February snaps exactly to February 28/29 natively).
- **Pixel-Perfect Styling**: Accurate typography scaling, responsive item heights, and native `initialScrollIndex` overrides guarantee the wheels settle exactly on the intended index without artificial mechanical bounce.

---

## Codebase Architecture

The project is structured in a highly scalable and modular way to ensure clean code separation:

### 📱 `src/screens/DateOfBirthScreen.tsx`
The primary layout coordinator. It visually frames the picker, manages the structural screen dimensions, and links the typography, progress dots, buttons, and individual Date picker columns together without forcing artificial flex clipping.

### ⚙️ `src/components/DatePickerColumn.tsx`
The powerhouse of the native UI. This component transforms a standard list of array strings into an Apple-style infinite wheel. It manages:
- **`useAnimatedScrollHandler`**: Reads native scroll velocities.
- **Crossfading Opacity interpolations**: Blends a regular text node and a bold text node asynchronously based purely on their exact mathematical distance from the screen center.

### 🪝 `src/hooks/useDateOfBirthPicker.ts`
The brain of the date state. It handles the raw calculations mapping physical indices to actual dates. Wrapped meticulously in stable `useCallback` configurations so that a selection in the Year column does not trigger expensive React re-renders in the Day and Month columns.

### 🧮 `src/utils/dateUtils.ts`
Pure function utilities for calendar generation. Supplies isolated math to determine if a selected year is a Leap year, calculates accurate day counts accurately to prevent out-of-bounds scrolling, and mathematically clamps arrays.

### 🎨 `src/constants/` (`colors.ts`, `typography.ts`, `spacing.ts`)
The design system core holding the exact hex layers, spacing dimensions, and custom font weights inferred from the Scoopwell design file to ensure pixel-perfect fidelity across different mobile screen sizes.
