'use client';

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import { useGSAP } from '@gsap/react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Eye,
  FolderKanban,
  LayoutDashboard,
  MapPin,
  Mic,
  QrCode,
  ShieldCheck,
  Smartphone,
  Users,
  WandSparkles,
} from 'lucide-react';
import { TEMPLATES_CATALOG } from '@/lib/templates/templates-catalog';
import type { EventCategory } from '@/types/invitation.types';
import './landing.css';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const CATEGORY_FILTERS: Array<{
  id: 'all' | EventCategory;
  label: string;
}> = [
  { id: 'all', label: 'Todas' },
  { id: 'wedding', label: 'Bodas' },
  { id: 'xv_years', label: 'XV años' },
  { id: 'adult_birthday', label: 'Cumpleaños' },
  { id: 'kids_birthday', label: 'Infantiles' },
  { id: 'baptism_communion', label: 'Bautizo' },
  { id: 'baby_shower', label: 'Baby shower' },
  { id: 'graduation_gala', label: 'Graduación' },
];

const FEATURES = [
  {
    number: '01',
    icon: Users,
    title: 'Cada invitado recibe su propia experiencia.',
    description:
      'Links nominales, pases asignados y un sobre que saluda a cada familia por su nombre.',
  },
  {
    number: '02',
    icon: QrCode,
    title: 'Del RSVP a la puerta, sin listas sueltas.',
    description:
      'Confirmaciones controladas, pase QR y check-in con mesa asignada desde el mismo sistema.',
  },
  {
    number: '03',
    icon: Smartphone,
    title: 'Diseñado primero para WhatsApp y móvil.',
    description:
      'Carga ligera, acciones táctiles claras y una presentación vertical que se siente natural en el teléfono.',
  },
  {
    number: '04',
    icon: FolderKanban,
    title: 'Una operación ordenada para cada cliente.',
    description:
      'Historial por plantilla, filtros, estados y acceso rápido al constructor de cada evento.',
  },
  {
    number: '05',
    icon: MapPin,
    title: 'Todo lo importante queda a un toque.',
    description:
      'Maps, Waze, calendario, mesa de regalos y contacto directo sin sacar al invitado del flujo.',
  },
  {
    number: '06',
    icon: Mic,
    title: 'La invitación sigue viva durante la fiesta.',
    description:
      'Mensajes de voz, canciones sugeridas y recuerdos compartidos para extender la experiencia.',
  },
];

const FAQS = [
  {
    question: '¿Cómo evitan que una familia confirme más pases?',
    answer:
      'Cada grupo recibe un enlace único. El formulario reconoce su asignación y limita adultos y niños al cupo definido por el anfitrión.',
  },
  {
    question: '¿La experiencia funciona dentro de WhatsApp?',
    answer:
      'Sí. Las invitaciones se plantean mobile-first, con áreas táctiles amplias, tipografía legible y una carga optimizada para el navegador interno de WhatsApp.',
  },
  {
    question: '¿Qué ocurre después de confirmar asistencia?',
    answer:
      'El invitado recibe un pase digital con QR, sus asistentes confirmados y la mesa asignada cuando ya está disponible.',
  },
  {
    question: '¿Puedo manejar varios clientes y estilos?',
    answer:
      'Sí. El dashboard organiza invitaciones por cliente, plantilla, estado y fecha; además permite cambiar de template sin perder el contenido del evento.',
  },
];

function BrandMark({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5" aria-label="Atelier Invitaciones">
      <span className="grid h-8 w-8 grid-cols-2 gap-0.5 rounded-md bg-[#cc785c] p-1.5 text-white">
        <span className="rounded-[1px] bg-white/95" />
        <span className="rounded-[1px] bg-white/65" />
        <span className="rounded-[1px] bg-white/65" />
        <span className="rounded-[1px] bg-white/95" />
      </span>
      {!compact && (
        <span className="text-[15px] font-medium tracking-[-0.02em] text-[#cc785c]">
          Atelier Invitaciones
        </span>
      )}
    </span>
  );
}

