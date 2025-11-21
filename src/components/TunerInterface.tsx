import React, { useState, useEffect } from 'react';
import { useAudioTuner } from '../hooks/useAudioTuner';
import NeedleMeter from './NeedleMeter';
import { TUNINGS, getClosestString, type Tuning } from '../utils/tunings';
import './TunerInterface.css';

const TunerInterface: React.FC = () => {
    const { startTuner, stopTuner, status, noteData, devices } = useAudioTuner();
    const [selectedTuning, setSelectedTuning] = useState<Tuning>(TUNINGS[0]);
    const [targetString, setTargetString] = useState<string | null>(null);
    const [selectedDeviceId, setSelectedDeviceId] = useState<string>('');

    useEffect(() => {
        if (noteData && selectedTuning) {
            const closest = getClosestString(noteData.frequency, selectedTuning);
            if (closest) {
                setTargetString(closest.name);
            }
        } else {
            setTargetString(null);
        }
    }, [noteData, selectedTuning]);

    const handleToggle = () => {
        if (status.isListening) {
            stopTuner();
        } else {
            startTuner(selectedDeviceId);
        }
    };

    const handleTuningChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const tuningName = e.target.value;
        const tuning = TUNINGS.find(t => t.name === tuningName);
        if (tuning) {
            setSelectedTuning(tuning);
        }
    };

    const handleDeviceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newId = e.target.value;
        setSelectedDeviceId(newId);
        if (status.isListening) {
            stopTuner();
            // Small timeout to allow cleanup
            setTimeout(() => startTuner(newId), 100);
        }
    };

    return (
        <div className="tuner-interface">
            <div className="tuner-header">
                <div className="selectors-container">
                    <select
                        className="tuning-selector"
                        value={selectedTuning.name}
                        onChange={handleTuningChange}
                    >
                        {TUNINGS.map(t => (
                            <option key={t.name} value={t.name}>{t.name}</option>
                        ))}
                    </select>

                    {devices.length > 0 && (
                        <select
                            className="tuning-selector device-selector"
                            value={selectedDeviceId}
                            onChange={handleDeviceChange}
                        >
                            <option value="">Default Input</option>
                            {devices.map(d => (
                                <option key={d.deviceId} value={d.deviceId}>
                                    {d.label || `Microphone ${d.deviceId.slice(0, 5)}...`}
                                </option>
                            ))}
                        </select>
                    )}
                </div>
            </div>

            <div className="tuner-display">
                <NeedleMeter
                    cents={noteData ? noteData.cents : 0}
                    isActive={status.isListening}
                />

                <div className="note-display">
                    {noteData ? (
                        <>
                            <span className="note-name">{noteData.name}</span>
                            <span className="note-octave">{noteData.octave}</span>
                        </>
                    ) : (
                        <span className="note-name" style={{ opacity: 0.3 }}>--</span>
                    )}
                </div>

                <div className="string-target">
                    {targetString ? (
                        <span>Target: <span className="highlight">{targetString}</span></span>
                    ) : (
                        <span>&nbsp;</span>
                    )}
                </div>

                <div className="cents-display">
                    {noteData ? (
                        <span>{noteData.cents > 0 ? '+' : ''}{noteData.cents.toFixed(1)} cents</span>
                    ) : (
                        <span>Ready</span>
                    )}
                </div>
            </div>

            {status.error && <div className="error-message">{status.error}</div>}

            <div className="tuner-controls">
                <button className={`control-btn ${status.isListening ? 'active' : ''}`} onClick={handleToggle}>
                    {status.isListening ? 'Stop Tuner' : 'Start Tuner'}
                </button>
            </div>
        </div>
    );
};

export default TunerInterface;
