'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import {
  CheckCircle2,
  Copy,
  ExternalLink,
  Eye,
  Layout,
  Monitor,
  Palette,
  QrCode,
  Send,
  Smartphone,
  Sparkles,
  Tablet,
  Undo2,
  Redo2,
  Users,
  Wand2,
} from 'lucide-react';
import { useBuilderStore } from '@/stores/useBuilderStore';
import { TEMPLATES_CATALOG } from '@/lib/templates/templates-catalog';
import { InvitationRenderer } from '@/components/invitation/core/InvitationRenderer';
import { buildWhatsappInviteUrl } from '@/lib/whatsapp/link-builder';
import type { GuestGroup, SectionId, TemplateId } from '@/types/invitation.types';

const SECTION_LABELS: Record<SectionId, string> = {
  hero: '1. Portada Principal (Hero)',
  quote_story: '2. Frase Emotiva e Historia',
  vip_parents: '3. Padres y Padrinos de Honor',
  countdown: '4. Cuenta Regresiva + Calendario',
  locations: '5. Ubicaciones (Google Maps / Waze)',
  timeline: '6. Itinerario del Evento',
  gallery: '7. Galería Multimedia',
  dress_code: '8. Código de Vestimenta',
  gifts: '9. Mesa de Regalos y CLABE',
  accommodation: '10. Hoteles Sugeridos',
  social_features: '11. DJ Playlist & Audio Guestbook',
  rsvp: '12. Confirmación RSVP + Pase QR',
};

