'use client';

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { QRCodeSVG } from 'qrcode.react';
import { toast } from 'sonner';
import {
  Calendar,
  Check,
  Clock,
  Copy,
  CreditCard,
  Gift,
  Heart,
  Hotel,
  MapPin,
  Mic,
  Music,
  Navigation,
  Sparkles,
  Ticket,
  Users,
} from 'lucide-react';
import type {
  GuestGroup,
  InvitationConfig,
  TemplateId,
} from '@/types/invitation.types';
import {
  buildGoogleCalendarUrl,
  buildIcsFileContent,
} from '@/lib/calendar/ics-generator';
import { AmbientParticlesCanvas } from './AmbientParticlesCanvas';
import { EnvelopeOpener } from './EnvelopeOpener';
import { FloatingAudioPlayer } from './FloatingAudioPlayer';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface InvitationRendererProps {
  slug: string;
  templateId: TemplateId;
  eventDate: string;
  config: InvitationConfig;
  guestGroup?: GuestGroup | null;
  forceEnvelopeOpen?: boolean;
  isBuilderPreview?: boolean;
}

export function InvitationRenderer({
  slug,
  templateId,
  eventDate,
  config,
  guestGroup,
  forceEnvelopeOpen = false,
  isBuilderPreview = false,
}: InvitationRendererProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(forceEnvelopeOpen);
  const [copiedClabe, setCopiedClabe] = useState(false);

  // Estado Cuenta Regresiva
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Estado DJ Song Requests
  const [songQuery, setSongQuery] = useState('');
  const [songArtist, setSongArtist] = useState('');
  const [songsList, setSongsList] = useState([
    {
      id: '1',
      title: 'September',
      artist: 'Earth, Wind & Fire',
      suggestedBy: 'Familia Villarreal',
      votes: 14,
    },
    {
      id: '2',
      title: 'Vivir Mi Vida',
      artist: 'Marc Anthony',
      suggestedBy: 'Tíos Mendoza',
      votes: 11,
    },
    {
      id: '3',
      title: 'Can’t Stop the Feeling!',
      artist: 'Justin Timberlake',
      suggestedBy: 'Amigos Uni',
      votes: 9,
    },
  ]);

  // Estado RSVP y Pase VIP QR
  const maxAdults = guestGroup ? guestGroup.allocatedAdults : 4;
  const maxChildren = guestGroup ? guestGroup.allocatedChildren : 2;
  const [rsvpName, setRsvpName] = useState(guestGroup?.groupName || '');
  const [rsvpPhone, setRsvpPhone] = useState(guestGroup?.whatsappPhone || '');
  const [willAttend, setWillAttend] = useState<'yes' | 'no'>('yes');
  const [confirmedAdults, setConfirmedAdults] = useState(
    guestGroup ? guestGroup.allocatedAdults : 2
  );
  const [confirmedChildren, setConfirmedChildren] = useState(
    guestGroup ? guestGroup.allocatedChildren : 0
  );
  const [dietaryNotes, setDietaryNotes] = useState('');
  const [guestMessage, setGuestMessage] = useState('');
  const [generatedPass, setGeneratedPass] = useState<{
    qrPayload: string;
    groupName: string;
    adults: number;
    children: number;
    tableName: string;
  } | null>(null);

  useEffect(() => {
    setIsEnvelopeOpen(forceEnvelopeOpen);
  }, [forceEnvelopeOpen]);

  // Reloj de cuenta regresiva
  useEffect(() => {
    const updateCountdown = () => {
      const target = new Date(eventDate).getTime();
      const now = Date.now();
      const diff = Math.max(0, target - now);

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / 1000 / 60) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      });
    };

    updateCountdown();
    const timer = setInterval(updateCountdown, 1000);
    return () => clearInterval(timer);
  }, [eventDate]);

  // Coreografías GSAP ScrollTrigger por sección
  useGSAP(
    () => {
      if (!isEnvelopeOpen && !isBuilderPreview) return;

      const sections = gsap.utils.toArray<HTMLElement>('.inv-reveal-section');
      sections.forEach((sec) => {
        gsap.fromTo(
          sec,
          { y: 42, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.9,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: sec,
              start: 'top 86%',
              toggleActions: 'play none none reverse',
            },
          }
        );
      });

      const maskImages = gsap.utils.toArray<HTMLElement>('.inv-mask-image');
      maskImages.forEach((img) => {
        gsap.fromTo(
          img,
          { scale: 1.12 },
          {
            scale: 1,
            duration: 1.4,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: img,
              start: 'top 85%',
              scrub: 0.6,
            },
          }
        );
      });
    },
    { scope: containerRef, dependencies: [isEnvelopeOpen, templateId] }
  );

  const { colors, fonts } = config.theme;
  const { content } = config;

  const isSectionEnabled = (id: string) =>
    config.sectionsOrder.find((s) => s.id === id)?.enabled ?? true;

  const handleCopyClabe = async (clabe: string) => {
    try {
      await navigator.clipboard.writeText(clabe);
      setCopiedClabe(true);
      toast.success('¡CLABE copiada al portapapeles!');
      setTimeout(() => setCopiedClabe(false), 2500);
    } catch {
      toast.error('No se pudo copiar automáticamente');
    }
  };

  const handleDownloadIcs = () => {
    const icsContent = buildIcsFileContent({
      title: content.hero.mainTitle,
      description: `Invitación Digital: ${content.hero.mainTitle}`,
      location:
        content.locations[0]?.address || content.hero.tagline,
      startDateIso: eventDate,
    });
    const blob = new Blob([icsContent], {
      type: 'text/calendar;charset=utf-8',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${slug}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Archivo de calendario descargado');
  };

  const handleAddSong = (e: React.FormEvent) => {
    e.preventDefault();
    if (!songQuery.trim()) return;
    setSongsList((prev) => [
      {
        id: String(Date.now()),
        title: songQuery.trim(),
        artist: songArtist.trim() || 'Artista invitado',
        suggestedBy: rsvpName || guestGroup?.groupName || 'Invitado',
        votes: 1,
      },
      ...prev,
    ]);
    setSongQuery('');
    setSongArtist('');
    toast.success('¡Canción agregada a la playlist de la fiesta!');
  };

  const handleSubmitRsvp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) {
      toast.error('Por favor ingresa tu nombre o familia');
      return;
    }

    if (willAttend === 'no') {
      setGeneratedPass(null);
      toast.success(
        'Hemos registrado tu respuesta. ¡Gracias por avisarnos con tiempo!'
      );
      return;
    }

    const tokenFragment = guestGroup?.guestToken || 'open-pass';
    const qrPayload = `INV1:${slug}:${tokenFragment}:${confirmedAdults}:${confirmedChildren}:9f8a7b6c5d4e3f21`;

    setGeneratedPass({
      qrPayload,
      groupName: rsvpName.trim(),
      adults: confirmedAdults,
      children: confirmedChildren,
      tableName: guestGroup?.tableName || 'Mesa 4 • Recepción Principal',
    });
    toast.success('¡Asistencia confirmada! Tu Pase VIP QR ha sido generado.');
  };

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: colors.bgPrimary,
        color: colors.textPrimary,
        fontFamily: fonts.bodyFont,
      }}
      className="relative min-h-dvh w-full overflow-x-hidden selection:bg-amber-500/20"
    >
      {/* 1. Sobre de Apertura Interactivo */}
      {!isBuilderPreview && (
        <EnvelopeOpener
          config={config}
          guestGroup={guestGroup}
          isOpen={isEnvelopeOpen}
          onOpen={() => setIsEnvelopeOpen(true)}
        />
      )}

      {/* 2. Efecto Ambiental en Canvas a 60fps */}
      <AmbientParticlesCanvas
        effect={config.theme.ambientEffect}
        accentColor={colors.accentPrimary}
      />

      {/* 3. Reproductor Flotante */}
      <FloatingAudioPlayer
        enabled={config.audio.enabled}
        trackUrl={config.audio.trackUrl}
        trackTitle={config.audio.trackTitle}
        isEnvelopeOpen={isEnvelopeOpen}
        accentColor={colors.accentPrimary}
      />

      {/* SECCIÓN 1: HERO / PORTADA PRINCIPAL */}
      {isSectionEnabled('hero') && (
        <section className="relative flex min-h-dvh flex-col items-center justify-end overflow-hidden px-6 pb-16 pt-28 text-center">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              src={content.hero.coverImageUrl}
              alt={content.hero.mainTitle}
              style={{
                objectPosition: `${content.hero.focalPoint.x}% ${content.hero.focalPoint.y}%`,
              }}
              className="inv-mask-image h-full w-full object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to bottom, ${colors.bgPrimary}33 0%, ${colors.bgPrimary}66 55%, ${colors.bgPrimary} 100%)`,
              }}
            />
          </div>

          <div className="relative z-10 mx-auto max-w-3xl">
            {guestGroup && (
              <div
                className=" mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-medium tracking-widest uppercase backdrop-blur-md"
                style={{
                  borderColor: colors.accentPrimary,
                  backgroundColor: `${colors.bgPrimary}CC`,
                }}
              >
                <Sparkles
                  className="h-3.5 w-3.5"
                  style={{ color: colors.accentPrimary }}
                />
                <span>
                  Invitación exclusiva para {guestGroup.groupName}
                </span>
              </div>
            )}

            <p
              className="mb-3 text-xs font-semibold tracking-[0.32em] uppercase"
              style={{ color: colors.accentPrimary }}
            >
              {content.hero.badgeText}
            </p>

            <h1
              className="mb-4 text-5xl leading-[1.08] font-semibold tracking-tight sm:text-7xl"
              style={{ fontFamily: fonts.headingFont }}
            >
              {content.hero.mainTitle}
            </h1>

            <p
              className="mx-auto max-w-xl text-sm tracking-[0.18em] uppercase sm:text-base"
              style={{ color: colors.textMuted }}
            >
              {content.hero.tagline}
            </p>
          </div>
        </section>
      )}

      {/* SECCIÓN 2: FRASE EMOTIVA E HISTORIA */}
      {isSectionEnabled('quote_story') && (
        <section
          className="inv-reveal-section mx-auto max-w-3xl px-6 py-20 text-center"
        >
          <div
            className="mx-auto mb-6 h-12 w-px"
            style={{ backgroundColor: colors.accentPrimary }}
          />
          <blockquote
            className="text-2xl leading-relaxed italic sm:text-3xl"
            style={{ fontFamily: fonts.headingFont }}
          >
            {content.quoteStory.quoteText}
          </blockquote>
          {content.quoteStory.quoteAuthor && (
            <p
              className="mt-4 text-xs font-semibold tracking-[0.25em] uppercase"
              style={{ color: colors.accentPrimary }}
            >
              — {content.quoteStory.quoteAuthor}
            </p>
          )}

          {content.quoteStory.storyBlocks &&
            content.quoteStory.storyBlocks.length > 0 && (
              <div className="mt-12 grid gap-6 sm:grid-cols-2">
                {content.quoteStory.storyBlocks.map((block, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border p-6 text-left"
                    style={{
                      backgroundColor: colors.bgSecondary,
                      borderColor: `${colors.accentPrimary}30`,
                    }}
                  >
                    <span
                      className="text-xs font-bold tracking-widest uppercase"
                      style={{ color: colors.accentPrimary }}
                    >
                      0{idx + 1}
                    </span>
                    <h3
                      className="mt-1 text-xl font-semibold"
                      style={{ fontFamily: fonts.headingFont }}
                    >
                      {block.title}
                    </h3>
                    <p
                      className="mt-2 text-sm leading-relaxed"
                      style={{ color: colors.textMuted }}
                    >
                      {block.description}
                    </p>
                  </div>
                ))}
              </div>
            )}
        </section>
      )}

      {/* SECCIÓN 3: PADRES Y PADRINOS DE HONOR */}
      {isSectionEnabled('vip_parents') &&
        content.vipParents.groups.length > 0 && (
          <section
            className="inv-reveal-section px-6 py-16"
            style={{ backgroundColor: colors.bgSecondary }}
          >
            <div className="mx-auto max-w-4xl text-center">
              <p
                className="mx-auto mb-10 max-w-xl text-sm tracking-[0.15em] uppercase"
                style={{ color: colors.textMuted }}
              >
                {content.vipParents.blessingMessage}
              </p>

              <div className="grid gap-8 sm:grid-cols-3">
                {content.vipParents.groups.map((grp, idx) => (
                  <div
                    key={idx}
                    className="rounded-2xl border p-6"
                    style={{
                      backgroundColor: colors.bgPrimary,
                      borderColor: `${colors.accentPrimary}33`,
                    }}
                  >
                    <h3
                      className="mb-3 text-xs font-bold tracking-[0.22em] uppercase"
                      style={{ color: colors.accentPrimary }}
                    >
                      {grp.groupTitle}
                    </h3>
                    <div className="space-y-1.5">
                      {grp.names.map((person, pIdx) => (
                        <p
                          key={pIdx}
                          className="text-lg font-medium"
                          style={{ fontFamily: fonts.headingFont }}
                        >
                          {person}
                        </p>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

      {/* SECCIÓN 4: CUENTA REGRESIVA + AGENDAR EN CALENDARIO */}
      {isSectionEnabled('countdown') && (
        <section className="inv-reveal-section mx-auto max-w-3xl px-6 py-20 text-center">
          <p
            className="mb-2 text-xs font-semibold tracking-[0.25em] uppercase"
            style={{ color: colors.accentPrimary }}
          >
            Falta cada vez menos
          </p>
          <h2
            className="mb-10 text-3xl font-semibold sm:text-4xl"
            style={{ fontFamily: fonts.headingFont }}
          >
            Cuenta Regresiva para el Gran Día
          </h2>

          <div className="mx-auto grid max-w-lg grid-cols-4 gap-3 sm:gap-5">
            {[
              { label: 'Días', value: timeLeft.days },
              { label: 'Horas', value: timeLeft.hours },
              { label: 'Minutos', value: timeLeft.minutes },
              { label: 'Segundos', value: timeLeft.seconds },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col items-center justify-center rounded-2xl border py-5 shadow-xs"
                style={{
                  backgroundColor: colors.bgSecondary,
                  borderColor: `${colors.accentPrimary}35`,
                }}
              >
                <span
                  className="text-3xl font-bold tabular-nums sm:text-4xl"
                  style={{ fontFamily: fonts.headingFont }}
                >
                  {String(item.value).padStart(2, '0')}
                </span>
                <span
                  className="mt-1 text-[11px] tracking-widest uppercase"
                  style={{ color: colors.textMuted }}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href={buildGoogleCalendarUrl({
                title: content.hero.mainTitle,
                description: `Invitación Digital: ${content.hero.mainTitle}`,
                location:
                  content.locations[0]?.address || content.hero.tagline,
                startDateIso: eventDate,
              })}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                backgroundColor: colors.accentPrimary,
                color: '#FFFFFF',
              }}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-xs font-semibold tracking-wider uppercase shadow-md transition-transform hover:scale-105"
            >
              <Calendar className="h-4 w-4" />
              Agendar en Google Calendar
            </a>

            <button
              type="button"
              onClick={handleDownloadIcs}
              style={{
                borderColor: colors.accentPrimary,
                color: colors.textPrimary,
              }}
              className="inline-flex items-center gap-2 rounded-full border px-6 py-3 text-xs font-semibold tracking-wider uppercase transition-transform hover:scale-105"
            >
              <Calendar className="h-4 w-4" />
              Apple Calendar / Outlook (.ics)
            </button>
          </div>
        </section>
      )}

      {/* SECCIÓN 5: UBICACIONES Y BOTONES CTA GOOGLE MAPS / WAZE */}
      {isSectionEnabled('locations') && content.locations.length > 0 && (
        <section
          className="inv-reveal-section px-6 py-20"
          style={{ backgroundColor: colors.bgSecondary }}
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <p
                className="mb-2 text-xs font-semibold tracking-[0.25em] uppercase"
                style={{ color: colors.accentPrimary }}
              >
                Dónde y Cuándo
              </p>
              <h2
                className="text-3xl font-semibold sm:text-4xl"
                style={{ fontFamily: fonts.headingFont }}
              >
                Ubicaciones del Evento
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {content.locations.map((loc) => (
                <div
                  key={loc.id}
                  className="flex flex-col overflow-hidden rounded-3xl border shadow-sm"
                  style={{
                    backgroundColor: colors.bgPrimary,
                    borderColor: `${colors.accentPrimary}30`,
                  }}
                >
                  {loc.imageUrl && (
                    <div className="h-52 w-full overflow-hidden">
                      <img
                        src={loc.imageUrl}
                        alt={loc.venueName}
                        className="inv-mask-image h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col justify-between p-6 sm:p-8">
                    <div>
                      <div className="mb-2 inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase"
                        style={{ color: colors.accentPrimary }}
                      >
                        <Clock className="h-3.5 w-3.5" />
                        <span>{loc.time} • {loc.title}</span>
                      </div>
                      <h3
                        className="text-2xl font-semibold"
                        style={{ fontFamily: fonts.headingFont }}
                      >
                        {loc.venueName}
                      </h3>
                      <p
                        className="mt-2 flex items-start gap-2 text-sm leading-relaxed"
                        style={{ color: colors.textMuted }}
                      >
                        <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                        <span>{loc.address}</span>
                      </p>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3 pt-4">
                      <a
                        href={loc.googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          backgroundColor: colors.accentPrimary,
                          color: '#FFFFFF',
                        }}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-semibold tracking-wider uppercase shadow-xs transition-opacity hover:opacity-90"
                      >
                        <MapPin className="h-4 w-4" />
                        Google Maps
                      </a>
                      <a
                        href={loc.wazeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          borderColor: `${colors.accentPrimary}66`,
                          color: colors.textPrimary,
                        }}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-semibold tracking-wider uppercase transition-opacity hover:opacity-80"
                      >
                        <Navigation className="h-4 w-4" />
                        Abrir en Waze
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECCIÓN 6: ITINERARIO / TIMELINE ANIMADO */}
      {isSectionEnabled('timeline') && content.timeline.length > 0 && (
        <section className="inv-reveal-section mx-auto max-w-3xl px-6 py-20">
          <div className="mb-12 text-center">
            <p
              className="mb-2 text-xs font-semibold tracking-[0.25em] uppercase"
              style={{ color: colors.accentPrimary }}
            >
              Minuto a Minuto
            </p>
            <h2
              className="text-3xl font-semibold sm:text-4xl"
              style={{ fontFamily: fonts.headingFont }}
            >
              Itinerario del Evento
            </h2>
          </div>

          <div className="relative mx-auto max-w-xl pl-8">
            <div
              className="absolute top-2 bottom-2 left-3 w-0.5"
              style={{ backgroundColor: `${colors.accentPrimary}45` }}
            />
            <div className="space-y-8">
              {content.timeline.map((item) => (
                <div key={item.id} className="relative">
                  <div
                    className="absolute top-1.5 -left-6.5 h-3.5 w-3.5 rounded-full border-2"
                    style={{
                      backgroundColor: colors.accentPrimary,
                      borderColor: colors.bgPrimary,
                    }}
                  />
                  <span
                    className="text-xs font-bold tracking-widest uppercase"
                    style={{ color: colors.accentPrimary }}
                  >
                    {item.time}
                  </span>
                  <h3
                    className="mt-0.5 text-xl font-semibold"
                    style={{ fontFamily: fonts.headingFont }}
                  >
                    {item.title}
                  </h3>
                  {item.description && (
                    <p
                      className="mt-1 text-sm"
                      style={{ color: colors.textMuted }}
                    >
                      {item.description}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECCIÓN 7: GALERÍA MULTIMEDIA */}
      {isSectionEnabled('gallery') && content.gallery.images.length > 0 && (
        <section
          className="inv-reveal-section px-6 py-20"
          style={{ backgroundColor: colors.bgSecondary }}
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center">
              <p
                className="mb-2 text-xs font-semibold tracking-[0.25em] uppercase"
                style={{ color: colors.accentPrimary }}
              >
                Momentos Inolvidables
              </p>
              <h2
                className="text-3xl font-semibold sm:text-4xl"
                style={{ fontFamily: fonts.headingFont }}
              >
                Nuestra Galería
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {content.gallery.images.map((img, idx) => (
                <div
                  key={idx}
                  className="group relative aspect-3/4 overflow-hidden rounded-2xl shadow-sm"
                >
                  <img
                    src={img.url}
                    alt={img.caption || `Foto ${idx + 1}`}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {img.caption && (
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-3 text-xs text-white">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECCIÓN 8: CÓDIGO DE VESTIMENTA (DRESS CODE) */}
      {isSectionEnabled('dress_code') && (
        <section className="inv-reveal-section mx-auto max-w-3xl px-6 py-20 text-center">
          <p
            className="mb-2 text-xs font-semibold tracking-[0.25em] uppercase"
            style={{ color: colors.accentPrimary }}
          >
            Dress Code
          </p>
          <h2
            className="mb-8 text-3xl font-semibold sm:text-4xl"
            style={{ fontFamily: fonts.headingFont }}
          >
            {content.dressCode.title}
          </h2>

          <div className="grid gap-6 sm:grid-cols-2">
            <div
              className="rounded-2xl border p-6"
              style={{
                backgroundColor: colors.bgSecondary,
                borderColor: `${colors.accentPrimary}30`,
              }}
            >
              <h3 className="text-sm font-bold tracking-widest uppercase">
                Mujeres
              </h3>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: colors.textMuted }}
              >
                {content.dressCode.womenNotes}
              </p>
            </div>
            <div
              className="rounded-2xl border p-6"
              style={{
                backgroundColor: colors.bgSecondary,
                borderColor: `${colors.accentPrimary}30`,
              }}
            >
              <h3 className="text-sm font-bold tracking-widest uppercase">
                Hombres
              </h3>
              <p
                className="mt-2 text-sm leading-relaxed"
                style={{ color: colors.textMuted }}
              >
                {content.dressCode.menNotes}
              </p>
            </div>
          </div>

          {content.dressCode.reservedColors.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-center gap-3">
                {content.dressCode.reservedColors.map((swatch, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1">
                    <span
                      className="h-9 w-9 rounded-full border shadow-xs"
                      style={{
                        backgroundColor: swatch.hex,
                        borderColor: `${colors.textPrimary}22`,
                      }}
                    />
                    <span className="text-[11px] opacity-75">
                      {swatch.name}
                    </span>
                  </div>
                ))}
              </div>
              <p
                className="mt-3 text-xs italic"
                style={{ color: colors.textMuted }}
              >
                {content.dressCode.reservedNote}
              </p>
            </div>
          )}
        </section>
      )}

      {/* SECCIÓN 9: MESA DE REGALOS Y TRANSFERENCIA CLABE 1-CLIC */}
      {isSectionEnabled('gifts') && (
        <section
          className="inv-reveal-section px-6 py-20"
          style={{ backgroundColor: colors.bgSecondary }}
        >
          <div className="mx-auto max-w-4xl text-center">
            <Gift
              className="mx-auto mb-3 h-8 w-8"
              style={{ color: colors.accentPrimary }}
            />
            <h2
              className="mb-3 text-3xl font-semibold sm:text-4xl"
              style={{ fontFamily: fonts.headingFont }}
            >
              Mesa de Regalos y Lluvia de Sobres
            </h2>
            <p
              className="mx-auto mb-10 max-w-2xl text-sm leading-relaxed"
              style={{ color: colors.textMuted }}
            >
              {content.gifts.introMessage}
            </p>

            <div className="grid gap-6 md:grid-cols-2">
              {content.gifts.registries.map((reg, idx) => (
                <div
                  key={idx}
                  className="flex flex-col justify-between rounded-2xl border p-6 text-left"
                  style={{
                    backgroundColor: colors.bgPrimary,
                    borderColor: `${colors.accentPrimary}35`,
                  }}
                >
                  <div>
                    <span
                      className="text-xs font-bold tracking-widest uppercase"
                      style={{ color: colors.accentPrimary }}
                    >
                      Tienda Departamental / Online
                    </span>
                    <h3
                      className="mt-1 text-2xl font-semibold"
                      style={{ fontFamily: fonts.headingFont }}
                    >
                      {reg.storeName}
                    </h3>
                    {reg.eventNumber && (
                      <p
                        className="mt-1 text-sm"
                        style={{ color: colors.textMuted }}
                      >
                        {reg.eventNumber}
                      </p>
                    )}
                  </div>
                  <a
                    href={reg.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      backgroundColor: colors.accentPrimary,
                      color: '#FFFFFF',
                    }}
                    className="mt-6 inline-flex items-center justify-center rounded-xl px-5 py-3 text-xs font-semibold tracking-wider uppercase"
                  >
                    Ver Mesa de Regalos
                  </a>
                </div>
              ))}

              {content.gifts.bankTransfer?.enabled && (
                <div
                  className="flex flex-col justify-between rounded-2xl border p-6 text-left md:col-span-2"
                  style={{
                    backgroundColor: colors.bgPrimary,
                    borderColor: `${colors.accentPrimary}55`,
                  }}
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div
                        className="inline-flex items-center gap-1.5 text-xs font-bold tracking-widest uppercase"
                        style={{ color: colors.accentPrimary }}
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>Transferencia Bancaria / Lluvia de Sobres Digital</span>
                      </div>
                      <h3
                        className="mt-1 text-xl font-semibold"
                        style={{ fontFamily: fonts.headingFont }}
                      >
                        {content.gifts.bankTransfer.bankName} —{' '}
                        {content.gifts.bankTransfer.accountHolder}
                      </h3>
                      <p className="mt-2 font-mono text-base font-semibold tracking-wider">
                        CLABE: {content.gifts.bankTransfer.clabe}
                      </p>
                      {content.gifts.bankTransfer.conceptNote && (
                        <p
                          className="mt-1 text-xs"
                          style={{ color: colors.textMuted }}
                        >
                          Concepto sugerido: {content.gifts.bankTransfer.conceptNote}
                        </p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleCopyClabe(content.gifts.bankTransfer!.clabe)
                      }
                      style={{
                        backgroundColor: colors.accentPrimary,
                        color: '#FFFFFF',
                      }}
                      className="inline-flex items-center gap-2 rounded-xl px-5 py-3 text-xs font-semibold tracking-wider uppercase shadow-xs transition-transform active:scale-95"
                    >
                      {copiedClabe ? (
                        <>
                          <Check className="h-4 w-4" />
                          ¡CLABE Copiada!
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4" />
                          Copiar CLABE en 1 Clic
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* SECCIÓN 10: HOSPEDAJE SUGERIDO */}
      {isSectionEnabled('accommodation') &&
        content.accommodation.length > 0 && (
          <section className="inv-reveal-section mx-auto max-w-4xl px-6 py-20">
            <div className="mb-10 text-center">
              <Hotel
                className="mx-auto mb-3 h-7 w-7"
                style={{ color: colors.accentPrimary }}
              />
              <h2
                className="text-3xl font-semibold sm:text-4xl"
                style={{ fontFamily: fonts.headingFont }}
              >
                Sugerencias de Hospedaje
              </h2>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              {content.accommodation.map((hotel, idx) => (
                <div
                  key={idx}
                  className="rounded-2xl border p-6"
                  style={{
                    backgroundColor: colors.bgSecondary,
                    borderColor: `${colors.accentPrimary}30`,
                  }}
                >
                  <h3
                    className="text-xl font-semibold"
                    style={{ fontFamily: fonts.headingFont }}
                  >
                    {hotel.hotelName}
                  </h3>
                  <p
                    className="mt-1 text-sm"
                    style={{ color: colors.textMuted }}
                  >
                    {hotel.distanceNote}
                  </p>
                  {hotel.discountCode && (
                    <div
                      className="mt-3 inline-block rounded-lg border px-3 py-1 text-xs font-semibold"
                      style={{ borderColor: colors.accentPrimary }}
                    >
                      Código de convenio: {hotel.discountCode}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

      {/* SECCIÓN 11: FEATURES DIFERENCIADORAS — DJ PLAYLIST & AUDIO GUESTBOOK */}
      {isSectionEnabled('social_features') && (
        <section
          className="inv-reveal-section px-6 py-20"
          style={{ backgroundColor: colors.bgSecondary }}
        >
          <div className="mx-auto max-w-4xl">
            <div className="mb-10 text-center">
              <span
                className="text-xs font-bold tracking-[0.25em] uppercase"
                style={{ color: colors.accentPrimary }}
              >
                Experiencia Interactiva
              </span>
              <h2
                className="mt-1 text-3xl font-semibold sm:text-4xl"
                style={{ fontFamily: fonts.headingFont }}
              >
                Playlist para el DJ & Libro de Firmas Vocal
              </h2>
              {content.socialFeatures.hashtag && (
                <p
                  className="mt-2 text-sm font-semibold"
                  style={{ color: colors.accentPrimary }}
                >
                  Comparte tus historias usando {content.socialFeatures.hashtag}
                </p>
              )}
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {/* DJ Playlist Colaborativa */}
              <div
                className="rounded-3xl border p-6"
                style={{
                  backgroundColor: colors.bgPrimary,
                  borderColor: `${colors.accentPrimary}35`,
                }}
              >
                <div className="mb-4 flex items-center gap-2">
                  <Music
                    className="h-5 w-5"
                    style={{ color: colors.accentPrimary }}
                  />
                  <h3 className="text-lg font-semibold">
                    ¿Qué canción no puede faltar en la pista?
                  </h3>
                </div>

                <form onSubmit={handleAddSong} className="mb-5 space-y-2.5">
                  <input
                    type="text"
                    value={songQuery}
                    onChange={(e) => setSongQuery(e.target.value)}
                    placeholder="Nombre de la canción..."
                    className="w-full rounded-xl border bg-transparent px-3.5 py-2.5 text-base outline-none"
                    style={{ borderColor: `${colors.accentPrimary}44` }}
                  />
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={songArtist}
                      onChange={(e) => setSongArtist(e.target.value)}
                      placeholder="Artista o grupo..."
                      className="flex-1 rounded-xl border bg-transparent px-3.5 py-2.5 text-base outline-none"
                      style={{ borderColor: `${colors.accentPrimary}44` }}
                    />
                    <button
                      type="submit"
                      style={{
                        backgroundColor: colors.accentPrimary,
                        color: '#FFFFFF',
                      }}
                      className="rounded-xl px-4 py-2.5 text-xs font-semibold tracking-wider uppercase"
                    >
                      Sugerir
                    </button>
                  </div>
                </form>

                <div className="space-y-2.5">
                  {songsList.slice(0, 4).map((song) => (
                    <div
                      key={song.id}
                      className="flex items-center justify-between rounded-xl border px-3.5 py-2.5 text-sm"
                      style={{
                        backgroundColor: colors.bgSecondary,
                        borderColor: `${colors.accentPrimary}25`,
                      }}
                    >
                      <div>
                        <p className="font-semibold">{song.title}</p>
                        <p className="text-xs opacity-75">
                          {song.artist} • Por {song.suggestedBy}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSongsList((prev) =>
                            prev.map((s) =>
                              s.id === song.id
                                ? { ...s, votes: s.votes + 1 }
                                : s
                            )
                          )
                        }
                        className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs font-semibold"
                        style={{ borderColor: `${colors.accentPrimary}55` }}
                      >
                        <Heart
                          className="h-3.5 w-3.5"
                          style={{ color: colors.accentPrimary }}
                        />
                        <span>{song.votes}</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Audio Guestbook */}
              <div
                className="flex flex-col justify-between rounded-3xl border p-6"
                style={{
                  backgroundColor: colors.bgPrimary,
                  borderColor: `${colors.accentPrimary}35`,
                }}
              >
                <div>
                  <div className="mb-3 flex items-center gap-2">
                    <Mic
                      className="h-5 w-5"
                      style={{ color: colors.accentPrimary }}
                    />
                    <h3 className="text-lg font-semibold">
                      Audio Guestbook (Libro de Firmas Vocal)
                    </h3>
                  </div>
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: colors.textMuted }}
                  >
                    Graba una nota de voz de hasta 45 segundos con tus mejores
                    deseos. Los festejados podrán escuchar tu mensaje en su
                    álbum digital de recuerdos.
                  </p>
                </div>

                <div
                  className="my-6 flex flex-col items-center justify-center rounded-2xl border border-dashed p-6 text-center"
                  style={{ borderColor: `${colors.accentPrimary}66` }}
                >
                  <button
                    type="button"
                    onClick={() =>
                      toast.info(
                        'Grabadora lista: mantén presionado en tu móvil para grabar tu felicitación.'
                      )
                    }
                    style={{
                      backgroundColor: colors.accentPrimary,
                      color: '#FFFFFF',
                    }}
                    className="flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-transform hover:scale-105 active:scale-95"
                  >
                    <Mic className="h-7 w-7" />
                  </button>
                  <span className="mt-3 text-xs font-semibold tracking-wider uppercase">
                    Toca para grabar mensaje de voz
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* SECCIÓN 12: MÓDULO RSVP INTELIGENTE + PASE VIP QR */}
      {isSectionEnabled('rsvp') && (
        <section className="inv-reveal-section mx-auto max-w-2xl px-6 py-24">
          <div
            className="rounded-3xl border p-6 shadow-xl sm:p-10"
            style={{
              backgroundColor: colors.bgSecondary,
              borderColor: `${colors.accentPrimary}45`,
            }}
          >
            <div className="mb-8 text-center">
              <Users
                className="mx-auto mb-2 h-7 w-7"
                style={{ color: colors.accentPrimary }}
              />
              <h2
                className="text-3xl font-semibold sm:text-4xl"
                style={{ fontFamily: fonts.headingFont }}
              >
                Confirmación de Asistencia (RSVP)
              </h2>
              <p
                className="mt-2 text-sm"
                style={{ color: colors.textMuted }}
              >
                {guestGroup
                  ? `Pase personalizado para ${guestGroup.groupName} (Máximo ${guestGroup.allocatedAdults} adultos${
                      guestGroup.allocatedChildren > 0
                        ? ` y ${guestGroup.allocatedChildren} niños`
                        : ''
                    })`
                  : 'Por favor confirma tu asistencia para generar tu Pase Digital con Código QR'}
              </p>
            </div>

            {!generatedPass ? (
              <form onSubmit={handleSubmitRsvp} className="space-y-5">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                    Nombre de Familia o Invitado
                  </label>
                  <input
                    type="text"
                    required
                    value={rsvpName}
                    readOnly={Boolean(guestGroup)}
                    onChange={(e) => setRsvpName(e.target.value)}
                    placeholder="Ej. Familia López García"
                    className="w-full rounded-xl border px-4 py-3 text-base outline-none"
                    style={{
                      backgroundColor: colors.bgPrimary,
                      borderColor: `${colors.accentPrimary}44`,
                    }}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                      ¿Podrás acompañarnos?
                    </label>
                    <select
                      value={willAttend}
                      onChange={(e) =>
                        setWillAttend(e.target.value as 'yes' | 'no')
                      }
                      className="w-full rounded-xl border px-4 py-3 text-base outline-none"
                      style={{
                        backgroundColor: colors.bgPrimary,
                        borderColor: `${colors.accentPrimary}44`,
                      }}
                    >
                      <option value="yes">¡Sí, ahí estaremos!</option>
                      <option value="no">No podremos asistir</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                      Teléfono WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={rsvpPhone}
                      onChange={(e) => setRsvpPhone(e.target.value)}
                      placeholder="+52 55 1234 5678"
                      className="w-full rounded-xl border px-4 py-3 text-base outline-none"
                      style={{
                        backgroundColor: colors.bgPrimary,
                        borderColor: `${colors.accentPrimary}44`,
                      }}
                    />
                  </div>
                </div>

                {willAttend === 'yes' && (
                  <>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                          Adultos Confirmados (Máx. {maxAdults})
                        </label>
                        <select
                          value={confirmedAdults}
                          onChange={(e) =>
                            setConfirmedAdults(Number(e.target.value))
                          }
                          className="w-full rounded-xl border px-4 py-3 text-base outline-none"
                          style={{
                            backgroundColor: colors.bgPrimary,
                            borderColor: `${colors.accentPrimary}44`,
                          }}
                        >
                          {Array.from(
                            { length: maxAdults },
                            (_, idx) => idx + 1
                          ).map((n) => (
                            <option key={n} value={n}>
                              {n} {n === 1 ? 'Adulto' : 'Adultos'}
                            </option>
                          ))}
                        </select>
                      </div>

                      {config.content.rsvp.allowChildrenSelection &&
                        maxChildren > 0 && (
                          <div>
                            <label className="mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                              Niños Confirmados (Máx. {maxChildren})
                            </label>
                            <select
                              value={confirmedChildren}
                              onChange={(e) =>
                                setConfirmedChildren(Number(e.target.value))
                              }
                              className="w-full rounded-xl border px-4 py-3 text-base outline-none"
                              style={{
                                backgroundColor: colors.bgPrimary,
                                borderColor: `${colors.accentPrimary}44`,
                              }}
                            >
                              {Array.from(
                                { length: maxChildren + 1 },
                                (_, idx) => idx
                              ).map((n) => (
                                <option key={n} value={n}>
                                  {n} {n === 1 ? 'Niño' : 'Niños'}
                                </option>
                              ))}
                            </select>
                          </div>
                        )}
                    </div>

                    {config.content.rsvp.askDietaryRestrictions && (
                      <div>
                        <label className="mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                          Alergias o Restricciones Alimentarias (Opcional)
                        </label>
                        <input
                          type="text"
                          value={dietaryNotes}
                          onChange={(e) => setDietaryNotes(e.target.value)}
                          placeholder="Ej. 1 menú vegetariano, alergia a nueces..."
                          className="w-full rounded-xl border px-4 py-3 text-base outline-none"
                          style={{
                            backgroundColor: colors.bgPrimary,
                            borderColor: `${colors.accentPrimary}44`,
                          }}
                        />
                      </div>
                    )}
                  </>
                )}

                <div>
                  <label className="mb-1.5 block text-xs font-semibold tracking-wider uppercase">
                    Mensaje o Felicitación
                  </label>
                  <textarea
                    rows={3}
                    value={guestMessage}
                    onChange={(e) => setGuestMessage(e.target.value)}
                    placeholder="Escribe tus mejores deseos..."
                    className="w-full rounded-xl border px-4 py-3 text-base outline-none"
                    style={{
                      backgroundColor: colors.bgPrimary,
                      borderColor: `${colors.accentPrimary}44`,
                    }}
                  />
                </div>

                <button
                  type="submit"
                  style={{
                    backgroundColor: colors.accentPrimary,
                    color: '#FFFFFF',
                  }}
                  className="w-full rounded-xl py-4 text-xs font-bold tracking-[0.2em] uppercase shadow-lg transition-transform hover:scale-[1.01] active:scale-[0.99]"
                >
                  Confirmar Asistencia y Generar Pase QR
                </button>
              </form>
            ) : (
              /* PASE DIGITAL VIP CON QR CRIPTOGRÁFICO */
              <div
                className="rounded-2xl border p-6 text-center"
                style={{
                  backgroundColor: colors.bgPrimary,
                  borderColor: colors.accentPrimary,
                }}
              >
                <div
                  className="mb-3 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold tracking-wider uppercase"
                  style={{
                    backgroundColor: `${colors.accentPrimary}20`,
                    color: colors.accentPrimary,
                  }}
                >
                  <Ticket className="h-4 w-4" />
                  <span>Pase de Acceso VIP Confirmado</span>
                </div>

                <h3
                  className="text-2xl font-semibold"
                  style={{ fontFamily: fonts.headingFont }}
                >
                  {generatedPass.groupName}
                </h3>
                <p
                  className="mt-1 text-xs tracking-wider uppercase"
                  style={{ color: colors.textMuted }}
                >
                  Válido por {generatedPass.adults} Adultos
                  {generatedPass.children > 0
                    ? ` y ${generatedPass.children} Niños`
                    : ''}{' '}
                  • {generatedPass.tableName}
                </p>

                <div className="my-6 inline-flex rounded-2xl bg-white p-4 shadow-md">
                  <QRCodeSVG
                    value={generatedPass.qrPayload}
                    size={176}
                    level="M"
                  />
                </div>

                <p
                  className="mx-auto max-w-md text-xs leading-relaxed"
                  style={{ color: colors.textMuted }}
                >
                  {content.rsvp.customConfirmationMessage}
                </p>

                <button
                  type="button"
                  onClick={() => setGeneratedPass(null)}
                  className="mt-5 text-xs font-semibold underline opacity-75 hover:opacity-100"
                >
                  Modificar mi confirmación
                </button>
              </div>
            )}
          </div>
        </section>
      )}

      {/* FOOTER DE LA INVITACIÓN */}
      <footer className="border-t py-10 text-center text-xs opacity-60">
        <p>
          {content.hero.mainTitle} • Invitación Digital Interactiva
        </p>
      </footer>
    </div>
  );
}
