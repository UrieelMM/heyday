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
import { isCelebrationTemplateId } from '@/lib/templates/celebration-config';
import { isNewSceneTemplateId } from '@/lib/templates/new-scenes-config';
import { invitationFontStack } from '@/lib/fonts/invitation-fonts';
import {
  isOccasionTemplateId,
  occasionSectionCopy,
} from '@/lib/templates/occasion-config';
import { AmbientParticlesCanvas } from './AmbientParticlesCanvas';
import { EnvelopeOpener } from './EnvelopeOpener';
import { FloatingAudioPlayer } from './FloatingAudioPlayer';
import { HeroMedia } from './HeroMedia';
import { SharedAlbum } from './SharedAlbum';
import { SocialFeatures } from './SocialFeatures';
import { EternalEleganceExperience } from '../templates/EternalEleganceExperience';
import { RoyalXVEnchantedExperience } from '../templates/RoyalXVEnchantedExperience';
import { MiniCosmosExperience } from '../templates/MiniCosmosExperience';
import { AtelierXVExperience } from '../templates/AtelierXVExperience';
import { RitmoDeDosExperience } from '../templates/RitmoDeDosExperience';
import { MareaAzulExperience } from '../templates/MareaAzulExperience';
import { NeonXVEuphoriaExperience } from '../templates/NeonXVEuphoriaExperience';
import { AdventureMap, FiestaKidsAdventureHero, FiestaKidsMarquee, FiestaKidsStations, setupFiestaKidsAdventureScenes } from '../templates/FiestaKidsAdventureExperience';
import { PirateStoryMap, PirateTreasureExperience } from '../templates/PirateTreasureExperience';
import { DinoJungleExperience, DinoStoryFossils } from '../templates/DinoJungleExperience';
import { SafariSunriseExperience, SafariTrailBackdrop } from '../templates/SafariSunriseExperience';
import { CowboyRanchExperience, CowboyTrailBackdrop } from '../templates/CowboyRanchExperience';
import { MickeyMouseBirthdayExperience, MickeyStoryBackdrop } from '../templates/MickeyMouseBirthdayExperience';
import { MinecraftBirthdayExperience, MinecraftStoryMap } from '../templates/MinecraftBirthdayExperience';
import { KidsWorldMarquee, KidsWorldStations, setupKidsWorldScenes } from '../templates/kids-world-shared';
import { isKidsWorldTemplateId } from '@/lib/templates/kids-world-config';
import { isWeddingWorldTemplateId } from '@/lib/templates/wedding-world-config';
import { GlassGardenVowsExperience, GardenStoryTrellis } from '../templates/GlassGardenVowsExperience';
import { MidnightConstellationExperience, ConstellationStorySky } from '../templates/MidnightConstellationExperience';
import { GoldenHarvestVineyardExperience, VineyardStoryVines } from '../templates/GoldenHarvestVineyardExperience';
import { WeddingWorldMarquee, WeddingWorldStations, setupWeddingWorldScenes } from '../templates/wedding-world-shared';
import { isNewWorldTemplateId } from '@/lib/templates/new-world-config';
import { OperaCarmesiExperience, PequenoAtlasExperience, ArchivoFuturoExperience, NewWorldMarquee, NewWorldMoments, NewWorldStoryArt, setupNewWorldScenes } from '../templates/NewWorldExperiences';
import { isStoryWorldTemplateId } from '@/lib/templates/story-world-config';
import { OhanaLiloStitchExperience, OhanaWaveStory } from '../templates/OhanaLiloStitchExperience';
import { SolarPopXVExperience, SolarPopStory } from '../templates/SolarPopXVExperience';
import { CafeParaSiempreExperience, CafeMenuStory } from '../templates/CafeParaSiempreExperience';
import { StoryWorldMarquee, StoryWorldMoments, setupStoryWorldScenes } from '../templates/story-world-shared';
import { SignatureHero } from '../templates/SignatureHero';
import { setupSignatureScenes } from '../templates/signature-scenes';
import { CelebrationHero } from '../templates/CelebrationHero';
import { setupCelebrationScenes } from '../templates/celebration-scenes';
import { OccasionHero } from '../templates/OccasionHero';
import { setupOccasionScenes } from '../templates/occasion-scenes';
import { NewSceneHero } from '../templates/NewSceneHero';
import { setupNewScenes } from '../templates/new-scenes';
import '../templates/signature-templates.css';
import '../templates/celebration-templates.css';
import '../templates/occasion-templates.css';
import '../templates/new-scenes.css';
import '../templates/fiesta-kids-adventure.css';
import '../templates/kids-world.css';
import '../templates/pirate-treasure-voyage.css';
import '../templates/dino-jungle-expedition.css';
import '../templates/safari-sunrise-adventure.css';
import '../templates/cowboy-ranch-roundup.css';
import '../templates/mickey-mouse-birthday.css';
import '../templates/minecraft-birthday.css';
import '../templates/wedding-world.css';
import '../templates/glass-garden-vows.css';
import '../templates/midnight-constellation.css';
import '../templates/golden-harvest-vineyard.css';
import '../templates/new-world.css';
import '../templates/story-world.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

interface InvitationRendererProps {
  slug: string;
  templateId: TemplateId;
  eventDate: string;
  config: InvitationConfig;
  guestGroup?: GuestGroup | null;
  forceEnvelopeOpen?: boolean;
  isBuilderPreview?: boolean;
  previewEnvelope?: boolean;
}

