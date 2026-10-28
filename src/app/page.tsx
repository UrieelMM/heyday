'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  ChevronDown,
  Clock,
  Copy,
  Eye,
  FolderKanban,
  Gift,
  Heart,
  Layers,
  LayoutDashboard,
  Lock,
  MapPin,
  Mic,
  Music,
  QrCode,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Star,
  Users,
  Wand2,
  Zap,
} from 'lucide-react';
import { TEMPLATES_CATALOG } from '@/lib/templates/templates-catalog';
import type { EventCategory } from '@/types/invitation.types';

const CATEGORY_FILTERS: Array<{
  id: 'all' | EventCategory;
  label: string;
}> = [
  { id: 'all', label: 'Todos los Templates (10)' },
  { id: 'wedding', label: 'Bodas (3)' },
  { id: 'xv_years', label: 'XV Años (2)' },
  { id: 'adult_birthday', label: 'Cumpleaños Adulto' },
  { id: 'kids_birthday', label: 'Cumpleaños Infantil' },
  { id: 'baptism_communion', label: 'Bautizo / Comunión' },
  { id: 'baby_shower', label: 'Baby Shower' },
  { id: 'graduation_gala', label: 'Graduación / Gala' },
];

const FAQS = [
  {
    q: '¿Cómo funciona el historial de invitaciones por Template y por Cliente?',
    a: 'En el Dashboard puedes seleccionar cualquiera de los 10 templates (por ejemplo, Eternal Elegance) y ver el historial paginado de todas las invitaciones creadas con esa plantilla, filtrando por nombre del cliente, rango de fechas o estado de publicación.',
  },
  {
    q: '¿Cómo se evita que los invitados confirmen personas extra no invitadas?',
    a: 'Cada familia recibe un Smart Guest Link único (ej. dominioprincipal.com/boda-sofia-mateo?g=fam-lopez). Al abrir su sobre digital, aparece su nombre impreso y el formulario RSVP bloquea automáticamente el selector al número exacto de pases asignados.',
  },
  {
    q: '¿Las invitaciones se ven bien cuando se abren desde WhatsApp en iPhone y Android?',
    a: 'Sí. El 100% de las plantillas están diseñadas bajo arquitectura Mobile-First con unidades dinámicas (dvh/svh), tipografías sin auto-zoom forzado en iOS y carga en el Edge menor a 1.5 segundos.',
  },
  {
    q: '¿Cómo funciona el Pase VIP con Código QR el día del evento?',
    a: 'Cuando el invitado confirma su asistencia, se genera al instante un Pase VIP con código QR firmado criptográficamente (HMAC-SHA256). En la entrada del salón, la hostess escanea el QR desde el modo Recepción y visualiza cuántas personas ingresan y su mesa asignada.',
  },
];

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<
    'all' | EventCategory
  >('all');
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const filteredTemplates =
    selectedCategory === 'all'
      ? TEMPLATES_CATALOG
      : TEMPLATES_CATALOG.filter((tpl) => tpl.category === selectedCategory);

  return (
    <div className="min-h-dvh bg-stone-950 text-stone-100 selection:bg-amber-500/30">
      {/* HEADER STICKY PRO */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-stone-950/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex cursor-pointer items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 shadow-lg shadow-amber-500/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-white">
                Atelier<span className="text-amber-400">Invitaciones</span>
              </span>
              <span className="ml-2 hidden rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-bold tracking-wider text-amber-300 uppercase sm:inline-block">
                SaaS & Agency Suite
              </span>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 text-xs font-semibold tracking-wider text-stone-300 uppercase lg:flex">
            <a
              href="#diferenciadores"
              className="cursor-pointer transition hover:text-amber-400"
            >
              Diferenciadores
            </a>
            <a
              href="#como-funciona"
              className="cursor-pointer transition hover:text-amber-400"
            >
              Cómo Funciona
            </a>
            <a
              href="#templates"
              className="cursor-pointer transition hover:text-amber-400"
            >
              10 Templates
            </a>
            <a
              href="#comparativa"
              className="cursor-pointer transition hover:text-amber-400"
            >
              Comparativa
            </a>
            <a
              href="#faq"
              className="cursor-pointer transition hover:text-amber-400"
            >
              Preguntas
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/boda-sofia-y-mateo?g=fam-lopez-8a2f"
              className="hidden cursor-pointer items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-stone-200 transition hover:bg-white/10 sm:inline-flex"
            >
              <Eye className="h-4 w-4 text-amber-400" />
              Demo Invitado VIP
            </Link>
            <Link
              href="/login"
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold tracking-wider text-stone-950 uppercase shadow-lg shadow-amber-500/25 transition hover:bg-amber-400"
            >
              <LayoutDashboard className="h-4 w-4" />
              Abrir Dashboard & Builder
            </Link>
          </div>
        </div>
      </header>

      {/* HERO PRINCIPAL EDITORIAL */}
      <section className="relative overflow-hidden border-b border-white/10 px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        {/* Luces de fondo */}
        <div className="pointer-events-none absolute -top-36 left-1/2 h-[460px] w-[920px] -translate-x-1/2 rounded-full bg-amber-500/12 blur-[130px]" />

        <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-14 lg:grid-cols-12">
          {/* Columna Izquierda: Copy & CTAs */}
          <div className="lg:col-span-7">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-1.5 text-xs font-semibold text-amber-300">
              <Wand2 className="h-3.5 w-3.5" />
              <span>
                Plataforma Todo-en-Uno para Agencias, Wedding Planners y Eventos
              </span>
            </div>

            <h1 className="text-4xl leading-[1.08] font-extrabold tracking-tight text-white sm:text-6xl">
              Crea y Administra{' '}
              <span className="bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500 bg-clip-text text-transparent">
                Invitaciones Digitales Premium
              </span>{' '}
              que Enamoran al Hacer Scroll.
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-relaxed text-stone-300 sm:text-lg">
              Olvídate de los PDFs estáticos y los formularios desordenados.
              Diseña invitaciones con animaciones cinematográficas{' '}
              <strong className="text-white">GSAP + Lenis</strong>, genera{' '}
              <strong className="text-white">URLs únicas por cliente</strong>,
              administra el historial completo por plantilla y controla el
              acceso con <strong className="text-white">Pases QR</strong>.
            </p>

            <div className="mt-9 flex flex-wrap items-center gap-4">
              <Link
                href="/login"
                className="inline-flex cursor-pointer items-center gap-2.5 rounded-2xl bg-amber-500 px-7 py-4 text-sm font-bold tracking-wider text-stone-950 uppercase shadow-xl shadow-amber-500/25 transition hover:bg-amber-400"
              >
                <Lock className="h-4 w-4" />
                Entrar al Dashboard & Builder
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href="#templates"
                className="inline-flex cursor-pointer items-center gap-2 rounded-2xl border border-white/15 bg-white/5 px-6 py-4 text-sm font-semibold text-white transition hover:bg-white/10"
              >
                Explorar los 10 Templates
              </a>
            </div>

            {/* Métricas de Confianza */}
            <div className="mt-12 grid grid-cols-3 gap-6 border-t border-white/10 pt-8">
              <div>
                <p className="text-2xl font-extrabold text-amber-400 sm:text-3xl">
                  10+
                </p>
                <p className="mt-1 text-xs text-stone-400">
                  Templates Scrollytelling con historial por cliente
                </p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-amber-400 sm:text-3xl">
                  &lt; 1.2s
                </p>
                <p className="mt-1 text-xs text-stone-400">
                  Carga instantánea en el navegador de WhatsApp
                </p>
              </div>
              <div>
                <p className="text-2xl font-extrabold text-amber-400 sm:text-3xl">
                  100%
                </p>
                <p className="mt-1 text-xs text-stone-400">
                  Control de cupos RSVP y Pases QR firmados
                </p>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Mockup Interactivo Multi-Capas */}
          <div className="relative lg:col-span-5">
            <div className="relative mx-auto max-w-md rounded-3xl border border-white/15 bg-stone-900/90 p-5 shadow-2xl">
              <div className="mb-4 flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </div>
                <span className="rounded-md bg-stone-950 px-2.5 py-1 font-mono text-[11px] text-amber-300">
                  dominioprincipal.com/boda-sofia-y-mateo
                </span>
              </div>

              <div className="relative h-80 overflow-hidden rounded-2xl">
                <img
                  src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=900&q=80"
                  alt="Preview Invitación"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/30 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-center">
                  <span className="inline-block rounded-full border border-amber-400/50 bg-stone-950/80 px-3 py-1 text-[10px] font-semibold tracking-widest text-amber-300 uppercase">
                    Pase para Familia López (4 Adultos)
                  </span>
                  <h3 className="mt-2 font-serif text-3xl font-semibold text-white">
                    Sofía & Mateo
                  </h3>
                  <p className="mt-1 text-xs tracking-widest text-stone-300 uppercase">
                    San Miguel de Allende • 2026
                  </p>
                </div>
              </div>

              {/* Mini tarjetas de CTA interactivas */}
              <div className="mt-4 grid grid-cols-3 gap-2.5 text-center text-[11px] font-semibold">
                <div className="rounded-xl border border-white/10 bg-stone-950 p-2.5 text-stone-200">
                  <MapPin className="mx-auto mb-1 h-4 w-4 text-amber-400" />
                  Maps & Waze
                </div>
                <div className="rounded-xl border border-white/10 bg-stone-950 p-2.5 text-stone-200">
                  <QrCode className="mx-auto mb-1 h-4 w-4 text-emerald-400" />
                  Pase VIP QR
                </div>
                <div className="rounded-xl border border-white/10 bg-stone-950 p-2.5 text-stone-200">
                  <Music className="mx-auto mb-1 h-4 w-4 text-pink-400" />
                  Audio + DJ
                </div>
              </div>

              <Link
                href="/boda-sofia-y-mateo?g=fam-lopez-8a2f"
                className="mt-4 flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-white/10 py-3 text-xs font-bold tracking-wider text-white uppercase transition hover:bg-amber-500 hover:text-stone-950"
              >
                <Eye className="h-4 w-4" />
                Abrir Esta Invitación en Vivo
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* SECCIÓN DE DIFERENCIADORES (BENTO GRID PRO) */}
      <section
        id="diferenciadores"
        className="mx-auto max-w-7xl px-6 py-24"
      >
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold tracking-[0.25em] text-amber-400 uppercase">
            Ventajas Competitivas Reales
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-5xl">
            Todo lo que tu Agencia o Evento Necesita en una Sola Plataforma
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-stone-400 sm:text-base">
            Diseñado para superar a las plataformas convencionales tanto en
            estética visual como en control administrativo para múltiples
            clientes.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: FolderKanban,
              badge: 'Multi-Cliente & Historial',
              title: 'Historial de Invitaciones por Template',
              desc: 'Selecciona cualquier plantilla (ej. Eternal Elegance) y consulta todas las invitaciones que has creado con ese diseño, con filtros por cliente, fecha y paginación.',
            },
            {
              icon: Users,
              badge: 'Cero Colados',
              title: 'Smart Guest Links Nominales',
              desc: 'Cada familia recibe un link personalizado (?g=fam-lopez) con su nombre impreso en el sobre y límite estricto de boletos en el formulario RSVP.',
            },
            {
              icon: QrCode,
              badge: 'Seguridad HMAC-SHA256',
              title: 'Pase VIP QR + Escáner en Recepción',
              desc: 'Al confirmar asistencia se genera un Pase QR descargable. El día del evento, el personal valida el QR en puerta y ve la mesa asignada.',
            },
            {
              icon: Zap,
              badge: 'GSAP + Lenis 60fps',
              title: 'Scrollytelling y Sobre Lacre Interactivo',
              desc: 'Apertura de sobre con sello personalizado, música de fondo automática, partículas en Canvas y revelados fotográficos suaves.',
            },
            {
              icon: MapPin,
              badge: 'Conversión Instantánea',
              title: 'Botones CTA Directos (Maps, Waze, CLABE)',
              desc: 'Rutas directas a Google Maps y Waze, agendado en Apple/Google Calendar (.ics), mesas de regalo y copia de CLABE bancaria en 1 clic.',
            },
            {
              icon: Mic,
              badge: 'Experiencia Social',
              title: 'Audio Guestbook & DJ Playlist',
              desc: 'Los invitados graban notas de voz de felicitación desde su navegador y votan por las canciones que no pueden faltar en la pista.',
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="group rounded-3xl border border-white/10 bg-stone-900/60 p-7 transition hover:border-amber-500/40 hover:bg-stone-900"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="rounded-full border border-white/10 bg-stone-950 px-3 py-1 text-[10px] font-bold tracking-wider text-amber-300 uppercase">
                    {item.badge}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-stone-400">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECCIÓN CÓMO FUNCIONA EN 3 PASOS */}
      <section
        id="como-funciona"
        className="border-y border-white/10 bg-stone-900/40 px-6 py-24"
      >
        <div className="mx-auto max-w-6xl">
          <div className="text-center">
            <p className="text-xs font-bold tracking-[0.25em] text-amber-400 uppercase">
              Flujo de Trabajo Ágil
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              De Cero a una Invitación Publicada en Minutos
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                step: '01',
                title: 'Elige un Template y Registra al Cliente',
                desc: 'Selecciona una de las 10 plantillas premium, asigna el nombre del cliente, fecha del evento y genera su URL única (dominioprincipal.com/id).',
              },
              {
                step: '02',
                title: 'Personaliza en el Constructor Split-Screen',
                desc: 'Modifica fotografías, tipografías, paleta de colores, ubicaciones Maps/Waze, mesa de regalos y activa o desactiva cualquiera de las 12 secciones.',
              },
              {
                step: '03',
                title: 'Envía por WhatsApp y Recibe Confirmaciones',
                desc: 'Comparte los links personalizados por familia en 1 clic, monitorea las confirmaciones en tiempo real y escanea los pases QR el día del evento.',
              },
            ].map((st) => (
              <div
                key={st.step}
                className="relative rounded-3xl border border-white/10 bg-stone-950 p-8"
              >
                <span className="font-mono text-4xl font-extrabold text-amber-500/30">
                  {st.step}
                </span>
                <h3 className="mt-3 text-xl font-bold text-white">
                  {st.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-400">
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATÁLOGO INTERACTIVO DE LOS 10 TEMPLATES CON FILTROS */}
      <section id="templates" className="mx-auto max-w-7xl px-6 py-24">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <div>
            <p className="text-xs font-bold tracking-[0.25em] text-amber-400 uppercase">
              Colección Oficial
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-5xl">
              10 Templates Iniciales de Diseño Premium
            </h2>
          </div>
          <p className="max-w-md text-sm text-stone-400">
            Filtra por tipo de celebración, prueba la experiencia animada en
            vivo o selecciónalo para crear una nueva invitación de cliente en el
            Dashboard.
          </p>
        </div>

        {/* Barra de Filtros por Categoría */}
        <div className="mt-8 flex flex-wrap gap-2">
          {CATEGORY_FILTERS.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`cursor-pointer rounded-full px-4 py-2 text-xs font-bold tracking-wider uppercase transition ${
                selectedCategory === cat.id
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'border border-white/10 bg-stone-900 text-stone-300 hover:border-white/25 hover:text-white'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Grid de Templates */}
        <div className="mt-10 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {filteredTemplates.map((tpl, index) => (
            <div
              key={tpl.id}
              className="group flex flex-col overflow-hidden rounded-3xl border border-white/10 bg-stone-900/70 transition duration-300 hover:-translate-y-1 hover:border-amber-500/40"
            >
              <div className="relative h-60 overflow-hidden">
                <img
                  src={tpl.previewImage}
                  alt={tpl.name}
                  className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/25 to-transparent" />
                <span className="absolute top-3.5 left-3.5 rounded-full bg-stone-950/85 px-3 py-1 text-[11px] font-semibold text-amber-300 backdrop-blur-md">
                  #{index + 1} • {tpl.categoryLabel}
                </span>
                <span className="absolute top-3.5 right-3.5 rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-[10px] font-medium text-white backdrop-blur-md">
                  {tpl.badge}
                </span>
              </div>

              <div className="flex flex-1 flex-col justify-between p-6">
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="text-xl font-bold text-white">
                      {tpl.name}
                    </h3>
                    <div className="flex items-center gap-1.5">
                      {[
                        tpl.colors.bgPrimary,
                        tpl.colors.accentPrimary,
                        tpl.colors.accentSecondary,
                      ].map((hex, i) => (
                        <span
                          key={i}
                          className="h-4 w-4 rounded-full border border-white/20"
                          style={{ backgroundColor: hex }}
                          title={hex}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs leading-relaxed text-stone-400">
                    {tpl.description}
                  </p>
                  <p className="mt-3 text-[11px] font-semibold text-amber-400">
                    ✦ Animación: {tpl.signatureAnimation}
                  </p>
                </div>

                <div className="mt-6 flex gap-2.5 pt-2">
                  <Link
                    href={`/demo-${tpl.id}?template=${tpl.id}&g=fam-invitada`}
                    className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-white/15"
                  >
                    <Eye className="h-3.5 w-3.5 text-amber-400" />
                    Ver Demo
                  </Link>
                  <Link
                    href={`/login?template=${tpl.id}`}
                    className="inline-flex flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold text-stone-950 transition hover:bg-amber-400"
                  >
                    Usar Template
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECCIÓN COMPARATIVA */}
      <section
        id="comparativa"
        className="border-t border-white/10 bg-stone-900/30 px-6 py-24"
      >
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <p className="text-xs font-bold tracking-[0.25em] text-amber-400 uppercase">
              Por Qué Elegirnos
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
              Atelier Invitaciones vs. Alternativas Tradicionales
            </h2>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-white/10 bg-stone-900">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-stone-950 text-xs uppercase">
                <tr>
                  <th className="px-6 py-4 text-stone-400">Característica</th>
                  <th className="px-6 py-4 font-bold text-amber-400">
                    Atelier Invitaciones Pro
                  </th>
                  <th className="px-6 py-4 text-stone-400">
                    PDF / Imagen en Canva
                  </th>
                  <th className="px-6 py-4 text-stone-400">
                    Sitios Genéricos WordPress
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10 text-xs sm:text-sm">
                {[
                  [
                    'Animaciones Scrollytelling 60fps (GSAP + Lenis)',
                    'Incluido en los 10 templates',
                    'Estático sin animación',
                    'Básico y pesado al cargar',
                  ],
                  [
                    'Historial de invitaciones organizadas por Template y Cliente',
                    'Panel completo con filtros y paginación',
                    'Archivos sueltos',
                    'Manual por cada instalación',
                  ],
                  [
                    'Links nominales con bloqueo de pases por familia',
                    'Automático (?g=familia)',
                    'No disponible',
                    'Limitado',
                  ],
                  [
                    'Pase VIP QR Criptográfico + Escáner en Recepción',
                    'Incluido con firma HMAC',
                    'No disponible',
                    'Costo extra por evento',
                  ],
                  [
                    'Audio Guestbook + DJ Playlist con Votación',
                    'Integrado en la invitación',
                    'No disponible',
                    'No disponible',
                  ],
                ].map((row, idx) => (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="px-6 py-4 font-semibold text-white">
                      {row[0]}
                    </td>
                    <td className="px-6 py-4 font-bold text-emerald-400">
                      ✓ {row[1]}
                    </td>
                    <td className="px-6 py-4 text-stone-500">{row[2]}</td>
                    <td className="px-6 py-4 text-stone-400">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* PREGUNTAS FRECUENTES (FAQ) */}
      <section id="faq" className="mx-auto max-w-4xl px-6 py-24">
        <div className="mb-12 text-center">
          <p className="text-xs font-bold tracking-[0.25em] text-amber-400 uppercase">
            Resolvemos tus Dudas
          </p>
          <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
            Preguntas Frecuentes
          </h2>
        </div>

        <div className="space-y-4">
          {FAQS.map((item, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="overflow-hidden rounded-2xl border border-white/10 bg-stone-900/60"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="flex w-full cursor-pointer items-center justify-between px-6 py-5 text-left font-bold text-white transition hover:bg-white/[0.02]"
                >
                  <span>{item.q}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-amber-400 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="border-t border-white/10 px-6 py-4 text-sm leading-relaxed text-stone-300">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* CTA FINAL + FOOTER */}
      <footer className="border-t border-white/10 bg-stone-900/80 px-6 py-16">
        <div className="mx-auto max-w-5xl rounded-3xl border border-amber-500/30 bg-gradient-to-r from-stone-900 via-stone-900 to-amber-950/40 p-8 text-center sm:p-12">
          <h2 className="text-2xl font-extrabold text-white sm:text-4xl">
            ¿Listo para Crear y Administrar Invitaciones para tus Clientes?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-stone-300">
            Inicia sesión en el panel de administración para gestionar el
            historial de invitaciones por template, filtrar por cliente o fecha
            y personalizar en vivo.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-4">
            <Link
              href="/login"
              className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-amber-500 px-8 py-4 text-xs font-bold tracking-wider text-stone-950 uppercase shadow-lg shadow-amber-500/25 transition hover:bg-amber-400"
            >
              <LayoutDashboard className="h-4 w-4" />
              Iniciar Sesión como Administrador
            </Link>
          </div>
        </div>

        <div className="mx-auto mt-12 flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-stone-500 sm:flex-row">
          <p>
            © 2026 Atelier Invitaciones Digitales. Todos los derechos
            reservados.
          </p>
          <div className="flex gap-6">
            <Link href="/login" className="cursor-pointer hover:text-stone-300">
              Acceso Admin
            </Link>
            <Link
              href="/boda-sofia-y-mateo?g=fam-lopez-8a2f"
              className="cursor-pointer hover:text-stone-300"
            >
              Demo Invitación
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
