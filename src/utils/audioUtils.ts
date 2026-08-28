// Web Audio API sound effects and ambient sound engine for gamified learning

class SoundFX {
  private ctx: AudioContext | null = null;

  public getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  playCorrect() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'triangle';
      osc.connect(gain);
      gain.connect(ctx.destination);

      // Play joyful two-tone chime (e.g. E5 -> G#5 -> B5)
      osc.frequency.setValueAtTime(659.25, now); // E5
      osc.frequency.setValueAtTime(830.61, now + 0.08); // G#5
      osc.frequency.setValueAtTime(987.77, now + 0.16); // B5

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.start(now);
      osc.stop(now + 0.45);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  playWrong() {
    this.playIncorrect();
  }

  playIncorrect() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.setValueAtTime(220, now); // A3
      osc.frequency.setValueAtTime(180, now + 0.12);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.start(now);
      osc.stop(now + 0.35);
    } catch {
      // Audio fallback
    }
  }

  playStreak() {
    this.playLevelUp();
  }

  playLevelUp() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);

      // Rapid ascending celebratory arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
      });

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

      osc.start(now);
      osc.stop(now + 0.4);
    } catch {
      // Audio fallback
    }
  }

  playChestOpen() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      
      // Multi-layer fanfare chords
      const chords = [
        [523.25, 659.25, 783.99], // C Major
        [587.33, 739.99, 880.00], // D Major
        [659.25, 830.61, 987.77], // E Major
        [1046.50, 1318.51, 1567.98] // High C Major Brilliance
      ];

      chords.forEach((chord, stepIdx) => {
        const stepTime = now + stepIdx * 0.1;
        chord.forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = stepIdx === 3 ? 'triangle' : 'sine';
          osc.frequency.setValueAtTime(freq, stepTime);
          
          gain.gain.setValueAtTime(0.08, stepTime);
          gain.gain.exponentialRampToValueAtTime(0.001, stepTime + (stepIdx === 3 ? 0.7 : 0.25));
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          
          osc.start(stepTime);
          osc.stop(stepTime + (stepIdx === 3 ? 0.7 : 0.25));
        });
      });
    } catch {
      // Audio fallback
    }
  }

  playPetInteract() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      osc.frequency.exponentialRampToValueAtTime(1200, now + 0.08);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.16);

      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.22);
    } catch {
      // Audio fallback
    }
  }

  playClick() {
    try {
      const ctx = this.getContext();
      if (!ctx) return;

      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);

      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio fallback
    }
  }

  playPop() {
    this.playClick();
  }
}

export const soundFX = new SoundFX();

// -------------------------------------------------------------
// Real-time Ambient Sound Synthesizer (Rain, Lo-Fi, Forest, Deep Focus)
// -------------------------------------------------------------
export type AmbientSoundType = 'rain' | 'lofi' | 'forest' | 'deepFocus' | 'off';

class AmbientSoundSynthesizer {
  private ctx: AudioContext | null = null;
  private currentType: AmbientSoundType = 'off';
  private masterGain: GainNode | null = null;
  private nodes: (AudioNode | number)[] = [];
  private intervalId: number | null = null;
  private volume: number = 0.5;

