export function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
    let size = buffer.length;
    let rms = 0;

    // 1. Compute RMS to check if there's enough signal
    for (let i = 0; i < size; i++) {
        const val = buffer[i];
        rms += val * val;
    }
    rms = Math.sqrt(rms / size);

    if (rms < 0.01) {
        return -1; // Not enough signal
    }

    let r1 = 0;
    const threshold = 0.2;

    // Find the first point where the signal goes below a threshold to avoid the zero-lag peak
    for (let i = 0; i < size / 2; i++) {
        if (Math.abs(buffer[i]) < threshold) {
            r1 = i;
            break;
        }
    }

    // Calculate correlation for different lags
    let bestOffset = -1;
    let bestCorrelation = 0;

    // We search lags from r1 up to half the buffer size
    for (let lag = r1; lag < size / 2; lag++) {
        let sum = 0;
        for (let i = 0; i < size - lag; i++) {
            sum += buffer[i] * buffer[i + lag];
        }

        const correlation = sum;
        if (correlation > bestCorrelation) {
            bestCorrelation = correlation;
            bestOffset = lag;
        }
    }

    if (bestCorrelation > 0.01) {
        // Parabolic interpolation for better precision
        const x1 = bestOffset - 1;
        const x3 = bestOffset + 1;

        let correlation1 = 0;
        let correlation3 = 0;

        for (let i = 0; i < size - x1; i++) correlation1 += buffer[i] * buffer[i + x1];
        for (let i = 0; i < size - x3; i++) correlation3 += buffer[i] * buffer[i + x3];

        const shift = (correlation1 - correlation3) / (2 * (correlation1 - 2 * bestCorrelation + correlation3));
        return sampleRate / (bestOffset + shift);
    }

    return -1;
}
