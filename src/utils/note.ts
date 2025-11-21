export const NOTE_STRINGS = [
    "C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"
];

export interface NoteData {
    name: string;
    octave: number;
    frequency: number;
    cents: number;
    deviation: number; // Frequency difference
}

export function getNoteFromFrequency(frequency: number): NoteData {
    const A4 = 440;
    const C0 = A4 * Math.pow(2, -4.75);

    const halfStepsFromC0 = Math.round(12 * Math.log2(frequency / C0));
    const octave = Math.floor(halfStepsFromC0 / 12);
    const noteIndex = halfStepsFromC0 % 12;

    const name = NOTE_STRINGS[noteIndex];

    // Calculate exact frequency of the closest note
    const closestNoteFreq = C0 * Math.pow(2, halfStepsFromC0 / 12);

    // Calculate cents deviation
    // Cents = 1200 * log2(f / f_target)
    const cents = 1200 * Math.log2(frequency / closestNoteFreq);

    return {
        name,
        octave,
        frequency: closestNoteFreq,
        cents,
        deviation: frequency - closestNoteFreq
    };
}