function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#d7cfc4] bg-white">
      <div className="flex h-11 items-center justify-between border-b border-[#e6dfd8] px-4">
        <div className="flex items-center gap-2">
          <BrandMark compact />
          <span className="hidden text-xs text-[#6c6a64] sm:inline">Panel de evento</span>
        </div>
        <span className="mono-label rounded-md bg-[#ebe6df] px-2.5 py-1 text-[10px] text-[#3d3d3a]">
          /boda-sofia-y-mateo
        </span>
      </div>

      <div className="grid min-h-[430px] sm:grid-cols-[150px_1fr]">
        <aside className="hidden border-r border-[#e6dfd8] bg-[#f5f0e8] p-3 sm:block">
          <p className="eyebrow px-2 py-2 text-[#8e8b82]">Espacio</p>
          {['Resumen', 'Diseño', 'Invitados', 'Recepción'].map((item, index) => (
            <div
              key={item}
              className={`mb-1 flex items-center gap-2 rounded-md px-2.5 py-2 text-xs ${
                index === 0
                  ? 'bg-[#ebe6df] font-medium text-[#141413]'
                  : 'text-[#6c6a64]'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${index === 0 ? 'bg-[#cc785c]' : 'bg-[#d7cfc4]'}`} />
              {item}
            </div>
          ))}
        </aside>

        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-[#cc785c]">Boda · 24 oct 2026</p>
              <h2 className="mt-1 text-[22px] font-normal tracking-[-0.02em] text-[#141413]">
                Sofía & Mateo
              </h2>
            </div>
            <span className="rounded-full bg-[#5db872]/55 px-2.5 py-1 text-[10px] font-medium text-[#141413]">
              Publicada
            </span>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              ['85', 'familias'],
              ['142', 'confirmados'],
              ['68%', 'abrieron'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-[#e6dfd8] bg-[#f5f0e8] p-3">
                <p className="text-xl font-normal tracking-[-0.03em] text-[#141413]">{value}</p>
                <p className="mt-1 text-[10px] text-[#6c6a64]">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[1.15fr_.85fr]">
            <div className="rounded-lg border border-[#e6dfd8] p-3.5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-medium text-[#141413]">Actividad del evento</p>
                <span className="mono-label text-[9px] text-[#8e8b82]">EN VIVO</span>
              </div>
              <div className="space-y-3">
                {[
                  ['Invitación abierta', 'Familia López', '#5db8a6'],
                  ['RSVP confirmado', '4 asistentes', '#5db872'],
                  ['Pase generado', 'Mesa 08', '#e8a55a'],
                  ['Link enviado', 'WhatsApp', '#e8a55a'],
                ].map(([action, detail, color]) => (
                  <div key={`${action}-${detail}`} className="grid grid-cols-[8px_1fr_auto] items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[11px] text-[#3d3d3a]">{action}</span>
                    <span className="mono-label text-[9px] text-[#8e8b82]">{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-48 overflow-hidden rounded-lg bg-[#141413] p-4 text-white">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-white/15" />
              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <span className="eyebrow text-[#e8a55a]">Vista del invitado</span>
                  <p className="mt-3 font-[var(--font-cormorant)] text-2xl italic">Sofía & Mateo</p>
                  <p className="mt-1 text-[10px] text-white/60">Para: Familia López · 4 pases</p>
                </div>
                <div className="flex items-center justify-between border-t border-white/15 pt-3 text-[10px] text-white/75">
                  <span>24 · 10 · 2026</span>
                  <Eye className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function HomePage() {
  const landingRef = useRef<HTMLDivElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<'all' | EventCategory>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useGSAP(() => {
    const root = landingRef.current;
    if (!root || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const hero = root.querySelector('.landing-hero');
    const visual = root.querySelector('.landing-hero__visual');
    const intro = root.querySelector('.landing-hero__intro');
    const finale = root.querySelector('.landing-hero__finale');
    if (hero && visual && intro && finale) {
      gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: hero,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.8,
          invalidateOnRefresh: true,
        },
      })
        .to(intro, { yPercent: -16, autoAlpha: 0, duration: 0.42 }, 0)
        .to(visual, {
          top: '0%', left: '0%', width: '100%', height: '100%',
          borderRadius: 0, duration: 0.85,
        }, 0)
        .to('.landing-hero__image', { scale: 1.08, duration: 1 }, 0)
        .to('.landing-hero__visual-shade', { opacity: 1, duration: 0.85 }, 0)
        .fromTo(finale, { yPercent: 16, autoAlpha: 0 }, { yPercent: 0, autoAlpha: 1, duration: 0.3 }, 0.68);
    }

    root.querySelectorAll<HTMLElement>('[data-landing-scene]').forEach((scene) => {
      const moving = scene.querySelector<HTMLElement>('[data-scene-depth]');
      if (moving) {
        gsap.fromTo(moving, { yPercent: 8 }, {
          yPercent: -8, ease: 'none',
          scrollTrigger: { trigger: scene, start: 'top bottom', end: 'bottom top', scrub: 1 },
        });
      }
      const reveals = scene.querySelectorAll<HTMLElement>('[data-scene-reveal]');
      if (reveals.length) {
        gsap.fromTo(reveals, { y: 64, opacity: 0.45 }, {
          y: 0, opacity: 1, ease: 'none', stagger: 0.12,
          scrollTrigger: { trigger: scene, start: 'top 85%', end: 'top 24%', scrub: 0.7 },
        });
      }
    });
  }, { scope: landingRef });

  const filteredTemplates =
    selectedCategory === 'all'
      ? TEMPLATES_CATALOG
      : TEMPLATES_CATALOG.filter((template) => template.category === selectedCategory);

  return (
    <div ref={landingRef} className="landing min-h-dvh bg-[#faf9f5] text-[#141413]">
      <header className="sticky top-0 z-40 border-b border-[#e6dfd8] bg-[#faf9f5]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="shrink-0">
            <BrandMark />
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-[#3d3d3a] lg:flex" aria-label="Navegación principal">
            <a href="#producto" className="transition-colors hover:text-[#141413]">Producto</a>
            <a href="#flujo" className="transition-colors hover:text-[#141413]">Cómo funciona</a>
            <a href="#templates" className="transition-colors hover:text-[#141413]">Templates</a>
            <a href="#faq" className="transition-colors hover:text-[#141413]">Preguntas</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/boda-sofia-y-mateo?g=fam-lopez-8a2f"
              className="hidden h-10 items-center rounded-lg border border-[#d7cfc4] bg-white px-4 text-sm text-[#141413] transition-colors hover:bg-[#f5f0e8] sm:inline-flex"
            >
              Ver demo
            </Link>
            <Link
              href="/login"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#cc785c] px-4 text-sm font-medium text-white transition-colors hover:bg-[#a9583e]"
            >
              Abrir panel
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="landing-hero" aria-label="Presentación de Atelier Invitaciones">
          <div className="landing-hero__stage">
            <div className="landing-hero__grain" aria-hidden="true" />
            <div className="landing-hero__intro">
              <p className="landing-kicker"><span className="landing-kicker__line" /> El arte de invitar, reinventado</p>
              <h1>El inicio de una historia <em>inolvidable.</em></h1>
              <p className="landing-hero__lead">
                Invitaciones digitales que conmueven desde el primer gesto y hacen sencilla cada confirmación hasta el último invitado.
              </p>
              <div className="landing-hero__actions">
                <Link href="/login" className="landing-button landing-button--primary">Crear mi invitación <ArrowRight size={17} /></Link>
                <Link href="/boda-sofia-y-mateo?g=fam-lopez-8a2f" className="landing-button landing-button--outline"><Eye size={17} /> Explorar la experiencia</Link>
              </div>
              <span className="landing-hero__index">01 / Una nueva forma de celebrar</span>
            </div>
            <div className="landing-hero__visual" aria-hidden="true">
              <img className="landing-hero__image" src="/images/boho-terracotta/sunset-garden.jpg" alt="" fetchPriority="high" />
              <span className="landing-hero__visual-shade" />
              <span className="landing-hero__visual-caption">Atelier / Historias hechas para sentirse</span>
              <span className="landing-hero__visual-frame" />
            </div>
            <div className="landing-hero__finale">
              <p className="landing-kicker">Cada detalle tiene una historia</p>
              <p className="landing-hero__finale-title">Y cada historia merece una entrada extraordinaria.</p>
              <Link href="#producto" className="landing-button landing-button--light">Descubre cómo lo hacemos <ArrowRight size={17} /></Link>
            </div>
            <div className="landing-hero__scroll" aria-hidden="true"><span /> Desliza para descubrir</div>
          </div>
        </section>

        <section id="producto" className="landing-product" data-landing-scene>
          <div className="landing-product__orb" aria-hidden="true" />
          <div className="landing-container landing-product__grid">
            <div className="landing-product__copy" data-scene-reveal>
              <p className="landing-kicker">Belleza que también funciona</p>
              <h2>La emoción delante. <em>Todo bajo control</em> detrás.</h2>
              <p>Una experiencia editorial para tus invitados y una plataforma clara para ti: diseño, envíos, confirmaciones y recepción en un mismo lugar.</p>
              <div className="landing-product__metrics">
                <div><strong>10</strong><span>universos visuales</span></div>
                <div><strong>01</strong><span>flujo completo</span></div>
                <div><strong>∞</strong><span>momentos memorables</span></div>
              </div>
            </div>
            <div className="landing-product__preview" data-scene-depth>
              <div className="landing-product__preview-label"><span /> Panel de control / En vivo</div>
              <ProductPreview />
              <div className="landing-product__floating" aria-hidden="true"><Check size={16} /> Confirmación recibida <span>Ahora</span></div>
            </div>
          </div>
        </section>

        <section className="landing-features landing-container" data-landing-scene>
          <div className="landing-section-heading" data-scene-reveal>
            <p className="landing-kicker">Cada detalle cuenta</p>
            <h2>Diseñado para sorprender.<br /><em>Creado para acompañarte.</em></h2>
            <p>Del primer enlace al último abrazo, cada paso está pensado para sentirse especial y funcionar con precisión.</p>
          </div>
          <div className="landing-features__grid">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <article key={feature.number} className="landing-feature" data-scene-reveal>
                  <div className="landing-feature__top"><Icon size={23} strokeWidth={1.5} /><span>{feature.number} / 06</span></div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <span className="landing-feature__rule" />
                </article>
              );
            })}
          </div>
        </section>

        <section id="flujo" className="landing-flow" data-landing-scene>
          <div className="landing-container landing-flow__inner">
            <div className="max-w-2xl" data-scene-reveal>
              <p className="eyebrow text-[#cc785c]">Un flujo, cuatro momentos</p>
              <h2 className="editorial-display mt-4 text-4xl leading-tight sm:text-5xl">
                Desde la primera idea hasta la última persona en la puerta.
              </h2>
            </div>

            <div className="landing-flow__steps mt-12 overflow-hidden rounded-xl border border-[#e6dfd8] bg-white">
              {[
                { icon: WandSparkles, phase: 'Diseñar', title: 'Elige un template y personaliza contenido, color y ritmo.', color: '#e8a55a' },
                { icon: Users, phase: 'Invitar', title: 'Carga familias, asigna pases y envía links por WhatsApp.', color: '#5db8a6' },
                { icon: CalendarDays, phase: 'Confirmar', title: 'Recibe RSVP, restricciones y mensajes sin transcribir nada.', color: '#5db872' },
                { icon: QrCode, phase: 'Recibir', title: 'Escanea el pase y dirige a cada grupo a su mesa.', color: '#e8a55a' },
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.phase} className="landing-flow__step grid gap-4 border-b border-[#e6dfd8] p-5 last:border-b-0 sm:grid-cols-[80px_140px_1fr_auto] sm:items-center sm:px-7" data-scene-reveal>
                    <span className="mono-label text-xs text-[#8e8b82]">0{index + 1}</span>
                    <span className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#141413]" style={{ backgroundColor: step.color }}>
                      <Icon className="h-3.5 w-3.5" />
                      {step.phase}
                    </span>
                    <p className="text-base text-[#3d3d3a]">{step.title}</p>
                    <ArrowRight className="hidden h-4 w-4 text-[#8e8b82] sm:block" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="templates" className="landing-templates landing-container" data-landing-scene>
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end" data-scene-reveal>
            <div className="max-w-2xl">
              <p className="eyebrow text-[#cc785c]">Colección inicial</p>
              <h2 className="editorial-display mt-4 text-4xl leading-tight sm:text-5xl">
                Diez puntos de partida. Ninguna experiencia genérica.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#3d3d3a]">
              Cada template define su propia tipografía, paleta, sobre y coreografía; el contenido sigue siendo tuyo.
            </p>
          </div>

          <div className="mt-9 flex gap-2 overflow-x-auto pb-2" role="tablist" aria-label="Filtrar templates">
            {CATEGORY_FILTERS.map((category) => (
              <button
                key={category.id}
                type="button"
                role="tab"
                aria-selected={selectedCategory === category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`h-9 shrink-0 rounded-full px-4 text-xs font-medium transition-colors ${
                  selectedCategory === category.id
                    ? 'bg-[#141413] text-[#faf9f5]'
                    : 'border border-[#d7cfc4] bg-white text-[#3d3d3a] hover:text-[#141413]'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template, index) => (
              <article key={template.id} className="landing-template group overflow-hidden rounded-xl border border-[#e6dfd8] bg-white" data-scene-reveal>
                <div className="relative aspect-[4/3] overflow-hidden bg-[#ebe6df]">
                  <img src={template.previewImage} alt={`Vista previa de ${template.name}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                    <span className="rounded-full bg-[#faf9f5]/90 px-2.5 py-1 text-[10px] font-medium text-[#141413] backdrop-blur-sm">
                      {template.categoryLabel}
                    </span>
                    <span className="mono-label rounded-full bg-[#141413]/85 px-2.5 py-1 text-[9px] text-white">0{index + 1}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-normal tracking-[-0.015em]">{template.name}</h3>
                      <p className="mt-1 text-xs leading-5 text-[#6c6a64]">{template.description}</p>
                    </div>
                    <div className="flex shrink-0 gap-1.5 pt-1">
                      {[template.colors.bgPrimary, template.colors.accentPrimary, template.colors.accentSecondary].map((color) => (
                        <span key={color} className="h-3.5 w-3.5 rounded-full border border-[#e6dfd8]" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 flex gap-2 border-t border-[#ebe6df] pt-4">
                    <Link href={`/demo-${template.id}?template=${template.id}&g=fam-invitada`} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-[#d7cfc4] text-xs font-medium transition-colors hover:bg-[#f5f0e8]">
                      <Eye className="h-3.5 w-3.5" />
                      Ver demo
                    </Link>
                    <Link href={`/login?template=${template.id}`} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#cc785c] text-xs font-medium text-white transition-colors hover:bg-[#a9583e]">
                      Usar template
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="landing-reception border-y border-[#e6dfd8] bg-white" data-landing-scene>
          <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow text-[#cc785c]">Hecho para el día real</p>
              <h2 className="editorial-display mt-4 text-4xl leading-tight sm:text-5xl">
                Menos seguimiento manual. Más tiempo para cuidar la celebración.
              </h2>
              <div className="mt-8 space-y-4">
                {[
                  'Cupo exacto por familia o grupo',
                  'Estado de cada invitación y confirmación',
                  'Enlaces listos para compartir por WhatsApp',
                  'Pases verificables y mesa visible en recepción',
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 border-b border-[#ebe6df] pb-4 text-sm text-[#3d3d3a]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#5db872]/55 text-[#141413]">
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="landing-reception__pass rounded-xl bg-[#181715] p-5 text-[#faf9f5] sm:p-7" data-scene-depth>
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div>
                  <p className="eyebrow text-[#e8a55a]">Pase de acceso</p>
                  <p className="mt-1 text-lg font-normal">Familia López García</p>
                </div>
                <QrCode className="h-10 w-10 text-white" strokeWidth={1.4} />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-white/15">
                {[
                  [Users, '4 asistentes', 'Cupo confirmado'],
                  [MapPin, 'Mesa 08', 'Jardín central'],
                  [Clock3, '17:00 hrs', 'Recepción'],
                  [ShieldCheck, 'Validado', 'Firma segura'],
                ].map(([Icon, value, label]) => {
                  const CardIcon = Icon as typeof Users;
                  return (
                    <div key={String(value)} className="bg-[#141413] p-4">
                      <CardIcon className="h-4 w-4 text-[#e8a55a]" />
                      <p className="mt-5 text-sm text-white">{String(value)}</p>
                      <p className="mt-1 text-[10px] text-white/50">{String(label)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="landing-faq mx-auto grid max-w-[1200px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.65fr_1.35fr]">
          <div>
            <p className="eyebrow text-[#cc785c]">Preguntas frecuentes</p>
            <h2 className="editorial-display mt-4 text-4xl leading-tight sm:text-5xl">Lo esencial, antes de empezar.</h2>
          </div>
          <div className="border-t border-[#e6dfd8]">
            {FAQS.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={item.question} className="border-b border-[#e6dfd8]">
                  <button type="button" onClick={() => setOpenFaq(isOpen ? null : index)} className="flex w-full items-center justify-between gap-6 py-5 text-left text-base font-medium">
                    {item.question}
                    <ChevronDown className={`h-4 w-4 shrink-0 text-[#6c6a64] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && <p className="max-w-2xl pb-6 text-sm leading-6 text-[#3d3d3a]">{item.answer}</p>}
                </div>
              );
            })}
          </div>
        </section>

        <section className="landing-final border-t border-[#e6dfd8]" data-landing-scene>
          <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
            <div className="flex flex-col items-start justify-between gap-8 rounded-xl bg-[#141413] p-8 text-[#faf9f5] sm:p-12 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <p className="eyebrow text-[#e8a55a]">Tu próximo evento puede empezar aquí</p>
                <h2 className="editorial-display mt-4 text-4xl leading-tight sm:text-5xl">Una experiencia memorable para ellos. Un sistema claro para ti.</h2>
              </div>
              <Link href="/login" className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-[#cc785c] px-5 text-sm font-medium text-white transition-colors hover:bg-[#a9583e]">
                <LayoutDashboard className="h-4 w-4" />
                Entrar al dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e6dfd8]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-5 py-12 text-sm text-[#3d3d3a] sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <BrandMark />
            <p className="mt-4 max-w-sm text-xs leading-5 text-[#6c6a64]">Invitaciones digitales interactivas, gestión de invitados y recepción en un solo espacio.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-xs">
            <a href="#producto" className="hover:text-[#141413]">Producto</a>
            <a href="#templates" className="hover:text-[#141413]">Templates</a>
            <Link href="/login" className="hover:text-[#141413]">Acceso</Link>
            <Link href="/boda-sofia-y-mateo?g=fam-lopez-8a2f" className="hover:text-[#141413]">Demo</Link>
          </div>
          <p className="mono-label text-[10px] text-[#8e8b82]">© 2026 ATELIER INVITACIONES</p>
        </div>
      </footer>
    </div>
  );
}