export function InvitationRenderer(props: InvitationRendererProps) {
  if (props.templateId === 'eternal-elegance') {
    return <EternalEleganceExperience {...props} />;
  }

  if (props.templateId === 'royal-xv-enchanted') {
    return <RoyalXVEnchantedExperience {...props} />;
  }

  if (props.templateId === 'mini-cosmos') {
    return <MiniCosmosExperience {...props} />;
  }

  if (props.templateId === 'atelier-xv') {
    return <AtelierXVExperience {...props} />;
  }

  if (props.templateId === 'ritmo-de-dos') {
    return <RitmoDeDosExperience {...props} />;
  }

  if (props.templateId === 'marea-azul') {
    return <MareaAzulExperience {...props} />;
  }

  if (props.templateId === 'neon-xv-euphoria') {
    return <NeonXVEuphoriaExperience {...props} />;
  }

  return <StandardInvitationRenderer {...props} />;
}

function StandardInvitationRenderer({
  slug,
  templateId,
  eventDate,
  config,
  guestGroup,
  forceEnvelopeOpen = false,
  isBuilderPreview = false,
  previewEnvelope = false,
}: InvitationRendererProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(forceEnvelopeOpen || (isBuilderPreview && !previewEnvelope));
  const [copiedClabe, setCopiedClabe] = useState(false);
  const signatureTemplateId = templateId === 'boho-terracotta' || templateId === 'modern-minimal-noir' || templateId === 'neon-xv-euphoria'
    ? templateId : null;
  const celebrationTemplateId = isCelebrationTemplateId(templateId) ? templateId : null;
  const isKidsAdventure = templateId === 'fiesta-kids-adventure';
  const kidsWorldId = isKidsWorldTemplateId(templateId) ? templateId : null;
  const kidsWorldVariant = kidsWorldId === 'pirate-treasure-voyage' ? 'pirate'
    : kidsWorldId === 'safari-sunrise-adventure' ? 'safari'
      : kidsWorldId === 'cowboy-ranch-roundup' ? 'cowboy'
        : kidsWorldId === 'mickey-mouse-birthday' ? 'mickey'
          : kidsWorldId === 'minecraft-birthday' ? 'minecraft' : 'dino';
  const weddingWorldId = isWeddingWorldTemplateId(templateId) ? templateId : null;
  const weddingWorldVariant = weddingWorldId === 'glass-garden-vows' ? 'garden'
    : weddingWorldId === 'midnight-constellation' ? 'stars' : 'vineyard';
  const newWorldId = isNewWorldTemplateId(templateId) ? templateId : null;
  const newWorldVariant = newWorldId === 'opera-carmesi' ? 'opera' : newWorldId === 'pequeno-atlas' ? 'atlas' : 'future';
  const storyWorldId = isStoryWorldTemplateId(templateId) ? templateId : null;
  const storyVariant = storyWorldId === 'ohana-lilo-stitch' ? 'ohana' : storyWorldId === 'solar-pop-xv' ? 'solar' : 'cafe';
  const occasionTemplateId = isOccasionTemplateId(templateId) ? templateId : null;
  const newSceneTemplateId = isNewSceneTemplateId(templateId) ? templateId : null;
  const hasSceneTemplate = Boolean(signatureTemplateId || celebrationTemplateId || occasionTemplateId || newSceneTemplateId || kidsWorldId || weddingWorldId || newWorldId || storyWorldId);
  const occasionCopy = occasionTemplateId ? occasionSectionCopy[occasionTemplateId] : null;

  // Estado Cuenta Regresiva
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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
    setIsEnvelopeOpen(forceEnvelopeOpen || (isBuilderPreview && !previewEnvelope));
  }, [forceEnvelopeOpen, isBuilderPreview, previewEnvelope]);

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
      const root = containerRef.current;
      if (!root) return;
      if (signatureTemplateId) {
        setupSignatureScenes(root, signatureTemplateId);
        return;
      }
      if (kidsWorldId) {
        setupKidsWorldScenes(root, kidsWorldId);
        return;
      }
      if (weddingWorldId) {
        setupWeddingWorldScenes(root, weddingWorldId);
        return;
      }
      if (newWorldId) {
        setupNewWorldScenes(root, newWorldId);
        return;
      }
      if (storyWorldId) {
        setupStoryWorldScenes(root, storyWorldId);
        return;
      }
      if (celebrationTemplateId) {
        if (isKidsAdventure) setupFiestaKidsAdventureScenes(root);
        else setupCelebrationScenes(root, celebrationTemplateId);
        return;
      }
      if (occasionTemplateId) {
        setupOccasionScenes(root, occasionTemplateId);
        return;
      }
      if (newSceneTemplateId) {
        setupNewScenes(root, newSceneTemplateId);
        return;
      }
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

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
    { scope: containerRef, dependencies: [isEnvelopeOpen, templateId, signatureTemplateId, celebrationTemplateId, occasionTemplateId, newSceneTemplateId, weddingWorldId, newWorldId, storyWorldId] }
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

  const handleSubmitRsvp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isBuilderPreview || !guestGroup) { toast.error('Abre tu enlace personal para confirmar'); return; }
    try {
      const response = await fetch(`/api/public/invitations/${encodeURIComponent(slug)}/rsvp`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ guestToken: guestGroup.guestToken, groupName: rsvpName, willAttend: willAttend === 'yes', confirmedAdults, confirmedChildren }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error);
      if (!result.pass) { setGeneratedPass(null); toast.success('Gracias por avisarnos'); return; }
      setGeneratedPass({ qrPayload: result.pass.qrPayload, groupName: result.pass.groupName, adults: confirmedAdults, children: confirmedChildren, tableName: result.pass.tableName || 'Mesa por asignar' });
      toast.success('Asistencia confirmada');
    } catch (err) { toast.error(err instanceof Error ? err.message : 'No se pudo guardar tu respuesta'); }
  };

  return (
    <div
      ref={containerRef}
      style={{
        backgroundColor: colors.bgPrimary,
        color: colors.textPrimary,
        fontFamily: invitationFontStack(fonts.bodyFont),
        '--inv-heading-font': invitationFontStack(fonts.headingFont),
        '--inv-body-font': invitationFontStack(fonts.bodyFont),
        '--inv-script-font': invitationFontStack(fonts.scriptFont),
        '--ns-bg': colors.bgPrimary,
        '--ns-bg-2': colors.bgSecondary,
        '--ns-text': colors.textPrimary,
        '--ns-muted': colors.textMuted,
        '--ns-accent': colors.accentPrimary,
        '--ns-accent-2': colors.accentSecondary,
      } as React.CSSProperties}
      className={`relative min-h-dvh w-full overflow-x-hidden selection:bg-amber-500/20${signatureTemplateId ? ` st-root st-root--${signatureTemplateId}` : ''}${celebrationTemplateId ? ` cs-root cs-root--${celebrationTemplateId}` : ''}${isKidsAdventure ? ' fk-root' : ''}${kidsWorldId ? ` kw-root kw-root--${kidsWorldVariant}` : ''}${weddingWorldId ? ` ww-root ww-root--${weddingWorldVariant}` : ''}${newWorldId ? ` nw-root nw-root--${newWorldVariant}` : ''}${storyWorldId ? ` sw-root sw-root--${storyVariant}` : ''}${occasionTemplateId ? ` oc-root oc-root--${occasionTemplateId}` : ''}${newSceneTemplateId ? ` ns-root ns-root--${newSceneTemplateId}` : ''}`}
    >
      {isKidsAdventure && <div className="fk-progress" aria-hidden="true"><span className="fk-progress__bar" /></div>}
      {kidsWorldId && <div className="kw-progress" aria-hidden="true"><span className="kw-progress__bar" /></div>}
      {weddingWorldId && <div className="ww-progress" aria-hidden="true"><span className="ww-progress__bar" /></div>}
      {newWorldId && <div className="nw-progress" aria-hidden="true"><span className="nw-progress__bar" /></div>}
      {storyWorldId && <div className="sw-progress" aria-hidden="true"><span className="sw-progress__bar" /></div>}
      {/* 1. Sobre de Apertura Interactivo */}
      {(!isBuilderPreview || previewEnvelope) && (
        <EnvelopeOpener
          config={config}
          guestGroup={guestGroup}
          isOpen={isEnvelopeOpen}
          onOpen={() => setIsEnvelopeOpen(true)}
          sceneClassName={isKidsAdventure ? 'fk-opening' : kidsWorldId ? `kw-opening kw-opening--${kidsWorldVariant}` : weddingWorldId ? `ww-opening ww-opening--${weddingWorldVariant}` : newWorldId ? `nw-opening nw-opening--${newWorldVariant}` : storyWorldId ? `sw-opening sw-opening--${storyVariant}` : newSceneTemplateId ? `ns-envelope ns-envelope--${newSceneTemplateId}` : undefined}
          celebrateOnOpen={!weddingWorldId && (!newSceneTemplateId || newSceneTemplateId === 'mini-cosmos' || newSceneTemplateId === 'ritmo-de-dos')}
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
      {isSectionEnabled('hero') && signatureTemplateId && (
        <SignatureHero
          templateId={signatureTemplateId}
          config={config}
          eventDate={eventDate}
          guestGroup={guestGroup}
          actionHref={isSectionEnabled('quote_story') ? '#st-story' : isSectionEnabled('rsvp') ? '#st-rsvp' : isSectionEnabled('locations') ? '#st-locations' : '#st-hero'}
        />
      )}
      {isSectionEnabled('hero') && isKidsAdventure && (
        <FiestaKidsAdventureHero config={config} eventDate={eventDate} guestGroup={guestGroup} actionHref={isSectionEnabled('quote_story') ? '#st-story' : '#st-rsvp'} />
      )}
      {isSectionEnabled('hero') && kidsWorldId === 'pirate-treasure-voyage' && (
        <PirateTreasureExperience config={config} eventDate={eventDate} guestGroup={guestGroup} actionHref={isSectionEnabled('quote_story') ? '#st-story' : '#st-rsvp'} />
      )}
      {isSectionEnabled('hero') && kidsWorldId === 'dino-jungle-expedition' && (
        <DinoJungleExperience config={config} eventDate={eventDate} guestGroup={guestGroup} actionHref={isSectionEnabled('quote_story') ? '#st-story' : '#st-rsvp'} />
      )}
      {isSectionEnabled('hero') && kidsWorldId === 'safari-sunrise-adventure' && (
        <SafariSunriseExperience config={config} eventDate={eventDate} guestGroup={guestGroup} actionHref={isSectionEnabled('quote_story') ? '#st-story' : '#st-rsvp'} />
      )}
      {isSectionEnabled('hero') && kidsWorldId === 'cowboy-ranch-roundup' && (
        <CowboyRanchExperience config={config} eventDate={eventDate} guestGroup={guestGroup} actionHref={isSectionEnabled('quote_story') ? '#st-story' : '#st-rsvp'} />
      )}
      {isSectionEnabled('hero') && kidsWorldId === 'mickey-mouse-birthday' && (
        <MickeyMouseBirthdayExperience config={config} eventDate={eventDate} guestGroup={guestGroup} actionHref={isSectionEnabled('quote_story') ? '#st-story' : '#st-rsvp'} />
      )}
      {isSectionEnabled('hero') && kidsWorldId === 'minecraft-birthday' && (
        <MinecraftBirthdayExperience config={config} eventDate={eventDate} guestGroup={guestGroup} actionHref={isSectionEnabled('quote_story') ? '#st-story' : '#st-rsvp'} />
      )}
      {isSectionEnabled('hero') && weddingWorldId === 'glass-garden-vows' && <GlassGardenVowsExperience config={config} eventDate={eventDate} guestGroup={guestGroup} actionHref={isSectionEnabled('quote_story') ? '#st-story' : '#st-rsvp'} />}
      {isSectionEnabled('hero') && weddingWorldId === 'midnight-constellation' && <MidnightConstellationExperience config={config} eventDate={eventDate} guestGroup={guestGroup} actionHref={isSectionEnabled('quote_story') ? '#st-story' : '#st-rsvp'} />}
      {isSectionEnabled('hero') && weddingWorldId === 'golden-harvest-vineyard' && <GoldenHarvestVineyardExperience config={config} eventDate={eventDate} guestGroup={guestGroup} actionHref={isSectionEnabled('quote_story') ? '#st-story' : '#st-rsvp'} />}
      {isSectionEnabled('hero') && newWorldId === 'opera-carmesi' && <OperaCarmesiExperience config={config} eventDate={eventDate} guestGroup={guestGroup} actionHref={isSectionEnabled('quote_story') ? '#st-story' : '#st-rsvp'} />}
      {isSectionEnabled('hero') && newWorldId === 'pequeno-atlas' && <PequenoAtlasExperience config={config} eventDate={eventDate} guestGroup={guestGroup} actionHref={isSectionEnabled('quote_story') ? '#st-story' : '#st-rsvp'} />}
      {isSectionEnabled('hero') && newWorldId === 'archivo-futuro' && <ArchivoFuturoExperience config={config} eventDate={eventDate} guestGroup={guestGroup} actionHref={isSectionEnabled('quote_story') ? '#st-story' : '#st-rsvp'} />}
      {isSectionEnabled('hero') && storyWorldId === 'ohana-lilo-stitch' && <OhanaLiloStitchExperience config={config} eventDate={eventDate} guestGroup={guestGroup} actionHref={isSectionEnabled('quote_story') ? '#st-story' : '#st-rsvp'} />}
      {isSectionEnabled('hero') && storyWorldId === 'solar-pop-xv' && <SolarPopXVExperience config={config} eventDate={eventDate} guestGroup={guestGroup} actionHref={isSectionEnabled('quote_story') ? '#st-story' : '#st-rsvp'} />}
      {isSectionEnabled('hero') && storyWorldId === 'cafe-para-siempre' && <CafeParaSiempreExperience config={config} eventDate={eventDate} guestGroup={guestGroup} actionHref={isSectionEnabled('quote_story') ? '#st-story' : '#st-rsvp'} />}
      {isSectionEnabled('hero') && celebrationTemplateId && !isKidsAdventure && (
        <CelebrationHero
          templateId={celebrationTemplateId}
          config={config}
          eventDate={eventDate}
          guestGroup={guestGroup}
          actionHref={isSectionEnabled('quote_story') ? '#st-story' : isSectionEnabled('rsvp') ? '#st-rsvp' : isSectionEnabled('locations') ? '#st-locations' : '#cs-hero'}
        />
      )}

      {isKidsAdventure && isSectionEnabled('hero') && <FiestaKidsMarquee />}
      {kidsWorldId && isSectionEnabled('hero') && <KidsWorldMarquee variant={kidsWorldVariant} />}
      {weddingWorldId && isSectionEnabled('hero') && <WeddingWorldMarquee variant={weddingWorldVariant} />}
      {newWorldId && isSectionEnabled('hero') && <NewWorldMarquee variant={newWorldVariant} />}
      {storyWorldId && isSectionEnabled('hero') && <StoryWorldMarquee variant={storyVariant} />}
      {isSectionEnabled('hero') && occasionTemplateId && (
        <OccasionHero
          templateId={occasionTemplateId}
          config={config}
          eventDate={eventDate}
          guestGroup={guestGroup}
          actionHref={isSectionEnabled('quote_story') ? '#st-story' : isSectionEnabled('rsvp') ? '#st-rsvp' : isSectionEnabled('locations') ? '#st-locations' : '#oc-hero'}
        />
      )}
      {isSectionEnabled('hero') && newSceneTemplateId && (
        <NewSceneHero
          templateId={newSceneTemplateId}
          config={config}
          eventDate={eventDate}
          guestGroup={guestGroup}
          actionHref={isSectionEnabled('quote_story') ? '#st-story' : isSectionEnabled('rsvp') ? '#st-rsvp' : isSectionEnabled('locations') ? '#st-locations' : '#ns-hero'}
        />
      )}
      {isSectionEnabled('hero') && !hasSceneTemplate && (
        <section data-editor-section="hero" className="relative flex min-h-dvh flex-col items-center justify-end overflow-hidden px-6 pb-16 pt-28 text-center">
          <div className="absolute inset-0 z-0 overflow-hidden">
            <HeroMedia hero={content.hero} alt={content.hero.mainTitle} className="inv-mask-image h-full w-full object-cover" />
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
              style={{ fontFamily: invitationFontStack(fonts.headingFont) }}
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
          id="st-story"
          data-editor-section="quoteStory"
          className="inv-reveal-section st-story mx-auto max-w-3xl px-6 py-20 text-center"
        >
          {isKidsAdventure && <AdventureMap />}
          {kidsWorldId === 'pirate-treasure-voyage' && <PirateStoryMap />}
          {kidsWorldId === 'dino-jungle-expedition' && <DinoStoryFossils />}
          {kidsWorldId === 'safari-sunrise-adventure' && <SafariTrailBackdrop />}
          {kidsWorldId === 'cowboy-ranch-roundup' && <CowboyTrailBackdrop />}
          {kidsWorldId === 'mickey-mouse-birthday' && <MickeyStoryBackdrop />}
          {kidsWorldId === 'minecraft-birthday' && <MinecraftStoryMap />}
          {weddingWorldId === 'glass-garden-vows' && <GardenStoryTrellis />}
          {weddingWorldId === 'midnight-constellation' && <ConstellationStorySky />}
          {weddingWorldId === 'golden-harvest-vineyard' && <VineyardStoryVines />}
          {newWorldId && <NewWorldStoryArt variant={newWorldVariant} />}
          {storyWorldId === 'ohana-lilo-stitch' && <OhanaWaveStory />}
          {storyWorldId === 'solar-pop-xv' && <SolarPopStory />}
          {storyWorldId === 'cafe-para-siempre' && <CafeMenuStory />}
          <div
            className="mx-auto mb-6 h-12 w-px"
            style={{ backgroundColor: colors.accentPrimary }}
          />
          {content.sectionHeadings?.quote_story?.eyebrow && <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: colors.accentPrimary }}>{content.sectionHeadings.quote_story.eyebrow}</p>}
          <blockquote
            className="text-2xl leading-relaxed italic sm:text-3xl"
            style={{ fontFamily: invitationFontStack(fonts.headingFont) }}
            aria-label={hasSceneTemplate ? content.quoteStory.quoteText : undefined}
          >
            {hasSceneTemplate ? (
              <span>
                {content.quoteStory.quoteText.split(/(\s+)/).map((part, index) =>
                  /^\s+$/.test(part) ? part : <span className="st-story__word" aria-hidden="true" key={index}>{part}</span>
                )}
              </span>
            ) : content.quoteStory.quoteText}
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
                    {(isKidsAdventure || kidsWorldId || weddingWorldId || newWorldId || storyWorldId) && block.imageUrl && <img className={isKidsAdventure ? 'fk-story-card__image' : kidsWorldId ? 'kw-story-card__image' : weddingWorldId ? 'ww-story-card__image' : newWorldId ? 'nw-story-card__image' : 'sw-story-card__image'} src={block.imageUrl} alt="" loading="lazy" />}
                    <span
                      className="text-xs font-bold tracking-widest uppercase"
                      style={{ color: colors.accentPrimary }}
                    >
                      0{idx + 1}
                    </span>
                    <h3
                      className="mt-1 text-xl font-semibold"
                      style={{ fontFamily: invitationFontStack(fonts.headingFont) }}
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

      {isKidsAdventure && <FiestaKidsStations config={config} />}
      {kidsWorldId && isSectionEnabled('quote_story') && <KidsWorldStations variant={kidsWorldVariant} config={config} />}
      {weddingWorldId && isSectionEnabled('quote_story') && <WeddingWorldStations variant={weddingWorldVariant} config={config} />}
      {newWorldId && isSectionEnabled('quote_story') && <NewWorldMoments variant={newWorldVariant} config={config} />}
      {storyWorldId && isSectionEnabled('quote_story') && <StoryWorldMoments variant={storyVariant} config={config} />}

      {/* SECCIÓN 3: PADRES Y PADRINOS DE HONOR */}
      {isSectionEnabled('vip_parents') &&
        content.vipParents.groups.length > 0 && (
          <section
            data-editor-section="vipParents"
            className="inv-reveal-section st-family px-6 py-16"
            style={{ backgroundColor: colors.bgSecondary }}
          >
            <div className="mx-auto max-w-4xl text-center">
              {content.sectionHeadings?.vip_parents?.eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: colors.accentPrimary }}>{content.sectionHeadings.vip_parents.eyebrow}</p>}
              {content.sectionHeadings?.vip_parents?.title && <h2 className="mb-5 text-3xl font-semibold" style={{ fontFamily: invitationFontStack(fonts.headingFont) }}>{content.sectionHeadings.vip_parents.title}</h2>}
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
                    className="st-family__card rounded-2xl border p-6"
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
                          style={{ fontFamily: invitationFontStack(fonts.headingFont) }}
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
        <section data-editor-section="countdown" className="inv-reveal-section st-countdown mx-auto max-w-3xl px-6 py-20 text-center">
          <p
            className="mb-2 text-xs font-semibold tracking-[0.25em] uppercase"
            style={{ color: colors.accentPrimary }}
          >
            {content.sectionHeadings?.countdown?.eyebrow ?? occasionCopy?.countdownEyebrow ?? (celebrationTemplateId === 'golden-jubilee'
              ? 'La noche se acerca'
              : celebrationTemplateId === 'fiesta-kids-adventure'
                ? 'Prepara tu mochila'
                : celebrationTemplateId === 'celestial-baptism'
                  ? 'Con ilusión esperamos'
                  : 'Falta cada vez menos')}
          </p>
          <h2
            className="mb-10 text-3xl font-semibold sm:text-4xl"
            style={{ fontFamily: invitationFontStack(fonts.headingFont) }}
          >
            {content.sectionHeadings?.countdown?.title ?? occasionCopy?.countdownTitle ?? (celebrationTemplateId === 'golden-jubilee'
              ? 'Cuenta regresiva para el brindis'
              : celebrationTemplateId === 'fiesta-kids-adventure'
                ? 'La aventura empieza en'
                : celebrationTemplateId === 'celestial-baptism'
                  ? 'Falta para este día de gracia'
                  : 'Cuenta Regresiva para el Gran Día')}
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
                className="st-countdown__unit flex flex-col items-center justify-center rounded-2xl border py-5 shadow-xs"
                style={{
                  backgroundColor: colors.bgSecondary,
                  borderColor: `${colors.accentPrimary}35`,
                }}
              >
                <span
                  className="text-3xl font-bold tabular-nums sm:text-4xl"
                  style={{ fontFamily: invitationFontStack(fonts.headingFont) }}
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
          id="st-locations"
          data-editor-section="locations"
          className="inv-reveal-section st-locations px-6 py-20"
          style={{ backgroundColor: colors.bgSecondary }}
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-12 text-center">
              <p
                className="mb-2 text-xs font-semibold tracking-[0.25em] uppercase"
                style={{ color: colors.accentPrimary }}
              >
                {content.sectionHeadings?.locations?.eyebrow ?? occasionCopy?.locationEyebrow ?? (celebrationTemplateId === 'golden-jubilee'
                  ? 'La cita de gala'
                  : celebrationTemplateId === 'fiesta-kids-adventure'
                    ? 'Punto de encuentro'
                    : celebrationTemplateId === 'celestial-baptism'
                      ? 'Ceremonia y encuentro'
                      : 'Dónde y Cuándo')}
              </p>
              <h2
                className="text-3xl font-semibold sm:text-4xl"
                style={{ fontFamily: invitationFontStack(fonts.headingFont) }}
              >
                {content.sectionHeadings?.locations?.title ?? occasionCopy?.locationTitle ?? (celebrationTemplateId === 'golden-jubilee'
                  ? 'Donde brindaremos'
                  : celebrationTemplateId === 'fiesta-kids-adventure'
                    ? 'El lugar de la aventura'
                    : celebrationTemplateId === 'celestial-baptism'
                      ? 'Dónde compartiremos este día'
                      : 'Ubicaciones del Evento')}
              </h2>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              {content.locations.map((loc) => (
                <div
                  key={loc.id}
                  className="st-locations__card flex flex-col overflow-hidden rounded-3xl border shadow-sm"
                  style={{
                    backgroundColor: colors.bgPrimary,
                    borderColor: `${colors.accentPrimary}30`,
                  }}
                >
                  {loc.imageUrl && (
                    <div className="h-52 w-full overflow-hidden">
                      <img
                        src={loc.imageUrl}
                        alt={celebrationTemplateId || newSceneTemplateId || kidsWorldId || weddingWorldId ? `Ambiente de ${loc.title}` : loc.venueName}
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
                        style={{ fontFamily: invitationFontStack(fonts.headingFont) }}
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
                      {(isKidsAdventure || kidsWorldId || weddingWorldId || newWorldId || storyWorldId) && <>
                        <a className={isKidsAdventure ? 'fk-route-link' : kidsWorldId ? 'kw-route-link' : weddingWorldId ? 'ww-route-link' : newWorldId ? 'nw-route-link' : 'sw-route-link'} href={`https://maps.apple.com/?ll=${loc.coordinates.lat},${loc.coordinates.lng}&q=${encodeURIComponent(loc.venueName)}`} target="_blank" rel="noopener noreferrer">Apple Maps</a>
                        <a className={isKidsAdventure ? 'fk-route-link' : kidsWorldId ? 'kw-route-link' : weddingWorldId ? 'ww-route-link' : newWorldId ? 'nw-route-link' : 'sw-route-link'} href={`https://m.uber.com/ul/?action=setPickup&dropoff[latitude]=${loc.coordinates.lat}&dropoff[longitude]=${loc.coordinates.lng}&dropoff[nickname]=${encodeURIComponent(loc.venueName)}`} target="_blank" rel="noopener noreferrer">Uber</a>
                      </>}
                    </div>
                  </div>
                  {isKidsAdventure && <iframe className="fk-location-map" title={`Mapa de ${loc.venueName}`} src={`https://www.google.com/maps?q=${loc.coordinates.lat},${loc.coordinates.lng}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}
                  {kidsWorldId && <iframe className="kw-location-map" title={`Mapa de ${loc.venueName}`} src={`https://www.google.com/maps?q=${loc.coordinates.lat},${loc.coordinates.lng}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}
                  {weddingWorldId && <iframe className="ww-location-map" title={`Mapa de ${loc.venueName}`} src={`https://www.google.com/maps?q=${loc.coordinates.lat},${loc.coordinates.lng}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}
                  {newWorldId && <iframe className="nw-location-map" title={`Mapa de ${loc.venueName}`} src={`https://www.google.com/maps?q=${loc.coordinates.lat},${loc.coordinates.lng}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}
                  {storyWorldId && <iframe className="sw-location-map" title={`Mapa de ${loc.venueName}`} src={`https://www.google.com/maps?q=${loc.coordinates.lat},${loc.coordinates.lng}&output=embed`} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SECCIÓN 6: ITINERARIO / TIMELINE ANIMADO */}
      {isSectionEnabled('timeline') && content.timeline.length > 0 && (
        <section data-editor-section="timeline" className="inv-reveal-section st-timeline mx-auto max-w-3xl px-6 py-20">
          <div className="mb-12 text-center">
            <p
              className="mb-2 text-xs font-semibold tracking-[0.25em] uppercase"
              style={{ color: colors.accentPrimary }}
            >
              {content.sectionHeadings?.timeline?.eyebrow ?? occasionCopy?.timelineEyebrow ?? (celebrationTemplateId === 'golden-jubilee'
                ? 'La velada'
                : celebrationTemplateId === 'fiesta-kids-adventure'
                  ? 'El mapa de la fiesta'
                  : celebrationTemplateId === 'celestial-baptism'
                    ? 'Los momentos de este día'
                    : 'Minuto a Minuto')}
            </p>
            <h2
              className="text-3xl font-semibold sm:text-4xl"
              style={{ fontFamily: invitationFontStack(fonts.headingFont) }}
            >
              {content.sectionHeadings?.timeline?.title ?? occasionCopy?.timelineTitle ?? (celebrationTemplateId === 'golden-jubilee'
                ? 'Una noche para recordar'
                : celebrationTemplateId === 'fiesta-kids-adventure'
                  ? 'Nuestra ruta de aventura'
                  : celebrationTemplateId === 'celestial-baptism'
                    ? 'Ceremonia y celebración'
                    : 'Itinerario del Evento')}
            </h2>
          </div>

            <div className="relative mx-auto max-w-xl pl-8">
              {isKidsAdventure && <span className="fk-timeline__runner" aria-hidden="true">✦</span>}
              {kidsWorldId && <span className="kw-timeline__runner" aria-hidden="true">{{ pirate: '☸', dino: '✦', safari: '◉', cowboy: '★', mickey: '●', minecraft: '◆' }[kidsWorldVariant]}</span>}
              {weddingWorldId && <span className="ww-timeline__runner" aria-hidden="true">{{ garden: '✿', stars: '✧', vineyard: '❧' }[weddingWorldVariant]}</span>}
              {newWorldId && <span className="nw-timeline__runner" aria-hidden="true">{{ opera: '✦', atlas: '✺', future: '↗' }[newWorldVariant]}</span>}
              {storyWorldId && <span className="sw-timeline__runner" aria-hidden="true">{{ ohana: '✿', solar: '✺', cafe: '♥' }[storyVariant]}</span>}
            <div
              className="st-timeline__line absolute top-2 bottom-2 left-3 w-0.5"
              style={{ backgroundColor: `${colors.accentPrimary}45` }}
            />
            <div className="space-y-8">
              {content.timeline.map((item) => (
                <div key={item.id} className="st-timeline__item relative">
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
                    style={{ fontFamily: invitationFontStack(fonts.headingFont) }}
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

      {isKidsAdventure && isSectionEnabled('timeline') && <FiestaKidsMarquee second />}
      {kidsWorldId && isSectionEnabled('timeline') && <KidsWorldMarquee variant={kidsWorldVariant} second />}
      {weddingWorldId && isSectionEnabled('timeline') && <WeddingWorldMarquee variant={weddingWorldVariant} second />}
      {newWorldId && isSectionEnabled('timeline') && <NewWorldMarquee variant={newWorldVariant} second />}
      {storyWorldId && isSectionEnabled('timeline') && <StoryWorldMarquee variant={storyVariant} second />}

      {/* SECCIÓN 7: GALERÍA MULTIMEDIA */}
      {isSectionEnabled('gallery') && content.gallery.images.length > 0 && (
        <section
          data-editor-section="gallery"
          className="inv-reveal-section st-gallery px-6 py-20"
          style={{ backgroundColor: colors.bgSecondary }}
        >
          <div className="mx-auto max-w-5xl">
            <div className="mb-10 text-center">
              <p
                className="mb-2 text-xs font-semibold tracking-[0.25em] uppercase"
                style={{ color: colors.accentPrimary }}
              >
                {content.sectionHeadings?.gallery?.eyebrow ?? occasionCopy?.galleryEyebrow ?? (celebrationTemplateId === 'golden-jubilee'
                  ? 'Detalles dorados'
                  : celebrationTemplateId === 'fiesta-kids-adventure'
                    ? 'Asómate a la aventura'
                    : celebrationTemplateId === 'celestial-baptism'
                      ? 'Luz y significado'
                      : 'Momentos Inolvidables')}
              </p>
              <h2
                className="text-3xl font-semibold sm:text-4xl"
                style={{ fontFamily: invitationFontStack(fonts.headingFont) }}
              >
                {content.sectionHeadings?.gallery?.title ?? occasionCopy?.galleryTitle ?? (celebrationTemplateId === 'golden-jubilee'
                  ? 'Momentos de la noche'
                  : celebrationTemplateId === 'fiesta-kids-adventure'
                    ? 'Nuestro mundo de aventura'
                    : celebrationTemplateId === 'celestial-baptism'
                      ? 'Detalles de este día'
                      : 'Nuestra Galería')}
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {content.gallery.images.map((img, idx) => (
                <div
                  key={idx}
                  className="st-gallery__photo group relative aspect-3/4 overflow-hidden rounded-2xl shadow-sm"
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
        <section data-editor-section="dressCode" className="inv-reveal-section st-dress mx-auto max-w-3xl px-6 py-20 text-center">
          <p
            className="mb-2 text-xs font-semibold tracking-[0.25em] uppercase"
            style={{ color: colors.accentPrimary }}
          >
            {content.sectionHeadings?.dress_code?.eyebrow ?? occasionCopy?.dressEyebrow ?? (celebrationTemplateId === 'fiesta-kids-adventure'
              ? 'Listos para jugar'
              : celebrationTemplateId === 'celestial-baptism'
                ? 'Para acompañarnos'
                : 'Dress Code')}
          </p>
          <h2
            className="mb-8 text-3xl font-semibold sm:text-4xl"
            style={{ fontFamily: invitationFontStack(fonts.headingFont) }}
          >
            {content.sectionHeadings?.dress_code?.title || content.dressCode.title}
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
                {occasionCopy?.dressLeft ?? (celebrationTemplateId === 'fiesta-kids-adventure' || kidsWorldId ? 'Peques' : 'Mujeres')}
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
                {occasionCopy?.dressRight ?? (celebrationTemplateId === 'fiesta-kids-adventure' || kidsWorldId ? 'Adultos' : 'Hombres')}
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
          data-editor-section="gifts"
          className="inv-reveal-section st-gifts px-6 py-20"
          style={{ backgroundColor: colors.bgSecondary }}
        >
          <div className="mx-auto max-w-4xl text-center">
            <Gift
              className="mx-auto mb-3 h-8 w-8"
              style={{ color: colors.accentPrimary }}
            />
            <h2
              className="mb-3 text-3xl font-semibold sm:text-4xl"
              style={{ fontFamily: invitationFontStack(fonts.headingFont) }}
            >
              {content.sectionHeadings?.gifts?.title ?? occasionCopy?.giftsTitle ?? 'Mesa de Regalos y Lluvia de Sobres'}
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
                      style={{ fontFamily: invitationFontStack(fonts.headingFont) }}
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
                        style={{ fontFamily: invitationFontStack(fonts.headingFont) }}
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
              {content.gifts.cashEnvelopeAtVenue && content.gifts.registries.length === 0 && !content.gifts.bankTransfer?.enabled && (
                <div className="st-gifts__envelope rounded-2xl border p-8 text-center md:col-span-2" style={{ borderColor: `${colors.accentPrimary}55` }}>
                  <Gift className="mx-auto mb-3 h-7 w-7" style={{ color: colors.accentPrimary }} aria-hidden="true" />
                  <p className="text-sm font-semibold tracking-widest uppercase">Lluvia de sobres en el evento</p>
                  <p className="mt-2 text-sm" style={{ color: colors.textMuted }}>Habrá un espacio para dejar tu detalle durante la celebración.</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* SECCIÓN 10: HOSPEDAJE SUGERIDO */}
      {isSectionEnabled('accommodation') &&
        content.accommodation.length > 0 && (
          <section data-editor-section="accommodation" className="inv-reveal-section st-stay mx-auto max-w-4xl px-6 py-20">
            <div className="mb-10 text-center">
              <Hotel
                className="mx-auto mb-3 h-7 w-7"
                style={{ color: colors.accentPrimary }}
              />
              <h2
                className="text-3xl font-semibold sm:text-4xl"
                style={{ fontFamily: invitationFontStack(fonts.headingFont) }}
              >
                {content.sectionHeadings?.accommodation?.title || 'Sugerencias de Hospedaje'}
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
                    style={{ fontFamily: invitationFontStack(fonts.headingFont) }}
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
      {isSectionEnabled('social_features') && <section data-editor-section="socialFeatures" className="st-social mx-auto max-w-4xl px-6 py-12">{content.sectionHeadings?.social_features?.eyebrow && <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em]" style={{ color: colors.accentPrimary }}>{content.sectionHeadings.social_features.eyebrow}</p>}<h2 className="mb-4 text-2xl">{content.sectionHeadings?.social_features?.title || 'Álbum compartido'}</h2><SharedAlbum slug={slug} token={guestGroup?.guestToken} preview={isBuilderPreview} /></section>}

      {isSectionEnabled('social_features') && <section data-editor-section="socialFeatures" className="st-social mx-auto max-w-4xl px-6 py-12"><SocialFeatures slug={slug} token={guestGroup?.guestToken} preview={isBuilderPreview} songsEnabled={content.socialFeatures.enableSongRequests} audioEnabled={content.socialFeatures.enableAudioGuestbook} /></section>}

      {/* SECCIÓN 12: MÓDULO RSVP INTELIGENTE + PASE VIP QR */}
      {isSectionEnabled('rsvp') && (
        <section id="st-rsvp" data-editor-section="rsvp" className="inv-reveal-section st-rsvp mx-auto max-w-2xl px-6 py-24">
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
                style={{ fontFamily: invitationFontStack(fonts.headingFont) }}
              >
                {content.sectionHeadings?.rsvp?.title || 'Confirmación de asistencia'}
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
                  : hasSceneTemplate
                    ? 'Usa tu enlace personal para confirmar tu asistencia.'
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
                  Confirmar asistencia y generar pase QR
                </button>
              </form>
            ) : (
              /* Pase confirmado */
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
                  <span>Pase de acceso confirmado</span>
                </div>

                <h3
                  className="text-2xl font-semibold"
                  style={{ fontFamily: invitationFontStack(fonts.headingFont) }}
                >
                  {generatedPass.groupName}
                </h3>
                <p
                  className="mt-1 text-xs tracking-wider uppercase"
                  style={{ color: colors.textMuted }}
                >
                  {isBuilderPreview ? 'Muestra para' : 'Válido por'} {generatedPass.adults} Adultos
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
