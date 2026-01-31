/**
 * Tutorial Sound Effects
 * Uses Web Audio API to generate simple, pleasant sounds
 */

class TutorialSounds {
    private audioContext: AudioContext | null = null;
    private enabled: boolean = true;

    private getAudioContext(): AudioContext {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.audioContext;
    }

    setEnabled(enabled: boolean) {
        this.enabled = enabled;
    }

    /**
     * Play a welcome/celebration sound (ascending chime)
     */
    playWelcome() {
        if (!this.enabled) return;

        const ctx = this.getAudioContext();
        const now = ctx.currentTime;

        // Create a pleasant ascending arpeggio
        const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0, now + i * 0.12);
            gain.gain.linearRampToValueAtTime(0.15, now + i * 0.12 + 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.12 + 0.3);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + i * 0.12);
            osc.stop(now + i * 0.12 + 0.4);
        });
    }

    /**
     * Play a step transition sound (soft click/pop)
     */
    playStep() {
        if (!this.enabled) return;

        const ctx = this.getAudioContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.value = 880; // A5

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.15);
    }

    /**
     * Play a success/completion sound (triumphant)
     */
    playSuccess() {
        if (!this.enabled) return;

        const ctx = this.getAudioContext();
        const now = ctx.currentTime;

        // Major chord arpeggio going up
        const notes = [523.25, 659.25, 783.99, 1046.5, 1318.51]; // C5, E5, G5, C6, E6

        notes.forEach((freq, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0, now + i * 0.08);
            gain.gain.linearRampToValueAtTime(0.2, now + i * 0.08 + 0.03);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.08 + 0.5);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + i * 0.08);
            osc.stop(now + i * 0.08 + 0.6);
        });
    }

    /**
     * Play a click/interaction sound
     */
    playClick() {
        if (!this.enabled) return;

        const ctx = this.getAudioContext();
        const now = ctx.currentTime;

        // Short pop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(400, now + 0.05);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.1);
    }

    /**
     * Play a progress/achievement sound
     */
    playProgress() {
        if (!this.enabled) return;

        const ctx = this.getAudioContext();
        const now = ctx.currentTime;

        // Two-note "ding"
        [880, 1108.73].forEach((freq, i) => { // A5, C#6
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.value = freq;

            gain.gain.setValueAtTime(0, now + i * 0.1);
            gain.gain.linearRampToValueAtTime(0.12, now + i * 0.1 + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.1 + 0.25);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start(now + i * 0.1);
            osc.stop(now + i * 0.1 + 0.3);
        });
    }

    /**
     * Play navigation sound (whoosh-like)
     */
    playNavigate() {
        if (!this.enabled) return;

        const ctx = this.getAudioContext();
        const now = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(200, now);
        osc.frequency.exponentialRampToValueAtTime(600, now + 0.15);

        gain.gain.setValueAtTime(0.1, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now);
        osc.stop(now + 0.25);
    }
}

// Singleton instance
export const tutorialSounds = new TutorialSounds();
export default tutorialSounds;