  private initContext() {
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(this.volume * 0.25, this.ctx.currentTime);
    }
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ctx && this.masterGain) {
      try {
        this.masterGain.gain.linearRampToValueAtTime(0.001, this.ctx.currentTime + 0.3);
      } catch {
        // ignore
      }
    }
    setTimeout(() => {
      this.nodes.forEach(node => {
        if (typeof node !== 'number') {
          try {
            if ('stop' in node && typeof (node as AudioScheduledSourceNode).stop === 'function') {
              (node as AudioScheduledSourceNode).stop();
            }
            node.disconnect();
          } catch {
            // ignore
          }
        }
      });
      this.nodes = [];
    }, 350);
    this.currentType = 'off';
  }

  play(type: AmbientSoundType) {
    this.initContext();
    if (!this.ctx) return;
    if (this.currentType === type && type !== 'off') return;

    this.stop();
    if (type === 'off') return;

    this.currentType = type;
    const now = this.ctx.currentTime;
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.setValueAtTime(0.001, now);
    this.masterGain.gain.linearRampToValueAtTime(this.volume * 0.25, now + 0.4);
    this.masterGain.connect(this.ctx.destination);

    if (type === 'rain') {
      this.startRain(now);
    } else if (type === 'lofi') {
      this.startLofi(now);
    } else if (type === 'forest') {
      this.startForest(now);
    } else if (type === 'deepFocus') {
      this.startDeepFocus(now);
    }
  }

  private createPinkNoise(): AudioNode | null {
    if (!this.ctx) return null;
    const bufferSize = this.ctx.sampleRate * 2;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99886 * b0 + white * 0.0555179;
      b1 = 0.99332 * b1 + white * 0.0750759;
      b2 = 0.96900 * b2 + white * 0.1538520;
      b3 = 0.86650 * b3 + white * 0.3104856;
      b4 = 0.55000 * b4 + white * 0.5329522;
      b5 = -0.7616 * b5 - white * 0.0168980;
      data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
      b6 = white * 0.115926;
    }
    const noiseSource = this.ctx.createBufferSource();
    noiseSource.buffer = buffer;
    noiseSource.loop = true;
    return noiseSource;
  }

  private startRain(now: number) {
    if (!this.ctx || !this.masterGain) return;
    const noise = this.createPinkNoise() as AudioBufferSourceNode;
    if (!noise) return;

    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1000, now);

    const highpass = this.ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.setValueAtTime(200, now);

    noise.connect(filter);
    filter.connect(highpass);
    highpass.connect(this.masterGain);

    noise.start(now);
    this.nodes.push(noise, filter, highpass);
  }

  private startLofi(now: number) {
    if (!this.ctx || !this.masterGain) return;

    // Gentle electric piano pentatonic chords progression (Cmaj7 -> Am7 -> Dm7 -> G7)
    const chordProgression = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [293.66, 349.23, 440.00, 523.25], // Dm7
      [196.00, 246.94, 293.66, 349.23]  // G7
    ];

    let step = 0;
    const playNextChord = () => {
      if (!this.ctx || !this.masterGain || this.currentType !== 'lofi') return;
      const t = this.ctx.currentTime;
      const chord = chordProgression[step % chordProgression.length];
      step++;

      chord.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, t);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(700, t);

        gain.gain.setValueAtTime(0.001, t);
        gain.gain.linearRampToValueAtTime(0.05 / (idx + 1), t + 0.4);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 2.8);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start(t);
        osc.stop(t + 2.9);
      });
    };

    playNextChord();
    this.intervalId = window.setInterval(playNextChord, 3000);
  }

  private startForest(now: number) {
    if (!this.ctx || !this.masterGain) return;

    // Gentle wind / leaves base
    const noise = this.createPinkNoise() as AudioBufferSourceNode;
    if (noise) {
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(450, now);
      filter.Q.setValueAtTime(2, now);

      noise.connect(filter);
      filter.connect(this.masterGain);
      noise.start(now);
      this.nodes.push(noise, filter);
    }

    // Occasional procedural bird chirp
    const triggerChirp = () => {
      if (!this.ctx || !this.masterGain || this.currentType !== 'forest') return;
      if (Math.random() > 0.4) return;

      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const baseFreq = 2200 + Math.random() * 800;
      osc.frequency.setValueAtTime(baseFreq, t);
      osc.frequency.exponentialRampToValueAtTime(baseFreq + 600, t + 0.08);
      osc.frequency.exponentialRampToValueAtTime(baseFreq - 200, t + 0.16);

      gain.gain.setValueAtTime(0.02, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

      osc.connect(gain);
      gain.connect(this.masterGain);

      osc.start(t);
      osc.stop(t + 0.2);
    };

    this.intervalId = window.setInterval(triggerChirp, 1800);
  }

  private startDeepFocus(now: number) {
    if (!this.ctx || !this.masterGain) return;

    // 40Hz Gamma binaural rhythm on 200Hz carrier
    const oscLeft = this.ctx.createOscillator();
    const oscRight = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    oscLeft.type = 'sine';
    oscLeft.frequency.setValueAtTime(196, now); // Left ear 196 Hz

    oscRight.type = 'sine';
    oscRight.frequency.setValueAtTime(236, now); // Right ear 236 Hz (40Hz difference)

    gain.gain.setValueAtTime(0.07, now);

    oscLeft.connect(gain);
    oscRight.connect(gain);
    gain.connect(this.masterGain);

    oscLeft.start(now);
    oscRight.start(now);

    this.nodes.push(oscLeft, oscRight, gain);
  }

  getCurrentType(): AmbientSoundType {
    return this.currentType;
  }
}

export const ambientSound = new AmbientSoundSynthesizer();

