'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface VinylTrackSpec {
  id: string;
  number: string;
  side: 'LADO A' | 'LADO B';
  title: string;
  subtitle: string;
  duration: string;
  bpm: number;
  coverUrl: string;
  tag: string;
  description: string;
  /** Angle (in degrees) of the tonearm when resting on this groove */
  grooveAngle: number;
  /** Chord progression frequencies (Hz) for the warm analog Rhodes/Bossa synth */
  chords: number[][];
  /** Bass root frequencies (Hz) */
  bass: number[];
  /** Melody notes (Hz) */
  melody: number[];
}

export const DEFAULT_VINYL_TRACKS: VinylTrackSpec[] = [
  {
    id: 'track-1',
    number: '01',
    side: 'LADO A',
    title: 'La Aguja sobre el Vinilo',
    subtitle: 'Sesión de Apertura · Rhodes & Vinilo Cálido',
    duration: '03:24',
    bpm: 92,
    coverUrl: '/images/ritmo-de-dos/cover.jpg',
    tag: '33⅓ RPM · HI-FI',
    description:
      'Una atmósfera analógica de madera cálida, bulbos encendidos y las canciones que nos acompañaron desde la primera cita.',
    grooveAngle: 2,
    chords: [
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
      [220.0, 261.63, 329.63, 392.0], // Am7
      [293.66, 349.23, 440.0, 523.25], // Dm7
      [196.0, 246.94, 293.66, 349.23], // G7
    ],
    bass: [130.81, 110.0, 146.83, 98.0],
    melody: [523.25, 659.25, 587.33, 493.88, 523.25, 440.0, 392.0, 493.88],
  },
  {
    id: 'track-2',
    number: '02',
    side: 'LADO A',
    title: 'Atardecer en Foro Roma',
    subtitle: 'Bossa Soul · Terraza & Cuerdas',
    duration: '04:02',
    bpm: 104,
    coverUrl: '/images/ritmo-de-dos/venue.jpg',
    tag: 'COLONIA ROMA',
    description:
      'Mesas largas bajo luces ámbar, flores secas en tonos terracota y una acústica pensada para conversar sin prisa.',
    grooveAngle: 7,
    chords: [
      [349.23, 440.0, 523.25, 659.25], // Fmaj7
      [329.63, 392.0, 493.88, 587.33], // Em7
      [293.66, 349.23, 440.0, 523.25], // Dm7
      [261.63, 329.63, 392.0, 493.88], // Cmaj7
    ],
    bass: [87.31, 82.41, 73.42, 130.81],
    melody: [659.25, 587.33, 523.25, 440.0, 523.25, 587.33, 659.25, 523.25],
  },
  {
    id: 'track-3',
    number: '03',
    side: 'LADO B',
    title: 'Brindis de Aguja Dorada',
    subtitle: 'Mezcal Lounge · Vibráfono & Groove',
    duration: '03:48',
    bpm: 98,
    coverUrl: '/images/ritmo-de-dos/toast.jpg',
    tag: 'WARM-UP SET',
    description:
      'Copas de mezcal artesanal, coctelería de autor y el calor de nuestras familias reunidas en un mismo compás.',
    grooveAngle: 12,
    chords: [
      [293.66, 369.99, 440.0, 554.37], // Dmaj7
      [246.94, 293.66, 369.99, 440.0], // Bm7
      [329.63, 392.0, 493.88, 587.33], // Em7
      [220.0, 277.18, 329.63, 392.0], // A7
    ],
    bass: [146.83, 123.47, 82.41, 110.0],
    melody: [587.33, 739.99, 659.25, 587.33, 493.88, 554.37, 587.33, 440.0],
  },
  {
    id: 'track-4',
    number: '04',
    side: 'LADO B',
    title: 'El Primer Baile & Tornamesa',
    subtitle: 'Disco Funk Analógico · Pista Abierta',
    duration: '04:15',
    bpm: 116,
    coverUrl: '/images/ritmo-de-dos/dance.jpg',
    tag: 'PISTA ABIERTA',
    description:
      'Cuando caiga la noche abriremos la pista con nuestro vinilo favorito hasta que suene el último encore.',
    grooveAngle: 17,
    chords: [
      [311.13, 392.0, 466.16, 587.33], // Ebmaj7
      [261.63, 311.13, 392.0, 466.16], // Cm7
      [349.23, 415.3, 523.25, 622.25], // Fm7
      [233.08, 293.66, 349.23, 415.3], // Bb7
    ],
    bass: [77.78, 130.81, 87.31, 116.54],
    melody: [622.25, 783.99, 698.46, 587.33, 622.25, 523.25, 466.16, 587.33],
  },
];

