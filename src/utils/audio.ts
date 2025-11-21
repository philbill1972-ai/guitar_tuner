export function autoCorrelate(buffer: Float32Array, sampleRate: number): number {
    const SIZE = buffer.length;

    // 1. RMS Volume Check
    let rms = 0;
    for (let i = 0; i < SIZE; i++) {
        rms += buffer[i] * buffer[i];
    }
    rms = Math.sqrt(rms / SIZE);
    if (rms < 0.01) return -1;

    // 2. NSDF (Normalized Square Difference Function)
    const MIN_LAG = Math.floor(sampleRate / 2000); // Max freq ~2kHz
    const MAX_LAG = Math.floor(sampleRate / 60);   // Min freq ~60Hz

    let bestLag = -1;
    let maxNsdf = -1;

    // Increased threshold for better accuracy
    const PEAK_THRESHOLD = 0.9;
    const N = Math.floor(SIZE / 2);

    // Compute NSDF array
    const nsdfBuffer = new Float32Array(MAX_LAG);
    for (let lag = MIN_LAG; lag < MAX_LAG; lag++) {
        let r = 0;
        let m = 0;
        for (let i = 0; i < N; i++) {
            r += buffer[i] * buffer[i + lag];
            m += buffer[i] * buffer[i] + buffer[i + lag] * buffer[i + lag];
        }
        nsdfBuffer[lag] = 2 * r / m;
    }

    // Find the first significant peak
    for (let lag = MIN_LAG + 1; lag < MAX_LAG - 1; lag++) {
        const prev = nsdfBuffer[lag - 1];
        const curr = nsdfBuffer[lag];
        const next = nsdfBuffer[lag + 1];

        if (curr > PEAK_THRESHOLD && curr > prev && curr > next) {
            bestLag = lag;
            maxNsdf = curr;
            break;
        }
    }

    // Fallback with higher threshold for better accuracy
    if (bestLag === -1) {
        const FALLBACK_THRESHOLD = 0.6;
        let globalMax = 0;
        let globalLag = -1;

        for (let lag = MIN_LAG + 1; lag < MAX_LAG - 1; lag++) {
            const curr = nsdfBuffer[lag];
            if (curr > globalMax) {
                globalMax = curr;
                globalLag = lag;
            }
        }

        if (globalMax > FALLBACK_THRESHOLD) {
            bestLag = globalLag;
        } else {
            return -1;
        }
    }

    // Parabolic Interpolation for precision
    const prev = nsdfBuffer[bestLag - 1];
    const next = nsdfBuffer[bestLag + 1];
    const curr = nsdfBuffer[bestLag];

    const shift = (next - prev) / (2 * (2 * curr - next - prev));
    return sampleRate / (bestLag + shift);
}
