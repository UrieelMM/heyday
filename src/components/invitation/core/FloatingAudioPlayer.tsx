'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

interface FloatingAudioPlayerProps {
  enabled: boolean;
  trackUrl: string;
  trackTitle?: string;
  isEnvelopeOpen: boolean;
  accentColor: string;
}

export function FloatingAudioPlayer({
  enabled,
  trackUrl,
  trackTitle,
  isEnvelopeOpen,
  accentColor,
}: FloatingAudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!enabled || !trackUrl) return;
    const audio = new Audio(trackUrl);
    audio.loop = true;
    audio.preload = 'metadata';
    audio.volume = 0.75;
    audioRef.current = audio;

    const handleVisibilityChange = () => {
      if (document.hidden && audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
        setIsPlaying(false);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      audio.pause();
      audioRef.current = null;
    };
  }, [enabled, trackUrl]);

  useEffect(() => {
    if (isEnvelopeOpen && enabled && audioRef.current && !isPlaying) {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          setIsPlaying(false);
        });
    }
  }, [isEnvelopeOpen, enabled]);

  if (!enabled || !trackUrl) return null;

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
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