interface UseVinylTurntableOptions {
  tracks?: VinylTrackSpec[];
  externalTrackUrl?: string;
  preferExternalAudio?: boolean;
}

export function useVinylTurntable({
  tracks = DEFAULT_VINYL_TRACKS,
  externalTrackUrl,
  preferExternalAudio = false,
}: UseVinylTurntableOptions = {}) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeTrackIndex, setActiveTrackIndex] = useState(0);
  const [rpm, setRpm] = useState<33 | 45>(33);
  const [pitchPercent, setPitchPercent] = useState(0); // -8 to +8
  const [crackleEnabled, setCrackleEnabled] = useState(true);
  const [volume, setVolume] = useState(0.78);
  const [vuLevels, setVuLevels] = useState<[number, number]>([8, 6]);
  const [grooveProgress, setGrooveProgress] = useState(0); // 0..1 within active track

  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const crackleGainRef = useRef<GainNode | null>(null);
  const crackleSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const stepTimerRef = useRef<number | null>(null);
  const vuTimerRef = useRef<number | null>(null);
  const stepCountRef = useRef(0);
  const externalAudioRef = useRef<HTMLAudioElement | null>(null);

  const activeTrack = tracks[activeTrackIndex] || tracks[0];
  const speedMultiplier = (rpm === 45 ? 45 / 33.333 : 1) * (1 + pitchPercent / 100);

  // Tonearm angle: -28deg when parked off the record, or grooveAngle + subtle progress when playing
  const tonearmAngle = isPlaying
    ? activeTrack.grooveAngle + grooveProgress * 3.8
    : -28;

  const ensureAudioContext = useCallback(() => {
    if (typeof window === 'undefined') return null;
    if (!audioCtxRef.current) {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!Ctx) return null;
      const ctx = new Ctx();
      const master = ctx.createGain();
      master.gain.value = volume;
      master.connect(ctx.destination);
      audioCtxRef.current = ctx;
      masterGainRef.current = master;
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().catch(() => {});
    }
    return audioCtxRef.current;
  }, [volume]);

  /**
   * Plays a tactile mechanical needle-drop / needle-lift sound effect
   */
  const playNeedleSound = useCallback(
    (type: 'drop' | 'lift' | 'scrub') => {
      const ctx = ensureAudioContext();
      const master = masterGainRef.current;
      if (!ctx || !master) return;

      const now = ctx.currentTime;
      // Low vinyl thump
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      if (type === 'drop') {
        osc.frequency.setValueAtTime(145, now);
        osc.frequency.exponentialRampToValueAtTime(42, now + 0.14);
        gain.gain.setValueAtTime(0.32, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.16);
      } else if (type === 'lift') {
        osc.frequency.setValueAtTime(65, now);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.09);
        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.11);
      } else {
        // Vinyl scratch / scrub chirp
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(220, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.07);
        osc.frequency.exponentialRampToValueAtTime(160, now + 0.16);
        gain.gain.setValueAtTime(0.24, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      }
      osc.connect(gain);
      gain.connect(master);
      osc.start(now);
      osc.stop(now + 0.2);
    },
    [ensureAudioContext]
  );

  /**
   * Starts continuous warm vinyl surface crackle buffer
   */
  const startCrackleLoop = useCallback(() => {
    const ctx = ensureAudioContext();
    const master = masterGainRef.current;
    if (!ctx || !master) return;

    if (crackleSourceRef.current) {
      try {
        crackleSourceRef.current.stop();
      } catch {
        // ignore
      }
      crackleSourceRef.current = null;
    }

    const bufferSize = ctx.sampleRate * 3;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      // Soft pink-ish hiss + occasional warm vinyl dust pop
      const pop = Math.random() > 0.9985 ? (Math.random() * 2 - 1) * 0.65 : 0;
      const hiss = (Math.random() * 2 - 1) * 0.035;
      data[i] = pop + hiss;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;
    source.loop = true;

    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1650;
    filter.Q.value = 0.85;

    const crackleGain = ctx.createGain();
    crackleGain.gain.value = crackleEnabled ? 0.14 : 0;

    source.connect(filter);
    filter.connect(crackleGain);
    crackleGain.connect(master);
    source.start();

    crackleSourceRef.current = source;
    crackleGainRef.current = crackleGain;
  }, [crackleEnabled, ensureAudioContext]);

  /**
   * Synthesizes one beat of warm analog Rhodes + upright bass + brushed hi-hat + melody
   */
  const triggerAnalogBeat = useCallback(
    (track: VinylTrackSpec, step: number, rate: number) => {
      const ctx = audioCtxRef.current;
      const master = masterGainRef.current;
      if (!ctx || !master) return;

      const now = ctx.currentTime;
      const chordIndex = Math.floor(step / 4) % track.chords.length;
      const subStep = step % 4;
      const chord = track.chords[chordIndex];
      const bassNote = track.bass[chordIndex];

      // 1. Warm Rhodes Chord on beat 0 and syncopated beat 2
      if (subStep === 0 || subStep === 2) {
        const duration = subStep === 0 ? 1.15 / rate : 0.65 / rate;
        chord.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const noteGain = ctx.createGain();
          const filter = ctx.createBiquadFilter();

          osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
          osc.frequency.setValueAtTime(freq * rate, now);

          filter.type = 'lowpass';
          filter.frequency.setValueAtTime(1150, now);

          const peak = subStep === 0 ? 0.055 : 0.035;
          noteGain.gain.setValueAtTime(0.0001, now);
          noteGain.gain.linearRampToValueAtTime(peak, now + 0.025);
          noteGain.gain.exponentialRampToValueAtTime(0.0008, now + duration);

          osc.connect(filter);
          filter.connect(noteGain);
          noteGain.connect(master);

          osc.start(now);
          osc.stop(now + duration + 0.04);
        });
      }

      // 2. Warm Analog Bass on beat 0 and 3
      if (subStep === 0 || subStep === 3) {
        const bassOsc = ctx.createOscillator();
        const bassGain = ctx.createGain();
        const bassFilter = ctx.createBiquadFilter();

        bassOsc.type = 'triangle';
        const freq = subStep === 3 ? bassNote * 1.5 : bassNote;
        bassOsc.frequency.setValueAtTime(freq * rate, now);

        bassFilter.type = 'lowpass';
        bassFilter.frequency.setValueAtTime(340, now);

        const dur = (subStep === 0 ? 0.55 : 0.28) / rate;
        bassGain.gain.setValueAtTime(0.001, now);
        bassGain.gain.linearRampToValueAtTime(0.14, now + 0.02);
        bassGain.gain.exponentialRampToValueAtTime(0.001, now + dur);

        bassOsc.connect(bassFilter);
        bassFilter.connect(bassGain);
        bassGain.connect(master);

        bassOsc.start(now);
        bassOsc.stop(now + dur + 0.03);
      }

      // 3. Soft Analog Vibraphone / Lead Melody
      if (step % 2 === 0) {
        const melIndex = (step / 2) % track.melody.length;
        const melFreq = track.melody[melIndex];
        const melOsc = ctx.createOscillator();
        const melGain = ctx.createGain();

        melOsc.type = 'sine';
        melOsc.frequency.setValueAtTime(melFreq * rate, now);

        const dur = 0.42 / rate;
        melGain.gain.setValueAtTime(0.0001, now);
        melGain.gain.linearRampToValueAtTime(0.048, now + 0.015);
        melGain.gain.exponentialRampToValueAtTime(0.0005, now + dur);

        melOsc.connect(melGain);
        melGain.connect(master);

        melOsc.start(now);
        melOsc.stop(now + dur + 0.02);
      }
    },
    []
  );

  // Update master volume
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      masterGainRef.current.gain.setTargetAtTime(
        volume,
        audioCtxRef.current.currentTime,
        0.04
      );
    }
    if (externalAudioRef.current) {
      externalAudioRef.current.volume = volume;
    }
  }, [volume]);

  // Update crackle gain
  useEffect(() => {
    if (crackleGainRef.current && audioCtxRef.current) {
      crackleGainRef.current.gain.setTargetAtTime(
        crackleEnabled ? 0.14 : 0,
        audioCtxRef.current.currentTime,
        0.05
      );
    }
  }, [crackleEnabled]);

  // Main sequencer & VU meter loop when playing
  useEffect(() => {
    if (!isPlaying) {
      if (stepTimerRef.current) window.clearInterval(stepTimerRef.current);
      if (vuTimerRef.current) window.clearInterval(vuTimerRef.current);
      if (crackleSourceRef.current) {
        try {
          crackleSourceRef.current.stop();
        } catch {
          // ignore
        }
        crackleSourceRef.current = null;
      }
      if (externalAudioRef.current) {
        externalAudioRef.current.pause();
      }
      setVuLevels([6, 6]);
      return;
    }

    ensureAudioContext();
    startCrackleLoop();

    const useExternal = Boolean(preferExternalAudio && externalTrackUrl);
    if (useExternal && externalTrackUrl) {
      if (!externalAudioRef.current || externalAudioRef.current.src !== externalTrackUrl) {
        externalAudioRef.current = new Audio(externalTrackUrl);
        externalAudioRef.current.loop = true;
      }
      externalAudioRef.current.volume = volume;
      externalAudioRef.current.playbackRate = speedMultiplier;
      externalAudioRef.current.play().catch(() => {});
    } else {
      const stepMs = Math.max(
        140,
        Math.round((60000 / activeTrack.bpm / 2) / speedMultiplier)
      );
      triggerAnalogBeat(activeTrack, stepCountRef.current, speedMultiplier);
      stepTimerRef.current = window.setInterval(() => {
        stepCountRef.current += 1;
        triggerAnalogBeat(activeTrack, stepCountRef.current, speedMultiplier);
        setGrooveProgress((prev) => (prev >= 1 ? 0 : prev + 0.015));
      }, stepMs);
    }

    vuTimerRef.current = window.setInterval(() => {
      const base = rpm === 45 ? 68 : 56;
      const left = Math.min(96, Math.max(18, Math.round(base + (Math.random() * 34 - 14))));
      const right = Math.min(96, Math.max(18, Math.round(base + (Math.random() * 34 - 14))));
      setVuLevels([left, right]);
    }, 130);

    return () => {
      if (stepTimerRef.current) window.clearInterval(stepTimerRef.current);
      if (vuTimerRef.current) window.clearInterval(vuTimerRef.current);
    };
  }, [
    isPlaying,
    activeTrack,
    speedMultiplier,
    rpm,
    preferExternalAudio,
    externalTrackUrl,
    volume,
    ensureAudioContext,
    startCrackleLoop,
    triggerAnalogBeat,
  ]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (stepTimerRef.current) window.clearInterval(stepTimerRef.current);
      if (vuTimerRef.current) window.clearInterval(vuTimerRef.current);
      if (crackleSourceRef.current) {
        try {
          crackleSourceRef.current.stop();
        } catch {
          // ignore
        }
      }
      if (externalAudioRef.current) {
        externalAudioRef.current.pause();
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const togglePlay = useCallback(() => {
    setIsPlaying((prev) => {
      const next = !prev;
      playNeedleSound(next ? 'drop' : 'lift');
      return next;
    });
  }, [playNeedleSound]);

  const startPlayback = useCallback(() => {
    setIsPlaying((prev) => {
      if (!prev) {
        playNeedleSound('drop');
      }
      return true;
    });
  }, [playNeedleSound]);

  const selectTrack = useCallback(
    (index: number) => {
      const clamped = ((index % tracks.length) + tracks.length) % tracks.length;
      setActiveTrackIndex(clamped);
      setGrooveProgress(0);
      stepCountRef.current = 0;
      playNeedleSound('drop');
      setIsPlaying(true);
    },
    [tracks.length, playNeedleSound]
  );

  const nextTrack = useCallback(() => {
    selectTrack(activeTrackIndex + 1);
  }, [activeTrackIndex, selectTrack]);

  const prevTrack = useCallback(() => {
    selectTrack(activeTrackIndex - 1);
  }, [activeTrackIndex, selectTrack]);

  const scratchDisc = useCallback(() => {
    playNeedleSound('scrub');
    setGrooveProgress((prev) => (prev + 0.12) % 1);
  }, [playNeedleSound]);

  const toggleRpm = useCallback(() => {
    setRpm((prev) => (prev === 33 ? 45 : 33));
    playNeedleSound('scrub');
  }, [playNeedleSound]);

  return {
    tracks,
    activeTrack,
    activeTrackIndex,
    isPlaying,
    rpm,
    pitchPercent,
    crackleEnabled,
    volume,
    vuLevels,
    tonearmAngle,
    speedMultiplier,
    togglePlay,
    startPlayback,
    selectTrack,
    nextTrack,
    prevTrack,
    scratchDisc,
    toggleRpm,
    setPitchPercent,
    setCrackleEnabled,
    setVolume,
  };
}
