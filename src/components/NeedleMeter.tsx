import React from 'react';
import './NeedleMeter.css';

interface NeedleMeterProps {
    cents: number; // -50 to +50
    isActive: boolean;
}

const NeedleMeter: React.FC<NeedleMeterProps> = ({ cents, isActive }) => {
    // Clamp cents to -50 / +50 for visual purposes
    const clampedCents = Math.max(-50, Math.min(50, cents));

    // Map cents to degrees. Let's say -50 is -45deg and +50 is +45deg
    const rotation = (clampedCents / 50) * 45;

    // Color logic
    const isStrictlyInTune = Math.abs(cents) < 3;
    const isInTune = Math.abs(cents) < 10;

    return (
        <div className={`needle-meter ${isActive ? 'active' : ''}`}>
            <div className="meter-scale">
                {/* Scale markers */}
                <div className="tick tick-center"></div>
                <div className="tick tick-left-10"></div>
                <div className="tick tick-left-20"></div>
                <div className="tick tick-right-10"></div>
                <div className="tick tick-right-20"></div>
            </div>

            <div
                className={`needle ${isStrictlyInTune ? 'in-tune' : ''}`}
                style={{ transform: `rotate(${rotation}deg)` }}
            >
                <div className="needle-body"></div>
                <div className="needle-head"></div>
            </div>

            <div className={`status-light ${isInTune ? 'success' : 'warning'}`}></div>
        </div>
    );
};

export default NeedleMeter;
