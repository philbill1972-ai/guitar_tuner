# Guitar Tuner - Walkthrough

This is a professional, web-based guitar tuner built with React and the Web Audio API.

## Features

### 1. Professional Interface
- **Premium Dark Theme**: Designed for low-light studio environments.
- **Analog Needle**: Smooth, responsive needle indicating pitch deviation.
- **Digital Display**: Shows the detected note and octave (e.g., "A4").
- **Cents Deviation**: Precise numerical feedback (e.g., "+2.5 cents").

### 2. Audio Engine
- **Microphone Input**: Uses the browser's `AudioContext` to capture audio.
- **Pitch Detection**: Implements an autocorrelation algorithm to accurately detect pitch from a guitar signal.
- **Input Selection**: Allows choosing different audio input devices (microphones, interfaces) if available.

### 3. Tuning Presets
- **Standard**: E A D G B E
- **Drop D**: D A D G B E
- **Eb Standard**: Eb Ab Db Gb Bb Eb
- **C Standard**: C F Bb Eb G C
- **Target String Detection**: Automatically highlights the closest string in the selected tuning (e.g., "Target: 6E").

## How to Use

1.  **Start the Tuner**: Click the "Start Tuner" button. You will be prompted to allow microphone access.
2.  **Select Input**: If you have multiple microphones (e.g., an external USB interface), select it from the dropdown next to the tuning selector.
3.  **Select Tuning**: Choose your desired tuning from the dropdown (default is Standard).
4.  **Tune Up**: Play a string. The tuner will detect the note and show you how far off you are.
    - **Needle Left**: Flat (tune up).
    - **Needle Right**: Sharp (tune down).
    - **Green Light**: In tune!

## Technical Details
- **Tech Stack**: React, TypeScript, Vite, Vanilla CSS.
- **Audio Processing**: `ScriptProcessor` / `AnalyserNode` with custom autocorrelation logic.
- **Styling**: CSS Variables for easy theming and performance.
