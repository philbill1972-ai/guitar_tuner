export interface GuitarString {
    name: string; // e.g., "6E", "5A"
    note: string;
    octave: number;
    frequency: number;
}

export interface Tuning {
    name: string;
    strings: GuitarString[];
}

export const TUNINGS: Tuning[] = [
    {
        name: "Standard (E A D G B E)",
        strings: [
            { name: "6E", note: "E", octave: 2, frequency: 82.41 },
            { name: "5A", note: "A", octave: 2, frequency: 110.00 },
            { name: "4D", note: "D", octave: 3, frequency: 146.83 },
            { name: "3G", note: "G", octave: 3, frequency: 196.00 },
            { name: "2B", note: "B", octave: 3, frequency: 246.94 },
            { name: "1E", note: "E", octave: 4, frequency: 329.63 },
        ]
    },
    {
        name: "Drop D (D A D G B E)",
        strings: [
            { name: "6D", note: "D", octave: 2, frequency: 73.42 },
            { name: "5A", note: "A", octave: 2, frequency: 110.00 },
            { name: "4D", note: "D", octave: 3, frequency: 146.83 },
            { name: "3G", note: "G", octave: 3, frequency: 196.00 },
            { name: "2B", note: "B", octave: 3, frequency: 246.94 },
            { name: "1E", note: "E", octave: 4, frequency: 329.63 },
        ]
    },
    {
        name: "Eb Standard (Eb Ab Db Gb Bb Eb)",
        strings: [
            { name: "6Eb", note: "D#", octave: 2, frequency: 77.78 },
            { name: "5Ab", note: "G#", octave: 2, frequency: 103.83 },
            { name: "4Db", note: "C#", octave: 3, frequency: 138.59 },
            { name: "3Gb", note: "F#", octave: 3, frequency: 185.00 },
            { name: "2Bb", note: "A#", octave: 3, frequency: 233.08 },
            { name: "1Eb", note: "D#", octave: 4, frequency: 311.13 },
        ]
    },
    {
        name: "C Standard (C F A# D# G C)",
        strings: [
            { name: "6C", note: "C", octave: 2, frequency: 65.41 },
            { name: "5F", note: "F", octave: 2, frequency: 87.31 },
            { name: "4A#", note: "A#", octave: 2, frequency: 116.54 },
            { name: "3D#", note: "D#", octave: 3, frequency: 155.56 },
            { name: "2G", note: "G", octave: 3, frequency: 196.00 },
            { name: "1C", note: "C", octave: 4, frequency: 261.63 },
        ]
    }
];

export function getClosestString(frequency: number, tuning: Tuning): GuitarString | null {
    if (!tuning || !tuning.strings) return null;

    let closestString: GuitarString | null = null;
    let minDiff = Infinity;

    for (const str of tuning.strings) {
        const diff = Math.abs(frequency - str.frequency);
        if (diff < minDiff) {
            minDiff = diff;
            closestString = str;
        }
    }

    return closestString;
}
