'use client';

import React, { useState } from 'react';
import Link from 'next/link';
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
      <span className="grid h-8 w-8 grid-cols-2 gap-0.5 rounded-md bg-[#f54e00] p-1.5 text-white">
        <span className="rounded-[1px] bg-white/95" />
        <span className="rounded-[1px] bg-white/65" />
        <span className="rounded-[1px] bg-white/65" />
        <span className="rounded-[1px] bg-white/95" />
      </span>
      {!compact && (
        <span className="text-[15px] font-medium tracking-[-0.02em] text-[#f54e00]">
          Atelier Invitaciones
        </span>
      )}
    </span>
  );
}

function ProductPreview() {
  return (
    <div className="overflow-hidden rounded-xl border border-[#cfcdc4] bg-white">
      <div className="flex h-11 items-center justify-between border-b border-[#e6e5e0] px-4">
        <div className="flex items-center gap-2">
          <BrandMark compact />
          <span className="hidden text-xs text-[#807d72] sm:inline">Panel de evento</span>
        </div>
        <span className="mono-label rounded-md bg-[#efeee8] px-2.5 py-1 text-[10px] text-[#5a5852]">
          /boda-sofia-y-mateo
        </span>
      </div>

      <div className="grid min-h-[430px] sm:grid-cols-[150px_1fr]">
        <aside className="hidden border-r border-[#e6e5e0] bg-[#fafaf7] p-3 sm:block">
          <p className="eyebrow px-2 py-2 text-[#a09c92]">Espacio</p>
          {['Resumen', 'Diseño', 'Invitados', 'Recepción'].map((item, index) => (
            <div
              key={item}
              className={`mb-1 flex items-center gap-2 rounded-md px-2.5 py-2 text-xs ${
                index === 0
                  ? 'bg-[#efeee8] font-medium text-[#26251e]'
                  : 'text-[#807d72]'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${index === 0 ? 'bg-[#f54e00]' : 'bg-[#cfcdc4]'}`} />
              {item}
            </div>
          ))}
        </aside>

        <div className="p-4 sm:p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="eyebrow text-[#f54e00]">Boda · 24 oct 2026</p>
              <h2 className="mt-1 text-[22px] font-normal tracking-[-0.02em] text-[#26251e]">
                Sofía & Mateo
              </h2>
            </div>
            <span className="rounded-full bg-[#9fc9a2]/55 px-2.5 py-1 text-[10px] font-medium text-[#26251e]">
              Publicada
            </span>
          </div>

          <div className="mt-5 grid grid-cols-3 gap-2">
            {[
              ['85', 'familias'],
              ['142', 'confirmados'],
              ['68%', 'abrieron'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-lg border border-[#e6e5e0] bg-[#fafaf7] p-3">
                <p className="text-xl font-normal tracking-[-0.03em] text-[#26251e]">{value}</p>
                <p className="mt-1 text-[10px] text-[#807d72]">{label}</p>
              </div>
            ))}
          </div>

          <div className="mt-3 grid gap-3 lg:grid-cols-[1.15fr_.85fr]">
            <div className="rounded-lg border border-[#e6e5e0] p-3.5">
              <div className="mb-4 flex items-center justify-between">
                <p className="text-xs font-medium text-[#26251e]">Actividad del evento</p>
                <span className="mono-label text-[9px] text-[#a09c92]">EN VIVO</span>
              </div>
              <div className="space-y-3">
                {[
                  ['Invitación abierta', 'Familia López', '#9fbbe0'],
                  ['RSVP confirmado', '4 asistentes', '#9fc9a2'],
                  ['Pase generado', 'Mesa 08', '#c0a8dd'],
                  ['Link enviado', 'WhatsApp', '#dfa88f'],
                ].map(([action, detail, color]) => (
                  <div key={`${action}-${detail}`} className="grid grid-cols-[8px_1fr_auto] items-center gap-2.5">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: color }} />
                    <span className="text-[11px] text-[#5a5852]">{action}</span>
                    <span className="mono-label text-[9px] text-[#a09c92]">{detail}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative min-h-48 overflow-hidden rounded-lg bg-[#26251e] p-4 text-white">
              <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full border border-white/15" />
              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <span className="eyebrow text-[#dfa88f]">Vista del invitado</span>
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
  const [selectedCategory, setSelectedCategory] = useState<'all' | EventCategory>('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredTemplates =
    selectedCategory === 'all'
      ? TEMPLATES_CATALOG
      : TEMPLATES_CATALOG.filter((template) => template.category === selectedCategory);

  return (
    <div className="min-h-dvh bg-[#f7f7f4] text-[#26251e]">
      <header className="sticky top-0 z-40 border-b border-[#e6e5e0] bg-[#f7f7f4]/95 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between px-5 sm:px-8">
          <Link href="/" className="shrink-0">
            <BrandMark />
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-[#5a5852] lg:flex" aria-label="Navegación principal">
            <a href="#producto" className="transition-colors hover:text-[#26251e]">Producto</a>
            <a href="#flujo" className="transition-colors hover:text-[#26251e]">Cómo funciona</a>
            <a href="#templates" className="transition-colors hover:text-[#26251e]">Templates</a>
            <a href="#faq" className="transition-colors hover:text-[#26251e]">Preguntas</a>
          </nav>

          <div className="flex items-center gap-2">
            <Link
              href="/boda-sofia-y-mateo?g=fam-lopez-8a2f"
              className="hidden h-10 items-center rounded-lg border border-[#cfcdc4] bg-white px-4 text-sm text-[#26251e] transition-colors hover:bg-[#fafaf7] sm:inline-flex"
            >
              Ver demo
            </Link>
            <Link
              href="/login"
              className="inline-flex h-10 items-center gap-2 rounded-lg bg-[#f54e00] px-4 text-sm font-medium text-white transition-colors hover:bg-[#d04200]"
            >
              Abrir panel
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="border-b border-[#e6e5e0]">
          <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-[.9fr_1.1fr] lg:items-center lg:py-24">
            <div>
              <p className="eyebrow text-[#f54e00]">Invitaciones digitales · Operación completa</p>
              <h1 className="editorial-display mt-5 max-w-2xl text-[46px] leading-[1.02] sm:text-[64px] lg:text-[72px]">
                Una invitación que ya conoce a cada invitado.
              </h1>
              <p className="mt-6 max-w-xl text-base leading-7 text-[#5a5852] sm:text-lg">
                Diseña experiencias interactivas, controla confirmaciones y recibe a tus invitados con pases QR. Todo desde un solo lugar, sin perder el cuidado de un estudio boutique.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/login"
                  className="inline-flex h-11 items-center gap-2 rounded-lg bg-[#f54e00] px-5 text-sm font-medium text-white transition-colors hover:bg-[#d04200]"
                >
                  Crear una invitación
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <Link
                  href="/boda-sofia-y-mateo?g=fam-lopez-8a2f"
                  className="inline-flex h-11 items-center gap-2 rounded-lg border border-[#cfcdc4] bg-white px-5 text-sm font-medium text-[#26251e] transition-colors hover:bg-[#fafaf7]"
                >
                  <Eye className="h-4 w-4" />
                  Abrir demo personalizada
                </Link>
              </div>
              <div className="mt-10 grid max-w-lg grid-cols-3 border-t border-[#e6e5e0] pt-5">
                {[
                  ['10', 'templates de autor'],
                  ['12', 'secciones modulares'],
                  ['1', 'flujo de principio a fin'],
                ].map(([number, label]) => (
                  <div key={label} className="pr-4">
                    <p className="text-2xl font-normal tracking-[-0.03em]">{number}</p>
                    <p className="mt-1 text-xs leading-4 text-[#807d72]">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <ProductPreview />
          </div>
        </section>

        <section id="producto" className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
            <div>
              <p className="eyebrow text-[#f54e00]">Pensado como sistema</p>
              <h2 className="editorial-display mt-4 text-4xl leading-tight sm:text-5xl">
                Belleza para quien recibe. Control para quien organiza.
              </h2>
              <p className="mt-5 max-w-md text-base leading-7 text-[#5a5852]">
                La parte visible emociona; detrás, cada respuesta, pase y dato logístico queda listo para trabajar.
              </p>
            </div>

            <div className="grid border-l border-t border-[#e6e5e0] sm:grid-cols-2">
              {FEATURES.map((feature) => {
                const Icon = feature.icon;
                return (
                  <article key={feature.number} className="min-h-64 border-b border-r border-[#e6e5e0] bg-white p-6 sm:p-7">
                    <div className="flex items-center justify-between">
                      <Icon className="h-5 w-5 text-[#f54e00]" strokeWidth={1.6} />
                      <span className="mono-label text-[11px] text-[#a09c92]">{feature.number}</span>
                    </div>
                    <h3 className="mt-10 text-xl font-normal leading-7 tracking-[-0.015em]">{feature.title}</h3>
                    <p className="mt-3 text-sm leading-6 text-[#5a5852]">{feature.description}</p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        <section id="flujo" className="border-y border-[#e6e5e0] bg-[#fafaf7]">
          <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
            <div className="max-w-2xl">
              <p className="eyebrow text-[#f54e00]">Un flujo, cuatro momentos</p>
              <h2 className="editorial-display mt-4 text-4xl leading-tight sm:text-5xl">
                Desde la primera idea hasta la última persona en la puerta.
              </h2>
            </div>

            <div className="mt-12 overflow-hidden rounded-xl border border-[#e6e5e0] bg-white">
              {[
                { icon: WandSparkles, phase: 'Diseñar', title: 'Elige un template y personaliza contenido, color y ritmo.', color: '#dfa88f' },
                { icon: Users, phase: 'Invitar', title: 'Carga familias, asigna pases y envía links por WhatsApp.', color: '#9fbbe0' },
                { icon: CalendarDays, phase: 'Confirmar', title: 'Recibe RSVP, restricciones y mensajes sin transcribir nada.', color: '#9fc9a2' },
                { icon: QrCode, phase: 'Recibir', title: 'Escanea el pase y dirige a cada grupo a su mesa.', color: '#c0a8dd' },
              ].map((step, index) => {
                const Icon = step.icon;
                return (
                  <div key={step.phase} className="grid gap-4 border-b border-[#e6e5e0] p-5 last:border-b-0 sm:grid-cols-[80px_140px_1fr_auto] sm:items-center sm:px-7">
                    <span className="mono-label text-xs text-[#a09c92]">0{index + 1}</span>
                    <span className="inline-flex w-fit items-center gap-2 rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#26251e]" style={{ backgroundColor: step.color }}>
                      <Icon className="h-3.5 w-3.5" />
                      {step.phase}
                    </span>
                    <p className="text-base text-[#5a5852]">{step.title}</p>
                    <ArrowRight className="hidden h-4 w-4 text-[#a09c92] sm:block" />
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="templates" className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div className="max-w-2xl">
              <p className="eyebrow text-[#f54e00]">Colección inicial</p>
              <h2 className="editorial-display mt-4 text-4xl leading-tight sm:text-5xl">
                Diez puntos de partida. Ninguna experiencia genérica.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#5a5852]">
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
                    ? 'bg-[#26251e] text-[#f7f7f4]'
                    : 'border border-[#cfcdc4] bg-white text-[#5a5852] hover:text-[#26251e]'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>

          <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template, index) => (
              <article key={template.id} className="group overflow-hidden rounded-xl border border-[#e6e5e0] bg-white">
                <div className="relative aspect-[4/3] overflow-hidden bg-[#efeee8]">
                  <img src={template.previewImage} alt={`Vista previa de ${template.name}`} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.025]" />
                  <div className="absolute inset-x-0 top-0 flex items-center justify-between p-3">
                    <span className="rounded-full bg-[#f7f7f4]/90 px-2.5 py-1 text-[10px] font-medium text-[#26251e] backdrop-blur-sm">
                      {template.categoryLabel}
                    </span>
                    <span className="mono-label rounded-full bg-[#26251e]/85 px-2.5 py-1 text-[9px] text-white">0{index + 1}</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-normal tracking-[-0.015em]">{template.name}</h3>
                      <p className="mt-1 text-xs leading-5 text-[#807d72]">{template.description}</p>
                    </div>
                    <div className="flex shrink-0 gap-1.5 pt-1">
                      {[template.colors.bgPrimary, template.colors.accentPrimary, template.colors.accentSecondary].map((color) => (
                        <span key={color} className="h-3.5 w-3.5 rounded-full border border-[#e6e5e0]" style={{ backgroundColor: color }} />
                      ))}
                    </div>
                  </div>
                  <div className="mt-5 flex gap-2 border-t border-[#efeee8] pt-4">
                    <Link href={`/demo-${template.id}?template=${template.id}&g=fam-invitada`} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-[#cfcdc4] text-xs font-medium transition-colors hover:bg-[#fafaf7]">
                      <Eye className="h-3.5 w-3.5" />
                      Ver demo
                    </Link>
                    <Link href={`/login?template=${template.id}`} className="inline-flex h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-[#f54e00] text-xs font-medium text-white transition-colors hover:bg-[#d04200]">
                      Usar template
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="border-y border-[#e6e5e0] bg-white">
          <div className="mx-auto grid max-w-[1200px] gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="eyebrow text-[#f54e00]">Hecho para el día real</p>
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
                  <div key={item} className="flex items-center gap-3 border-b border-[#efeee8] pb-4 text-sm text-[#5a5852]">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#9fc9a2]/55 text-[#26251e]">
                      <Check className="h-3 w-3" strokeWidth={2.5} />
                    </span>
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-[#26251e] p-5 text-[#f7f7f4] sm:p-7">
              <div className="flex items-center justify-between border-b border-white/15 pb-4">
                <div>
                  <p className="eyebrow text-[#dfa88f]">Pase de acceso</p>
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
                    <div key={String(value)} className="bg-[#26251e] p-4">
                      <CardIcon className="h-4 w-4 text-[#dfa88f]" />
                      <p className="mt-5 text-sm text-white">{String(value)}</p>
                      <p className="mt-1 text-[10px] text-white/50">{String(label)}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        <section id="faq" className="mx-auto grid max-w-[1200px] gap-10 px-5 py-20 sm:px-8 lg:grid-cols-[.65fr_1.35fr]">
          <div>
            <p className="eyebrow text-[#f54e00]">Preguntas frecuentes</p>
            <h2 className="editorial-display mt-4 text-4xl leading-tight sm:text-5xl">Lo esencial, antes de empezar.</h2>
          </div>
          <div className="border-t border-[#e6e5e0]">
            {FAQS.map((item, index) => {
              const isOpen = openFaq === index;
              return (
                <div key={item.question} className="border-b border-[#e6e5e0]">
                  <button type="button" onClick={() => setOpenFaq(isOpen ? null : index)} className="flex w-full items-center justify-between gap-6 py-5 text-left text-base font-medium">
                    {item.question}
                    <ChevronDown className={`h-4 w-4 shrink-0 text-[#807d72] transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && <p className="max-w-2xl pb-6 text-sm leading-6 text-[#5a5852]">{item.answer}</p>}
                </div>
              );
            })}
          </div>
        </section>

        <section className="border-t border-[#e6e5e0]">
          <div className="mx-auto max-w-[1200px] px-5 py-20 sm:px-8">
            <div className="flex flex-col items-start justify-between gap-8 rounded-xl bg-[#26251e] p-8 text-[#f7f7f4] sm:p-12 lg:flex-row lg:items-end">
              <div className="max-w-2xl">
                <p className="eyebrow text-[#dfa88f]">Tu próximo evento puede empezar aquí</p>
                <h2 className="editorial-display mt-4 text-4xl leading-tight sm:text-5xl">Una experiencia memorable para ellos. Un sistema claro para ti.</h2>
              </div>
              <Link href="/login" className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg bg-[#f54e00] px-5 text-sm font-medium text-white transition-colors hover:bg-[#d04200]">
                <LayoutDashboard className="h-4 w-4" />
                Entrar al dashboard
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e6e5e0]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-5 py-12 text-sm text-[#5a5852] sm:px-8 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <BrandMark />
            <p className="mt-4 max-w-sm text-xs leading-5 text-[#807d72]">Invitaciones digitales interactivas, gestión de invitados y recepción en un solo espacio.</p>
          </div>
          <div className="flex flex-wrap gap-6 text-xs">
            <a href="#producto" className="hover:text-[#26251e]">Producto</a>
            <a href="#templates" className="hover:text-[#26251e]">Templates</a>
            <Link href="/login" className="hover:text-[#26251e]">Acceso</Link>
            <Link href="/boda-sofia-y-mateo?g=fam-lopez-8a2f" className="hover:text-[#26251e]">Demo</Link>
          </div>
          <p className="mono-label text-[10px] text-[#a09c92]">© 2026 ATELIER INVITACIONES</p>
        </div>
      </footer>
    </div>
  );
}
