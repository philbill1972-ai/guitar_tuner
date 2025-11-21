import { useState, useRef } from 'react';
import { autoCorrelate } from '../utils/audio';
import type { NoteData } from '../utils/note';
import { getNoteFromFrequency } from '../utils/note';

export interface TunerStatus {
    isListening: boolean;
    error: string | null;
}

export function useAudioTuner() {
    const [status, setStatus] = useState<TunerStatus>({ isListening: false, error: null });
    const [noteData, setNoteData] = useState<NoteData | null>(null);

    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const rafIdRef = useRef<number | null>(null);
    const bufferRef = useRef<Float32Array | null>(null);
    const frequencyHistoryRef = useRef<number[]>([]);

    const updatePitch = () => {
        if (!analyserRef.current || !audioContextRef.current || !bufferRef.current) return;

        const analyser = analyserRef.current;
        const buffer = bufferRef.current;
        const sampleRate = audioContextRef.current.sampleRate;

        analyser.getFloatTimeDomainData(buffer as any);

        const frequency = autoCorrelate(buffer, sampleRate);

        if (frequency > -1) {
            // Add to history for smoothing
            frequencyHistoryRef.current.push(frequency);

            // Adaptive smoothing: more for bass notes (< 200Hz), less for treble
            // Low E = 82Hz, A = 110Hz, D = 147Hz need more smoothing
            // G = 196Hz, B = 247Hz, high E = 330Hz need less
            const smoothingWindow = frequency < 200 ? 6 : 3;

            // Keep only the required number of readings
            if (frequencyHistoryRef.current.length > smoothingWindow) {
                frequencyHistoryRef.current.shift();
            }

            // Calculate average frequency
            const avgFrequency = frequencyHistoryRef.current.reduce((a, b) => a + b, 0) / frequencyHistoryRef.current.length;

            const note = getNoteFromFrequency(avgFrequency);
            setNoteData(note);
        } else {
            // Clear history if no signal detected
            frequencyHistoryRef.current = [];
        }

        rafIdRef.current = requestAnimationFrame(updatePitch);
    };

    const startTuner = async (deviceId?: string) => {
        try {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
            }

            const audioContext = audioContextRef.current;

            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            const constraints: MediaStreamConstraints = {
                audio: deviceId ? { deviceId: { exact: deviceId } } : true
            };

            const stream = await navigator.mediaDevices.getUserMedia(constraints);

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 4096;

            const source = audioContext.createMediaStreamSource(stream);

            const filter = audioContext.createBiquadFilter();
            filter.type = 'lowpass';
            filter.frequency.value = 1000;

            source.connect(filter);
            filter.connect(analyser);

            analyserRef.current = analyser;
            sourceRef.current = source;
            bufferRef.current = new Float32Array(analyser.fftSize);

            setStatus({ isListening: true, error: null });
            updatePitch();

        } catch (err: any) {
            console.error("Error accessing microphone:", err);
            setStatus({ isListening: false, error: "Could not access microphone. Please allow permissions." });
        }
    };

    const stopTuner = () => {
        if (rafIdRef.current) {
            cancelAnimationFrame(rafIdRef.current);
            rafIdRef.current = null;
        }

        if (sourceRef.current) {
            sourceRef.current.disconnect();
            sourceRef.current = null;
        }

        setStatus(prev => ({ ...prev, isListening: false }));
        setNoteData(null);
        frequencyHistoryRef.current = [];
    };

    return {
        startTuner,
        stopTuner,
        status,
        noteData,
        devices: []
    };
}
