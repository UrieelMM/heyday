'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface FloatingAudioPlayerProps {
  enabled: boolean;
  trackUrl: string;
  trackTitle?: string;
  startSecond?: number;
  autoplayOnEnvelopeOpen?: boolean;
  isEnvelopeOpen: boolean;
  accentColor: string;
}

export function FloatingAudioPlayer({
  enabled,
  trackUrl,
  trackTitle,
  startSecond = 0,
  autoplayOnEnvelopeOpen = true,
  isEnvelopeOpen,
  accentColor,
}: FloatingAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    setIsPlaying(false);
    if (!enabled || !trackUrl) return;
    const audio = new Audio(trackUrl);
    audio.loop = true;
    audio.preload = 'metadata';
    audio.volume = 0.75;
    audio.currentTime = startSecond;
    audioRef.current = audio;

    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);
    audio.addEventListener('play', onPlay);
    audio.addEventListener('pause', onPause);
    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      audio.removeEventListener('play', onPlay);
      audio.removeEventListener('pause', onPause);
      audio.pause();
      audioRef.current = null;
    };
  }, [enabled, trackUrl, startSecond]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!isEnvelopeOpen) audio?.pause();
    else if (autoplayOnEnvelopeOpen && audio?.paused) void audio.play().catch(() => {});
  }, [isEnvelopeOpen, enabled, trackUrl, startSecond, autoplayOnEnvelopeOpen]);

  if (!enabled || !trackUrl) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (!audioRef.current.paused) {
      audioRef.current.pause();
    } else {
      void audioRef.current.play().catch(() => setIsPlaying(false));
    }
  };

  return (
    <button
      type="button"
      onClick={togglePlay}
      title={trackTitle || 'Música de fondo'}
      aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
      style={{
        backgroundColor: accentColor,
      }}
      className="fixed right-5 bottom-5 z-40 flex h-12 w-12 items-center justify-center rounded-full text-white shadow-lg transition-transform hover:scale-105 active:scale-95"
    >
      {isPlaying ? (
        <Volume2 className="h-5 w-5 animate-pulse" />
      ) : (
        <VolumeX className="h-5 w-5 opacity-80" />
      )}
    </button>
  );
}
