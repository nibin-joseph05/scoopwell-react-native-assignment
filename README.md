# Scoopwell React Native Assignment

This repository contains the solution for the React Native UI challenge assigned by Scoopwell for the Fullstack Developer role. The core objective of this assignment was to perfectly replicate a sophisticated, fluid and natively-driven Date of Birth Picker based on a provided reference design.

## Reference Design

<p align="center">
  <img src="./Default.png" alt="Reference Design" width="300"/>
</p>

## Features

This project avoids third-party picker libraries to build a custom solution from scratch, prioritizing a clean and robust user interface.

- **Custom Scroll Mechanics**: Wheel-like scrolling built with `Animated.FlatList` and `react-native-reanimated`.
- **Dynamic Date Logic**: Automatically handles leap years and accurate day-counts for different months natively.
- **Responsive Layout**: Adjusts vertical and horizontal spacing to look identical on various screen sizes.

## Tech Stack

- **Framework**: React Native `0.81.5` / Expo `~54.0.0`
- **Animations**: React Native Reanimated `~4.1.1`
- **Language**: TypeScript `~5.9.2`

---

## Codebase Architecture

The project is structured in a highly scalable and modular way to ensure clean code separation:

###  `src/screens/DateOfBirthScreen.tsx`
The primary layout coordinator. It visually frames the picker, manages the structural screen dimensions, and links the typography, progress dots, buttons, and individual Date picker columns together without forcing artificial flex clipping.

###  `src/components/DatePickerColumn.tsx`
The powerhouse of the native UI. This component transforms a standard list of array strings into an Apple-style infinite wheel. It manages:
- **`useAnimatedScrollHandler`**: Reads native scroll velocities.
- **Crossfading Opacity interpolations**: Blends a regular text node and a bold text node asynchronously based purely on their exact mathematical distance from the screen center.

###  `src/hooks/useDateOfBirthPicker.ts`
The brain of the date state. It handles the raw calculations mapping physical indices to actual dates. Wrapped meticulously in stable `useCallback` configurations so that a selection in the Year column does not trigger expensive React re-renders in the Day and Month columns.

###  `src/utils/dateUtils.ts`
Pure function utilities for calendar generation. Supplies isolated math to determine if a selected year is a Leap year, calculates accurate day counts accurately to prevent out-of-bounds scrolling, and mathematically clamps arrays.

###  `src/constants/` (`colors.ts`, `typography.ts`, `spacing.ts`)
The design system core holding the exact hex layers, spacing dimensions, and custom font weights inferred from the Scoopwell design file to ensure pixel-perfect fidelity across different mobile screen sizes.
