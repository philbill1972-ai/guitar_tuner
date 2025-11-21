# Implementation Plan - Professional Guitar Tuner

This plan outlines the development of a professional, visually stunning web-based guitar tuner. The app will feature audio input processing, pitch detection, and multiple visual indicators (lights, analog needle). It will support standard and alternate tunings.

## User Requirements
- **Web Front End**: Accessible via browser.
- **Input Selection**: User can choose audio input source.
- **Visual Indicators**:
    - Lights (LED style).
    - Analog Needle (classic tuner look).
    - "In Tune" is centered.
- **Automatic String Detection**: Detects the closest string and indicates direction to tune.
- **Tuning Options**:
    - Standard (E A D G B E)
    - Drop D
    - Eb Standard
    - C Standard
    - Custom/Other
- **Aesthetics**: Professional, premium, "wow" factor.

## Tech Stack
- **Framework**: React (Vite) + TypeScript
- **Styling**: Vanilla CSS (CSS Variables, Flexbox/Grid, Animations)
- **Audio Processing**: Web Audio API (AudioContext, AnalyserNode)
- **Pitch Detection**: Autocorrelation or similar algorithm (e.g., Yin algorithm implementation or a lightweight library if needed, but we will aim for a custom implementation or a robust hook).

## Proposed Architecture

### 1. Core Audio Engine (`useAudioTuner` hook)
- Manages `AudioContext`.
- Handles microphone permissions and stream.
- Performs pitch detection (frequency estimation).
- Maps frequency to musical notes (Note + Cents off).

### 2. State Management
- `TuningContext`: Stores current tuning preset (Standard, Drop D, etc.).
- `TunerState`: Stores current detected pitch, note, deviation (cents), and stability.

### 3. UI Components
- **`TunerInterface`**: Main container.
- **`VisualizerDisplay`**:
    - **`NeedleMeter`**: Canvas or CSS-based analog needle.
    - **`StrobeLights`**: LED array indicating flat/sharp.
    - **`NoteDisplay`**: Large typography showing the detected note.
    - **`StringIndicator`**: Shows which string is being tuned relative to the selected tuning.
- **`Controls`**:
    - Input selector.
    - Tuning preset selector.
    - Mute/Start toggle.

## Step-by-Step Implementation

### Phase 1: Foundation & Aesthetics
- [ ] Set up project structure and global CSS variables (colors, typography).
- [ ] Create the main layout shell with a premium dark theme.
- [ ] Implement the basic "Design System" (buttons, panels, glassmorphism effects).

### Phase 2: Audio Engine
- [ ] Implement `useAudioInput` to handle microphone access and device selection.
- [ ] Implement pitch detection logic (Autocorrelation).
- [ ] Create utilities to convert Frequency -> Note -> Cents.

### Phase 3: Core Tuner UI
- [ ] Build the `NeedleMeter` component with smooth animations.
- [ ] Build the `NoteDisplay` and `StringIndicator`.
- [ ] Connect Audio Engine to UI.

### Phase 4: Advanced Features
- [ ] Add Tuning Presets (Drop D, etc.).
- [ ] Add "Lights" visual mode (LEDs).
- [ ] Polish animations and responsiveness.

## Visual Style Guide
- **Theme**: Dark, sleek, "Studio Equipment" feel.
- **Colors**:
    - Background: Deep charcoal/black gradients.
    - Accents: Neon Green (In tune), Amber/Red (Out of tune), Electric Blue (UI elements).
    - Materials: Brushed metal textures, glass panels, glowing lights.
