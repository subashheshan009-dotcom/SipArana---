// Dedicated Web Audio API sound generator for Focus Study Room
// Provides generative Gentle Rain, Lo-Fi Chill Chords, Library Whisper, and White Noise
// 100% client-side, zero external MP3 assets, zero buffer lag

export type AmbientSoundType = 'none' | 'rain' | 'lofi' | 'library' | 'whitenoise';

class FocusSoundEngine {
  private ctx: AudioContext | null = null;
  private currentType: AmbientSoundType = 'none';
  private masterGain: GainNode | null = null;
  private activeNodes: AudioNode[] = [];
  private lofiInterval: number | null = null;
  private volume: number = 0.5;
  private isMuted: boolean = false;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        this.ctx = new AudioCtxClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private initMasterGain(ctx: AudioContext): GainNode {
    if (!this.masterGain) {
      this.masterGain = ctx.createGain();
      this.masterGain.gain.setValueAtTime(this.isMuted ? 0 : this.volume * 0.2, ctx.currentTime);
      this.masterGain.connect(ctx.destination);
    }
    return this.masterGain;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
    if (this.masterGain && this.ctx && !this.isMuted) {
      this.masterGain.gain.setTargetAtTime(this.volume * 0.25, this.ctx.currentTime, 0.05);
    }
  }

  public getVolume(): number {
    return this.volume;
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.masterGain && this.ctx) {
      const target = this.isMuted ? 0 : this.volume * 0.25;
      this.masterGain.gain.setTargetAtTime(target, this.ctx.currentTime, 0.05);
    }
    return this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public stop() {
    if (this.lofiInterval) {
      clearInterval(this.lofiInterval);
      this.lofiInterval = null;
    }

    this.activeNodes.forEach(node => {
      try {
        if ('stop' in node && typeof (node as any).stop === 'function') {
          (node as any).stop();
        }
        node.disconnect();
      } catch {
        // Safe disposal
      }
    });
    this.activeNodes = [];
    this.currentType = 'none';
  }

  public play(type: AmbientSoundType) {
    if (type === this.currentType) return;
    this.stop();
    if (type === 'none') return;

    const ctx = this.getContext();
    if (!ctx) return;
    const master = this.initMasterGain(ctx);
    this.currentType = type;

    try {
      if (type === 'rain') {
        this.startRain(ctx, master);
      } else if (type === 'lofi') {
        this.startLoFi(ctx, master);
      } else if (type === 'library') {
        this.startLibrary(ctx, master);
      } else if (type === 'whitenoise') {
        this.startWhiteNoise(ctx, master);
      }
    } catch (err) {
      console.warn('Error starting focus audio:', err);
    }
  }

  private createNoiseBuffer(ctx: AudioContext, color: 'brown' | 'pink' | 'white'): AudioBuffer {
    const bufferSize = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;
    let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      if (color === 'brown') {
        // Brown noise: warm, deep, like steady rainfall
        data[i] = (lastOut + 0.02 * white) / 1.02;
        lastOut = data[i];
        data[i] *= 3.5;
      } else if (color === 'pink') {
        // Pink noise: Paul Kellet's filter
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        data[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.11;
        b6 = white * 0.115926;
      } else {
        data[i] = white * 0.2;
      }
    }
    return buffer;
  }

  // 1. Gentle Rain with soft lowpass filter
  private startRain(ctx: AudioContext, destination: GainNode) {
    const rainBuffer = this.createNoiseBuffer(ctx, 'brown');
    const source = ctx.createBufferSource();
    source.buffer = rainBuffer;
    source.loop = true;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 520;

    const highpass = ctx.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = 80;

    const rainGain = ctx.createGain();
    rainGain.gain.value = 0.8;

    source.connect(lowpass);
    lowpass.connect(highpass);
    highpass.connect(rainGain);
    rainGain.connect(destination);

    source.start();
    this.activeNodes.push(source, lowpass, highpass, rainGain);
  }

  // 2. Generative Lo-Fi Ambient Chords: soothing electric piano progressions
  private startLoFi(ctx: AudioContext, destination: GainNode) {
    // Subtle background vinyl noise bed
    const vinylBuffer = this.createNoiseBuffer(ctx, 'pink');
    const vinylSource = ctx.createBufferSource();
    vinylSource.buffer = vinylBuffer;
    vinylSource.loop = true;

    const vinylFilter = ctx.createBiquadFilter();
    vinylFilter.type = 'bandpass';
    vinylFilter.frequency.value = 1200;
    vinylFilter.Q.value = 1.2;

    const vinylGain = ctx.createGain();
    vinylGain.gain.value = 0.08;

    vinylSource.connect(vinylFilter);
    vinylFilter.connect(vinylGain);
    vinylGain.connect(destination);
    vinylSource.start();
    this.activeNodes.push(vinylSource, vinylFilter, vinylGain);

    // Pentatonic chord bank (Cmaj7, Am7, Dm7, G7sus, Em7) frequencies in Hz
    const chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7
      [220.00, 261.63, 329.63, 392.00], // Am7
      [146.83, 220.00, 293.66, 349.23], // Dm7
      [196.00, 261.63, 293.66, 392.00], // Gsus
      [164.81, 246.94, 329.63, 392.00]  // Em7
    ];

    let chordIdx = 0;

    const playChord = () => {
      if (this.currentType !== 'lofi' || !this.ctx) return;
      const currentChord = chords[chordIdx % chords.length];
      chordIdx++;

      currentChord.forEach((freq, noteIdx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        const noteFilter = ctx.createBiquadFilter();

        osc.type = noteIdx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        noteFilter.type = 'lowpass';
        noteFilter.frequency.setValueAtTime(600, ctx.currentTime);
        noteFilter.frequency.exponentialRampToValueAtTime(320, ctx.currentTime + 3.0);

        const now = ctx.currentTime;
        noteGain.gain.setValueAtTime(0.001, now);
        noteGain.gain.linearRampToValueAtTime(0.045, now + 0.4);
        noteGain.gain.exponentialRampToValueAtTime(0.0001, now + 4.2);

        osc.connect(noteFilter);
        noteFilter.connect(noteGain);
        noteGain.connect(destination);

        osc.start(now);
        osc.stop(now + 4.5);
      });
    };

    // Play first chord immediately, then every 4 seconds
    playChord();
    this.lofiInterval = window.setInterval(playChord, 4200);
  }

  // 3. Library Whisper: gentle acoustic room warmth
  private startLibrary(ctx: AudioContext, destination: GainNode) {
    const buffer = this.createNoiseBuffer(ctx, 'pink');
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 350;
    filter.Q.value = 0.8;

    const gain = ctx.createGain();
    gain.gain.value = 0.4;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(destination);

    source.start();
    this.activeNodes.push(source, filter, gain);
  }

  // 4. White Noise: steady masking tone
  private startWhiteNoise(ctx: AudioContext, destination: GainNode) {
    const buffer = this.createNoiseBuffer(ctx, 'white');
    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const lowpass = ctx.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = 1800;

    const gain = ctx.createGain();
    gain.gain.value = 0.25;

    source.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(destination);

    source.start();
    this.activeNodes.push(source, lowpass, gain);
  }

  public getCurrentType(): AmbientSoundType {
    return this.currentType;
  }
}

export const focusSoundEngine = new FocusSoundEngine();
