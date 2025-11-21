import React, { useState, useEffect } from 'react';
import { useAudioTuner } from '../hooks/useAudioTuner';
import NeedleMeter from './NeedleMeter';
import LEDBarMeter from './LEDBarMeter';
import { TUNINGS, getClosestString, type Tuning } from '../utils/tunings';
import './TunerInterface.css';

type VisualMode = 'needle' | 'led';

const TunerInterface: React.FC = () => {
    const { startTuner, stopTuner, status, noteData } = useAudioTuner();
    const [selectedTuning, setSelectedTuning] = useState<Tuning>(TUNINGS[0]);
    const [targetString, setTargetString] = useState<string | null>(null);
    const [visualMode, setVisualMode] = useState<VisualMode>('needle');

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
            startTuner();
        }
    };

    const handleTuningChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const tuningName = e.target.value;
        const tuning = TUNINGS.find(t => t.name === tuningName);
        if (tuning) {
            setSelectedTuning(tuning);
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

                    <div className="visual-mode-toggle">
                        <button
                            className={`mode-btn ${visualMode === 'needle' ? 'active' : ''}`}
                            onClick={() => setVisualMode('needle')}
                            title="Needle View"
                        >
                            Needle
                        </button>
                        <button
                            className={`mode-btn ${visualMode === 'led' ? 'active' : ''}`}
                            onClick={() => setVisualMode('led')}
                            title="LED View"
                        >
                            LED
                        </button>
                    </div>
                </div>
            </div>

            <div className="tuner-display">
                <div style={{ display: visualMode === 'needle' ? 'block' : 'none' }}>
                    <NeedleMeter
                        cents={noteData ? noteData.cents : 0}
                        isActive={status.isListening}
                    />
                </div>
                <div style={{ display: visualMode === 'led' ? 'block' : 'none' }}>
                    <LEDBarMeter
                        cents={noteData ? noteData.cents : 0}
                        isActive={status.isListening}
                    />
                </div>

                <div className="note-display">
                    {noteData ? (
                        <>
                            <span className="note-name">{noteData.name}</span>
                            <span className="note-octave">{noteData.octave}</span>
                        </>
                    ) : (
                        <span className="note-name placeholder">--</span>
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
