'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Sparkles, Ticket, Volume2 } from 'lucide-react';
import type { GuestGroup, InvitationConfig } from '@/types/invitation.types';

interface EnvelopeOpenerProps {
  config: InvitationConfig;
  guestGroup?: GuestGroup | null;
  isOpen: boolean;
  onOpen: () => void;
}

export function EnvelopeOpener({
  config,
  guestGroup,
  isOpen,
  onOpen,
}: EnvelopeOpenerProps) {
  const [isOpening, setIsOpening] = useState(false);
  const { colors, envelope, fonts } = config.theme;

  const handleTriggerOpen = () => {
    if (isOpening) return;
    setIsOpening(true);

    try {
      confetti({
        particleCount: 55,
        spread: 70,
        origin: { y: 0.6 },
        colors: [colors.accentPrimary, colors.accentSecondary, '#FFFFFF'],
      });
    } catch {
      // Ignore if canvas-confetti fails in headless environments
    }

    setTimeout(() => {
      onOpen();
      setIsOpening(false);
    }, 850);
  };

  return (
    <AnimatePresence>
      {!isOpen && (
        <motion.div
          key="envelope-overlay"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.06, filter: 'blur(8px)' }}
          transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
          style={{
            backgroundColor: colors.bgPrimary,
            color: colors.textPrimary,
          }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden px-6 py-10 select-none"
        >
          {/* Marco decorativo sutil */}
          <div
            className="pointer-events-none absolute inset-4 rounded-2xl border opacity-30 md:inset-8"
            style={{ borderColor: colors.accentPrimary }}
          />

          <motion.div
            animate={
              isOpening
                ? { y: -30, scale: 0.94, rotateX: 18, opacity: 0 }
                : { y: 0, scale: 1, rotateX: 0, opacity: 1 }
            }
            transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
            className="relative z-10 flex w-full max-w-md flex-col items-center text-center"
          >
            {/* Etiqueta de pase nominal personalizada si hay guestGroup */}
            <div
              className="mb-6 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs tracking-[0.2em] uppercase shadow-xs"
              style={{
                borderColor: `${colors.accentPrimary}55`,
                backgroundColor: colors.bgSecondary,
                color: colors.textPrimary,
              }}
            >
              <Sparkles
                className="h-3.5 w-3.5"
                style={{ color: colors.accentPrimary }}
              />
              <span>
                {guestGroup
                  ? `Pase reservado: ${guestGroup.groupName} (${guestGroup.allocatedAdults} Adultos${
                      guestGroup.allocatedChildren > 0
                        ? `, ${guestGroup.allocatedChildren} Niños`
                        : ''
                    })`
                  : config.content.hero.badgeText}
              </span>
            </div>

            <h1
              className="mb-3 text-4xl font-semibold tracking-tight sm:text-5xl"
              style={{ fontFamily: fonts.headingFont }}
            >
              {config.content.hero.mainTitle}
            </h1>

            <p
              className="mb-10 text-sm tracking-widest uppercase opacity-75"
              style={{ color: colors.textMuted }}
            >
              {config.content.hero.tagline}
            </p>

            {/* Tarjeta del Sobre + Sello de Lacre Interactivo */}
            <div
              onClick={handleTriggerOpen}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') handleTriggerOpen();
              }}
              className="group relative flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-2xl border p-8 shadow-2xl transition-transform duration-500 hover:scale-[1.02] active:scale-[0.99]"
              style={{
                backgroundColor: colors.bgSecondary,
                borderColor: `${colors.accentPrimary}44`,
              }}
            >
              {/* Líneas diagonales de sobre clásico */}
              <svg
                className="pointer-events-none absolute inset-0 h-full w-full opacity-25"
                viewBox="0 0 400 260"
                preserveAspectRatio="none"
              >
                <path
                  d="M0,0 L200,140 L400,0"
                  fill="none"
                  stroke={colors.accentPrimary}
                  strokeWidth="1.5"
                />
                <path
                  d="M0,260 L150,115 M400,260 L250,115"
                  fill="none"
                  stroke={colors.accentPrimary}
                  strokeWidth="1"
                />
              </svg>

              {/* Sello de Lacre / Botón Central */}
              <motion.div
                whileHover={{ scale: 1.08, rotate: 3 }}
                whileTap={{ scale: 0.92 }}
                animate={
                  isOpening
                    ? { scale: [1, 1.25, 0], rotate: 15 }
                    : { scale: [1, 1.04, 1] }
                }
                transition={
                  isOpening
                    ? { duration: 0.5 }
                    : { duration: 2.6, repeat: Infinity, ease: 'easeInOut' }
                }
                style={{
                  backgroundColor: envelope.sealColor || colors.accentPrimary,
                  boxShadow: `0 12px 30px -6px ${envelope.sealColor || colors.accentPrimary}88`,
                }}
                className="relative z-10 flex h-24 w-24 flex-col items-center justify-center rounded-full border-4 border-white/30 text-white shadow-xl"
              >
                {envelope.variant === 'pass-ticket-tear' ? (
                  <Ticket className="h-8 w-8" />
                ) : (
                  <span
                    className="text-xl font-bold tracking-wider"
                    style={{ fontFamily: fonts.headingFont }}
                  >
                    {envelope.sealMonogram}
                  </span>
                )}
              </motion.div>

              <p className="mt-6 text-xs font-medium tracking-[0.18em] uppercase opacity-85">
                {envelope.openButtonText}
              </p>
            </div>

            {config.audio.enabled && (
              <div className="mt-6 flex items-center gap-2 text-xs opacity-65">
                <Volume2 className="h-3.5 w-3.5" />
                <span>Incluye experiencia musical al abrir</span>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
