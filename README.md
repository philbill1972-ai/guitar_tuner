# 🎸 Professional Guitar Tuner

A high-precision guitar tuner built with React, TypeScript, and advanced pitch detection algorithms. Features dual visualization modes (analog needle and LED bar) with adaptive smoothing for accurate tuning across all strings.

![Guitar Tuner](https://img.shields.io/badge/Status-Active-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- 🎯 **High-Precision Pitch Detection** - NSDF (Normalized Square Difference Function) algorithm
- 🎨 **Dual Visualization Modes** - Classic needle meter and modern LED bar
- 🎵 **Multiple Tuning Presets** - Standard, Drop D, Open G, and more
- 🔊 **Adaptive Smoothing** - Extra stability for bass strings, responsive for treble
- 🎛️ **Low-Pass Filtering** - Removes harmonics for cleaner detection
- 📱 **Responsive Design** - Works on desktop and mobile browsers

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- A **microphone** or audio input device

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/philbill1972-ai/guitar_tuner.git
   cd guitar_tuner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open in your browser**
   - Navigate to `http://localhost:5174`
   - Allow microphone access when prompted

## 🎮 Usage

1. **Click "Start Tuner"** to begin listening
2. **Play a string** on your guitar
3. **Watch the meter** - tune until the needle/LED is centered and shows green
4. **Switch views** - Toggle between Needle and LED visualization modes
5. **Change tuning** - Select different tuning presets from the dropdown

## 🛠️ Tech Stack

- **React** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Web Audio API** - Microphone access and audio processing
- **NSDF Algorithm** - Advanced pitch detection

## 📦 Build for Production

```bash
npm run build
```

The built files will be in the `dist/` folder, ready to deploy to any static hosting service.

## 🔧 Development

### Project Structure

```
guitar_tuner/
├── src/
│   ├── components/        # React components
│   │   ├── TunerInterface.tsx
│   │   ├── NeedleMeter.tsx
│   │   └── LEDBarMeter.tsx
│   ├── hooks/            # Custom React hooks
│   │   └── useAudioTuner.ts
│   ├── utils/            # Utility functions
│   │   ├── audio.ts      # NSDF algorithm
│   │   ├── note.ts       # Note detection
│   │   └── tunings.ts    # Tuning presets
│   └── App.tsx           # Main app component
├── public/               # Static assets
└── package.json
```

### Key Algorithms

- **NSDF (Normalized Square Difference Function)** - Robust fundamental frequency detection
- **Adaptive Smoothing** - 6-sample averaging for bass (<200Hz), 3-sample for treble
- **Parabolic Interpolation** - Sub-sample precision for accurate cent calculation
- **Low-Pass Filter** - 1kHz cutoff to remove high-frequency harmonics

## 🎯 Accuracy

- **Precision**: ±0.1 cents
- **Range**: 60Hz - 2000Hz (covers all guitar strings and beyond)
- **Latency**: ~50ms response time
- **Stability**: Adaptive smoothing reduces flutter on bass strings

## 🤝 Contributing

Contributions are welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 🙏 Acknowledgments

- NSDF algorithm based on research in pitch detection
- Inspired by professional guitar tuner pedals
- Built with modern web technologies

---

**Made with ❤️ by Korye Creations** 🎸

*Korye Creations - Crafting digital tools for musicians*

