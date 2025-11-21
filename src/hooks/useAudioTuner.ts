import { useState, useEffect, useRef, useCallback } from 'react';
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
    const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);

    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const rafIdRef = useRef<number | null>(null);
    const bufferRef = useRef<Float32Array | null>(null);

    const getDevices = async () => {
        try {
            const devs = await navigator.mediaDevices.enumerateDevices();
            setDevices(devs.filter(d => d.kind === 'audioinput'));
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        getDevices();
        navigator.mediaDevices.addEventListener('devicechange', getDevices);
        return () => {
            navigator.mediaDevices.removeEventListener('devicechange', getDevices);
        };
    }, []);

    const updatePitch = useCallback(() => {
        if (!analyserRef.current || !audioContextRef.current || !bufferRef.current) return;

        const analyser = analyserRef.current;
        const buffer = bufferRef.current;
        const sampleRate = audioContextRef.current.sampleRate;

        analyser.getFloatTimeDomainData(buffer as any);

        const frequency = autoCorrelate(buffer, sampleRate);

        if (frequency > -1) {
            const note = getNoteFromFrequency(frequency);
            setNoteData(note);
        }

        rafIdRef.current = requestAnimationFrame(updatePitch);
    }, []);

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

            // Refresh devices list now that we have permission
            getDevices();

            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 2048;

            const source = audioContext.createMediaStreamSource(stream);
            source.connect(analyser);

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
    };

    useEffect(() => {
        return () => {
            stopTuner();
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        };
    }, []);

    return {
        startTuner,
        stopTuner,
        status,
        noteData,
        devices
    };
}