export default function DashboardBuilderPage() {
  const {
    slug,
    title,
    eventDate,
    templateId,
    viewport,
    config,
    previewEnvelopeOpen,
    setTemplate,
    setViewport,
    setPreviewEnvelopeOpen,
    setMeta,
    updateThemeColors,
    updateEnvelope,
    toggleSection,
    updateHero,
    updateDressCode,
  } = useBuilderStore();

  const [activeTab, setActiveTab] = useState<'builder' | 'guests' | 'checkin'>(
    'builder'
  );
  const [inspectorTab, setInspectorTab] = useState<
    'templates' | 'colors' | 'content' | 'sections'
  >('templates');

  // Lista interactiva de invitados en el CRM del Dashboard
  const [guests, setGuests] = useState<GuestGroup[]>([
    {
      id: '1',
      eventId: 'demo-event-001',
      guestToken: 'fam-lopez-8a2f',
      groupName: 'Familia López García',
      whatsappPhone: '525512345678',
      groupTag: 'Familia Novia',
      allocatedAdults: 4,
      allocatedChildren: 1,
      rsvpStatus: 'confirmed',
      confirmedAdults: 4,
      confirmedChildren: 1,
      tableName: 'Mesa 4',
      checkedInCount: 0,
    },
    {
      id: '2',
      eventId: 'demo-event-001',
      guestToken: 'fam-mendoza-3b9c',
      groupName: 'Familia Mendoza Ruiz',
      whatsappPhone: '525587654321',
      groupTag: 'Familia Novio',
      allocatedAdults: 2,
      allocatedChildren: 0,
      rsvpStatus: 'viewed',
      confirmedAdults: 0,
      confirmedChildren: 0,
      tableName: 'Mesa 2',
      checkedInCount: 0,
    },
    {
      id: '3',
      eventId: 'demo-event-001',
      guestToken: 'ing-carlos-torres',
      groupName: 'Ing. Carlos Torres y Sra.',
      whatsappPhone: '525511223344',
      groupTag: 'Amigos VIP',
      allocatedAdults: 2,
      allocatedChildren: 0,
      rsvpStatus: 'confirmed',
      confirmedAdults: 2,
      confirmedChildren: 0,
      tableName: 'Mesa 1',
      checkedInCount: 2,
    },
  ]);

  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestAdults, setNewGuestAdults] = useState(2);
  const [newGuestChildren, setNewGuestChildren] = useState(0);
  const [newGuestTable, setNewGuestTable] = useState('Mesa 5');

  const handleAddGuestGroup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    const token =
      'fam-' +
      newGuestName
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 14) +
      '-' +
      Math.random().toString(36).slice(2, 6);

    setGuests((prev) => [
      {
        id: String(Date.now()),
        eventId: 'demo-event-001',
        guestToken: token,
        groupName: newGuestName.trim(),
        whatsappPhone: newGuestPhone.trim() || '525500000000',
        groupTag: 'Invitado',
        allocatedAdults: newGuestAdults,
        allocatedChildren: newGuestChildren,
        rsvpStatus: 'pending',
        confirmedAdults: 0,
        confirmedChildren: 0,
        tableName: newGuestTable,
        checkedInCount: 0,
      },
      ...prev,
    ]);
    setNewGuestName('');
    setNewGuestPhone('');
    toast.success(`Pase único creado para ${newGuestName}`);
  };

  const totalAllocated = guests.reduce(
    (acc, g) => acc + g.allocatedAdults + g.allocatedChildren,
    0
  );
  const totalConfirmed = guests.reduce(
    (acc, g) => acc + g.confirmedAdults + g.confirmedChildren,
    0
  );

  return (
    <div className="flex min-h-dvh flex-col bg-stone-950 text-stone-100">
      {/* Topbar del Dashboard */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-stone-900/90 px-6 py-3.5 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-stone-950">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold tracking-tight text-white">
              Atelier<span className="text-amber-400">Admin</span>
            </span>
          </Link>

          <div className="h-5 w-px bg-white/15" />

          {/* Navegación de Módulos del Evento */}
          <div className="flex rounded-xl border border-white/10 bg-stone-950 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('builder')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === 'builder'
                  ? 'bg-amber-500 text-stone-950'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Wand2 className="h-3.5 w-3.5" />
              Constructor Visual
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('guests')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === 'guests'
                  ? 'bg-amber-500 text-stone-950'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              Invitados & Links WhatsApp ({guests.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('checkin')}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === 'checkin'
                  ? 'bg-amber-500 text-stone-950'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <QrCode className="h-3.5 w-3.5" />
              Recepción & Escáner QR
            </button>
          </div>
        </div>

        {/* URL Personalizada Activa + Botón Publicar */}
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-stone-950 px-3 py-1.5 text-xs lg:flex">
            <span className="text-stone-500">URL cliente:</span>
            <code className="font-semibold text-amber-400">
              dominioprincipal.com/{slug}
            </code>
            <Link
              href={`/${slug}?template=${templateId}&g=fam-lopez-8a2f`}
              target="_blank"
              className="ml-1 inline-flex items-center gap-1 text-stone-300 hover:text-white"
            >
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>

          <button
            type="button"
            onClick={() =>
              toast.success(
                `¡Invitación publicada en /${slug}! Caché Edge ISR revalidado.`
              )
            }
            className="inline-flex items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold tracking-wider text-stone-950 uppercase shadow-md transition hover:bg-amber-400"
          >
            <CheckCircle2 className="h-4 w-4" />
            Guardar y Publicar
          </button>
        </div>
      </header>

      {/* VISTA 1: CONSTRUCTOR VISUAL SPLIT-SCREEN EN TIEMPO REAL */}
      {activeTab === 'builder' && (
        <div className="flex flex-1 overflow-hidden">
          {/* Panel Inspector Izquierdo */}
          <aside className="flex w-full max-w-md flex-col border-r border-white/10 bg-stone-900/60">
            {/* Sub-tabs del Inspector */}
            <div className="grid grid-cols-4 border-b border-white/10 bg-stone-950/60 p-1.5 text-xs font-semibold">
              {[
                { id: 'templates', label: '10 Templates', icon: Sparkles },
                { id: 'colors', label: 'Colores/Sobre', icon: Palette },
                { id: 'content', label: 'Textos/Fotos', icon: Layout },
                { id: 'sections', label: 'Secciones', icon: Eye },
              ].map((t) => {
                const Icon = t.icon;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() =>
                      setInspectorTab(
                        t.id as 'templates' | 'colors' | 'content' | 'sections'
                      )
                    }
                    className={`flex flex-col items-center gap-1 rounded-lg py-2 transition ${
                      inspectorTab === t.id
                        ? 'bg-white/10 text-amber-400'
                        : 'text-stone-400 hover:text-white'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Contenido del Inspector */}
            <div className="flex-1 space-y-5 overflow-y-auto p-5">
              {inspectorTab === 'templates' && (
                <div className="space-y-3">
                  <p className="text-xs text-stone-400">
                    Cambia de plantilla en 1 clic conservando tus datos:
                  </p>
                  {TEMPLATES_CATALOG.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setTemplate(tpl.id as TemplateId)}
                      className={`flex w-full items-center gap-3.5 rounded-2xl border p-3 text-left transition ${
                        templateId === tpl.id
                          ? 'border-amber-500 bg-amber-500/10'
                          : 'border-white/10 bg-stone-950/60 hover:border-white/25'
                      }`}
                    >
                      <img
                        src={tpl.previewImage}
                        alt={tpl.name}
                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm font-bold text-white">
                            {tpl.name}
                          </p>
                          <span className="text-[10px] text-amber-400">
                            {tpl.categoryLabel}
                          </span>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-xs text-stone-400">
                          {tpl.signatureAnimation}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {inspectorTab === 'colors' && (
                <div className="space-y-5">
                  <div>
                    <label className="mb-2 block text-xs font-bold tracking-wider text-stone-300 uppercase">
                      URL Personalizada (Slug del Cliente)
                    </label>
                    <div className="flex items-center rounded-xl border border-white/15 bg-stone-950 px-3 py-2 text-xs">
                      <span className="text-stone-500">dominio.com/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setMeta({ slug: e.target.value })}
                        className="ml-1 flex-1 bg-transparent font-semibold text-amber-400 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold tracking-wider text-stone-300 uppercase">
                      Paleta de Colores Personalizada
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { key: 'bgPrimary', label: 'Fondo Principal' },
                        { key: 'bgSecondary', label: 'Fondo Secundario' },
                        { key: 'textPrimary', label: 'Texto Principal' },
                        { key: 'accentPrimary', label: 'Acento / Botones' },
                      ].map((c) => (
                        <div
                          key={c.key}
                          className="flex items-center justify-between rounded-xl border border-white/10 bg-stone-950 p-2.5 text-xs"
                        >
                          <span>{c.label}</span>
                          <input
                            type="color"
                            value={
                              config.theme.colors[
                                c.key as keyof typeof config.theme.colors
                              ]
                            }
                            onChange={(e) =>
                              updateThemeColors({ [c.key]: e.target.value })
                            }
                            className="h-7 w-7 cursor-pointer rounded border-0 bg-transparent"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold tracking-wider text-stone-300 uppercase">
                      Sello del Sobre Interactivo
                    </label>
                    <input
                      type="text"
                      value={config.theme.envelope.sealMonogram}
                      onChange={(e) =>
                        updateEnvelope({ sealMonogram: e.target.value })
                      }
                      placeholder="Ej. S & M o XV"
                      className="w-full rounded-xl border border-white/15 bg-stone-950 px-3.5 py-2.5 text-sm text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {inspectorTab === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-stone-300">
                      Etiqueta Superior (Badge)
                    </label>
                    <input
                      type="text"
                      value={config.content.hero.badgeText}
                      onChange={(e) =>
                        updateHero({ badgeText: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/15 bg-stone-950 px-3.5 py-2 text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-stone-300">
                      Título Principal / Festejados
                    </label>
                    <input
                      type="text"
                      value={config.content.hero.mainTitle}
                      onChange={(e) => {
                        updateHero({ mainTitle: e.target.value });
                        setMeta({ title: e.target.value });
                      }}
                      className="w-full rounded-xl border border-white/15 bg-stone-950 px-3.5 py-2 text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-stone-300">
                      Fecha y Ciudad (Subtítulo)
                    </label>
                    <input
                      type="text"
                      value={config.content.hero.tagline}
                      onChange={(e) => updateHero({ tagline: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-stone-950 px-3.5 py-2 text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-stone-300">
                      URL Fotografía de Portada
                    </label>
                    <input
                      type="url"
                      value={config.content.hero.coverImageUrl}
                      onChange={(e) =>
                        updateHero({ coverImageUrl: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/15 bg-stone-950 px-3.5 py-2 text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-stone-300">
                      Código de Vestimenta
                    </label>
                    <input
                      type="text"
                      value={config.content.dressCode.title}
                      onChange={(e) =>
                        updateDressCode({ title: e.target.value })
                      }
                      className="w-full rounded-xl border border-white/15 bg-stone-950 px-3.5 py-2 text-sm text-white outline-none"
                    />
                  </div>
                </div>
              )}

              {inspectorTab === 'sections' && (
                <div className="space-y-2.5">
                  <p className="text-xs text-stone-400">
                    Activa o desactiva cualquiera de los 12 bloques modulares:
                  </p>
                  {config.sectionsOrder.map((sec) => (
                    <div
                      key={sec.id}
                      className="flex items-center justify-between rounded-xl border border-white/10 bg-stone-950 px-3.5 py-2.5 text-xs"
                    >
                      <span className="font-medium text-stone-200">
                        {SECTION_LABELS[sec.id]}
                      </span>
                      <input
                        type="checkbox"
                        checked={sec.enabled}
                        onChange={() => toggleSection(sec.id)}
                        className="h-4 w-4 accent-amber-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Lienzo Central de Previsualización Interactiva */}
          <main className="flex flex-1 flex-col bg-stone-950">
            {/* Barra de Controles del Lienzo (Viewport Responsive + Sobre) */}
            <div className="flex items-center justify-between border-b border-white/10 bg-stone-900/40 px-6 py-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => useBuilderStore.temporal.getState().undo()}
                  className="rounded-lg border border-white/10 p-1.5 text-stone-400 hover:text-white"
                  title="Deshacer (Undo)"
                >
                  <Undo2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => useBuilderStore.temporal.getState().redo()}
                  className="rounded-lg border border-white/10 p-1.5 text-stone-400 hover:text-white"
                  title="Rehacer (Redo)"
                >
                  <Redo2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewEnvelopeOpen(!previewEnvelopeOpen)}
                  className="ml-2 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300"
                >
                  {previewEnvelopeOpen
                    ? 'Probar Sobre Cerrado'
                    : 'Abrir Sobre en Preview'}
                </button>
              </div>

              <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-stone-900 p-1">
                {[
                  { id: 'mobile', label: 'Móvil 390px', icon: Smartphone },
                  { id: 'tablet', label: 'Tablet 768px', icon: Tablet },
                  { id: 'desktop', label: 'Desktop 100%', icon: Monitor },
                ].map((vp) => {
                  const Icon = vp.icon;
                  return (
                    <button
                      key={vp.id}
                      type="button"
                      onClick={() =>
                        setViewport(vp.id as 'mobile' | 'tablet' | 'desktop')
                      }
                      className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition ${
                        viewport === vp.id
                          ? 'bg-amber-500 text-stone-950'
                          : 'text-stone-400 hover:text-white'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{vp.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Marco del Dispositivo */}
            <div className="flex flex-1 items-start justify-center overflow-y-auto p-4 sm:p-8">
              <div
                className={`relative overflow-y-auto rounded-3xl border border-white/15 shadow-2xl transition-all duration-300 ${
                  viewport === 'mobile'
                    ? 'h-[780px] w-[390px]'
                    : viewport === 'tablet'
                      ? 'h-[820px] w-[768px]'
                      : 'h-[820px] w-full'
                }`}
              >
                <InvitationRenderer
                  slug={slug}
                  templateId={templateId}
                  eventDate={eventDate}
                  config={config}
                  forceEnvelopeOpen={previewEnvelopeOpen}
                />
              </div>
            </div>
          </main>
        </div>
      )}

      {/* VISTA 2: CRM DE INVITADOS Y GENERADOR DE LINKS ÚNICOS POR WHATSAPP */}
      {activeTab === 'guests' && (
        <div className="mx-auto w-full max-w-6xl space-y-8 p-6 sm:p-10">
          {/* KPIs */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-stone-900 p-5">
              <span className="text-xs text-stone-400 uppercase">
                Familias / Grupos en Lista
              </span>
              <p className="mt-1 text-3xl font-bold text-white">
                {guests.length} Grupos
              </p>
              <span className="text-xs text-amber-400">
                {totalAllocated} pases asignados en total
              </span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-stone-900 p-5">
              <span className="text-xs text-stone-400 uppercase">
                Invitados Confirmados (RSVP)
              </span>
              <p className="mt-1 text-3xl font-bold text-emerald-400">
                {totalConfirmed} Personas
              </p>
              <span className="text-xs text-stone-400">
                Con Pase QR firmado generado
              </span>
            </div>
            <div className="rounded-2xl border border-white/10 bg-stone-900 p-5">
              <span className="text-xs text-stone-400 uppercase">
                Protección de Cupo Activa
              </span>
              <p className="mt-1 text-lg font-bold text-white">
                Smart Guest Links (?g=token)
              </p>
              <span className="text-xs text-stone-400">
                Impide que confirmen más boletos de los asignados
              </span>
            </div>
          </div>

          {/* Formulario para Crear Pase Personalizado */}
          <form
            onSubmit={handleAddGuestGroup}
            className="grid gap-4 rounded-2xl border border-white/10 bg-stone-900/70 p-6 sm:grid-cols-6"
          >
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-stone-400">
                Nombre de Familia o Invitado
              </label>
              <input
                type="text"
                required
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
                placeholder="Ej. Familia Hernández Soto"
                className="w-full rounded-xl border border-white/15 bg-stone-950 px-3.5 py-2.5 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-stone-400">
                WhatsApp
              </label>
              <input
                type="tel"
                value={newGuestPhone}
                onChange={(e) => setNewGuestPhone(e.target.value)}
                placeholder="525512345678"
                className="w-full rounded-xl border border-white/15 bg-stone-950 px-3.5 py-2.5 text-sm text-white outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-stone-400">
                Pases Adulto / Niño
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={newGuestAdults}
                  onChange={(e) => setNewGuestAdults(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/15 bg-stone-950 px-3 py-2.5 text-sm text-white outline-none"
                />
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={newGuestChildren}
                  onChange={(e) => setNewGuestChildren(Number(e.target.value))}
                  className="w-full rounded-xl border border-white/15 bg-stone-950 px-3 py-2.5 text-sm text-white outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-stone-400">
                Mesa Asignada
              </label>
              <input
                type="text"
                value={newGuestTable}
                onChange={(e) => setNewGuestTable(e.target.value)}
                className="w-full rounded-xl border border-white/15 bg-stone-950 px-3.5 py-2.5 text-sm text-white outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full rounded-xl bg-amber-500 py-2.5 text-xs font-bold tracking-wider text-stone-950 uppercase transition hover:bg-amber-400"
              >
                + Crear Pase Único
              </button>
            </div>
          </form>

          {/* Tabla de Invitados con Despachador de WhatsApp */}
          <div className="overflow-x-auto rounded-2xl border border-white/10 bg-stone-900">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-white/10 bg-stone-950/60 text-xs text-stone-400 uppercase">
                <tr>
                  <th className="px-5 py-3.5">Familia / Invitado</th>
                  <th className="px-5 py-3.5">Cupo Asignado</th>
                  <th className="px-5 py-3.5">Estado RSVP</th>
                  <th className="px-5 py-3.5">Mesa</th>
                  <th className="px-5 py-3.5">URL Personalizada</th>
                  <th className="px-5 py-3.5 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/10">
                {guests.map((g) => {
                  const invitePath = `/${slug}?template=${templateId}&g=${g.guestToken}`;
                  const fullInviteUrl = `https://www.dominioprincipal.com${invitePath}`;
                  const waUrl = buildWhatsappInviteUrl({
                    phone: g.whatsappPhone || '525512345678',
                    groupName: g.groupName,
                    eventTitle: title,
                    allocatedAdults: g.allocatedAdults,
                    allocatedChildren: g.allocatedChildren,
                    invitationUrl: fullInviteUrl,
                  });

                  return (
                    <tr key={g.id} className="hover:bg-white/[0.02]">
                      <td className="px-5 py-4 font-semibold text-white">
                        {g.groupName}
                        <span className="block text-xs font-normal text-stone-400">
                          Token: {g.guestToken}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs">
                        {g.allocatedAdults} Adultos
                        {g.allocatedChildren > 0
                          ? ` • ${g.allocatedChildren} Niños`
                          : ''}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            g.rsvpStatus === 'confirmed'
                              ? 'bg-emerald-500/15 text-emerald-400'
                              : g.rsvpStatus === 'viewed'
                                ? 'bg-amber-500/15 text-amber-300'
                                : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {g.rsvpStatus === 'confirmed'
                            ? `Confirmado (${g.confirmedAdults + g.confirmedChildren})`
                            : g.rsvpStatus === 'viewed'
                              ? 'Sobre Abierto'
                              : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-stone-300">
                        {g.tableName}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={invitePath}
                          target="_blank"
                          className="inline-flex items-center gap-1 text-xs font-medium text-amber-400 hover:underline"
                        >
                          <span>Abrir sobre personalizado</span>
                          <ExternalLink className="h-3 w-3" />
                        </Link>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <div className="inline-flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                window.location.origin + invitePath
                              );
                              toast.success('Link único copiado');
                            }}
                            className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-2.5 py-1.5 text-xs text-stone-200 hover:bg-white/10"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Copiar Link
                          </button>
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
                          >
                            <Send className="h-3.5 w-3.5" />
                            WhatsApp
                          </a>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VISTA 3: RECEPCIÓN Y ESCÁNER DE PASES QR (HOSTESS MODE) */}
      {activeTab === 'checkin' && (
        <div className="mx-auto w-full max-w-4xl space-y-6 p-6 sm:p-10">
          <div className="rounded-3xl border border-white/10 bg-stone-900 p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400">
              <QrCode className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Modo Recepción — Verificador Criptográfico de Pases QR
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-stone-400">
              El día del evento, el personal en puerta escanea el código QR del
              invitado para validar su firma HMAC-SHA256, confirmar el número de
              personas autorizadas y mostrar su mesa asignada al instante.
            </p>

            <div className="mt-8 grid gap-4 text-left sm:grid-cols-3">
              {guests.map((g) => (
                <div
                  key={g.id}
                  className="flex flex-col justify-between rounded-2xl border border-white/10 bg-stone-950 p-5"
                >
                  <div>
                    <span className="text-[11px] font-bold tracking-wider text-amber-400 uppercase">
                      {g.tableName}
                    </span>
                    <h3 className="mt-1 font-bold text-white">
                      {g.groupName}
                    </h3>
                    <p className="mt-1 text-xs text-stone-400">
                      Ingresaron: {g.checkedInCount} de{' '}
                      {g.allocatedAdults + g.allocatedChildren} pases
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setGuests((prev) =>
                        prev.map((item) =>
                          item.id === g.id
                            ? {
                                ...item,
                                checkedInCount:
                                  item.allocatedAdults + item.allocatedChildren,
                              }
                            : item
                        )
                      );
                      toast.success(
                        `Check-in validado: ${g.groupName} -> Pasar a ${g.tableName}`
                      );
                    }}
                    className="mt-4 w-full rounded-xl bg-white/10 py-2 text-xs font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
                  >
                    Simular Escaneo QR en Puerta
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
