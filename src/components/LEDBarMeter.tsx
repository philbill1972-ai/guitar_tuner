import React from 'react';
import './LEDBarMeter.css';

interface LEDBarMeterProps {
    cents: number;
    isActive: boolean;
}

const LEDBarMeter: React.FC<LEDBarMeterProps> = ({ cents, isActive }) => {
    // Create an array of LEDs. Let's say 21 LEDs.
    // Index 10 is center (0 cents).
    // Range is -50 to +50 cents.
    // Each LED represents ~5 cents.

    const ledCount = 21;
    const centerIndex = 10;

    const leds = Array.from({ length: ledCount }, (_, i) => {
        const offset = i - centerIndex;
        const threshold = offset * 5; // -50, -45, ..., 0, ..., 45, 50

        // Determine if this LED should be lit
        // It's lit if the current cents value is "close" to this LED's threshold
        // Or maybe a bar graph style? Let's do a "dot" style where the closest LED is lit.

        const isCenter = i === centerIndex;
        let isOn = false;

        if (isActive) {
            // Simple dot mode: Light up if within 2.5 cents of this LED's value
            if (Math.abs(cents - threshold) < 3) {
                isOn = true;
            }
        }

        let colorClass = 'led-yellow';
        if (isCenter) colorClass = 'led-green';
        if (Math.abs(offset) > 5) colorClass = 'led-red';

        return (
            <div
                key={i}
                className={`led ${colorClass} ${isOn ? 'on' : ''} ${isCenter ? 'center' : ''}`}
            ></div>
        );
    });

    return (
        <div className="led-bar-meter">
            <div className="led-container">
                {leds}
            </div>
            <div className="led-labels">
                <span>b</span>
                <span className="center-label">IN TUNE</span>
                <span>#</span>
            </div>
        </div>
    );
};

export default LEDBarMeter;
