'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Eye,
  Filter,
  FolderKanban,
  Layout,
  LogOut,
  Monitor,
  Palette,
  Plus,
  QrCode,
  Redo2,
  Search,
  Send,
  Smartphone,
  Sparkles,
  Tablet,
  Trash2,
  Undo2,
  UserCheck,
  Users,
  Wand2,
  X,
} from 'lucide-react';
import { useBuilderStore } from '@/stores/useBuilderStore';
import {
  useEventsStore,
  type ClientInvitationRecord,
} from '@/stores/useEventsStore';
import { TEMPLATES_CATALOG } from '@/lib/templates/templates-catalog';
import { InvitationRenderer } from '@/components/invitation/core/InvitationRenderer';
import { buildWhatsappInviteUrl } from '@/lib/whatsapp/link-builder';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import type { SectionId, TemplateId } from '@/types/invitation.types';
import { EventReception } from '@/components/dashboard/EventReception';
import { EventMemories } from '@/components/dashboard/EventMemories';
import { HeyDayBrand } from '@/components/brand/HeyDayBrand';
import './dashboard.css';

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

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialTemplateParam = searchParams.get(
    'template'
  ) as TemplateId | null;

  const {
    invitations, loading, error, load,
    addInvitation,
    updateInvitation,
    deleteInvitation,
  } = useEventsStore();

  const {
    eventId,
    clientName,
    slug,
    title,
    eventDate,
    templateId,
    viewport,
    config,
    previewEnvelopeOpen,
    loadInvitationRecord,
    setTemplate,
    setViewport,
    setPreviewEnvelopeOpen,
    setMeta,
    updateThemeColors,
    updateEnvelope,
    toggleSection,
    updateHero,
    updateGallery,
    updateSocialFeatures,
    updateDressCode,
  } = useBuilderStore();

  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [shareAccess, setShareAccess] = useState<{ slug: string; pin: string } | null>(null);
  const [adminEmail, setAdminEmail] = useState<string>(
    'Administrador'
  );
  const [activeTab, setActiveTab] = useState<
    'history' | 'builder' | 'guests' | 'checkin'
  >('history');
  const [inspectorTab, setInspectorTab] = useState<
    'templates' | 'colors' | 'content' | 'sections'
  >('templates');

  // Estado de Filtros y Paginación para el Historial por Template y Cliente
  const [selectedHistoryTemplate, setSelectedHistoryTemplate] = useState<
    'all' | TemplateId
  >(initialTemplateParam || 'all');
  const [clientQuery, setClientQuery] = useState('');
  const [dateFilterField, setDateFilterField] = useState<
    'eventDate' | 'createdAt'
  >('eventDate');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'published' | 'draft' | 'archived'
  >('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);

  // Modal de Crear Nueva Invitación para un Cliente
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [newForm, setNewForm] = useState<{
    clientName: string;
    clientEmail: string;
    clientPhone: string;
    title: string;
    slug: string;
    templateId: TemplateId;
    eventDate: string;
  }>({
    clientName: '',
    clientEmail: '',
    clientPhone: '+52 55 ',
    title: '',
    slug: '',
    templateId: initialTemplateParam || 'eternal-elegance',
    eventDate: '2026-12-19',
  });

  // Formulario para Agregar Pase de Invitado al Cliente Activo
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestAdults, setNewGuestAdults] = useState(2);
  const [newGuestChildren, setNewGuestChildren] = useState(0);
  const [newGuestTable, setNewGuestTable] = useState('Mesa 5');

  useEffect(() => { void load(); }, [load]);

  // Verificar sesión del administrador
  useEffect(() => {
    let active = true;
    createClient().auth.getUser().then(({ data, error }) => {
      if (!active) return;
      if (error || !data.user) {
        router.replace('/login');
      } else {
        setAdminEmail(data.user.email ?? 'Administrador');
      }
    });
    return () => { active = false; };
  }, [router]);

  // Si viene ?template=... en la URL, filtrar por ese template
  useEffect(() => {
    if (
      initialTemplateParam &&
      TEMPLATES_CATALOG.some((t) => t.id === initialTemplateParam)
    ) {
      setSelectedHistoryTemplate(initialTemplateParam);
      setNewForm((prev) => ({ ...prev, templateId: initialTemplateParam }));
    }
  }, [initialTemplateParam]);

  // Invitación activa seleccionada para CRM / Check-in
  const activeInvitationRecord = useMemo(
    () =>
      invitations.find((inv) => inv.id === eventId) || invitations[0],
    [invitations, eventId]
  );

  // Contadores de invitaciones creadas por cada uno de los 10 templates
  const templateCounts = useMemo(() => {
    const counts: Record<string, number> = { all: invitations.length };
    for (const tpl of TEMPLATES_CATALOG) {
      counts[tpl.id] = invitations.filter(
        (inv) => inv.templateId === tpl.id
      ).length;
    }
    return counts;
  }, [invitations]);

  // Filtrado por Template, Cliente (nombre, email, título, slug) y Rango de Fechas
  const filteredInvitations = useMemo(() => {
    return invitations.filter((inv) => {
      if (
        selectedHistoryTemplate !== 'all' &&
        inv.templateId !== selectedHistoryTemplate
      ) {
        return false;
      }

      if (statusFilter !== 'all' && inv.status !== statusFilter) {
        return false;
      }

      if (clientQuery.trim()) {
        const q = clientQuery.toLowerCase().trim();
        const matchesClient = inv.clientName.toLowerCase().includes(q);
        const matchesTitle = inv.title.toLowerCase().includes(q);
        const matchesSlug = inv.slug.toLowerCase().includes(q);
        const matchesEmail = inv.clientEmail.toLowerCase().includes(q);
        if (!matchesClient && !matchesTitle && !matchesSlug && !matchesEmail) {
          return false;
        }
      }

      const targetDateIso =
        dateFilterField === 'eventDate' ? inv.eventDate : inv.createdAt;
      const targetDay = targetDateIso.slice(0, 10);

      if (dateFrom && targetDay < dateFrom) {
        return false;
      }
      if (dateTo && targetDay > dateTo) {
        return false;
      }

      return true;
    });
  }, [
    invitations,
    selectedHistoryTemplate,
    statusFilter,
    clientQuery,
    dateFilterField,
    dateFrom,
    dateTo,
  ]);

  // Resetear a la página 1 cuando cambian los filtros
  useEffect(() => {
    setCurrentPage(1);
  }, [
    selectedHistoryTemplate,
    statusFilter,
    clientQuery,
    dateFilterField,
    dateFrom,
    dateTo,
    pageSize,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInvitations.length / pageSize)
  );
  const safePage = Math.min(currentPage, totalPages);
  const paginatedInvitations = useMemo(() => {
    const start = (safePage - 1) * pageSize;
    return filteredInvitations.slice(start, start + pageSize);
  }, [filteredInvitations, safePage, pageSize]);

  // Historial específico del template que está activo dentro del Builder
  const builderTemplateHistory = useMemo(
    () => invitations.filter((inv) => inv.templateId === templateId),
    [invitations, templateId]
  );

  const handleOpenInBuilder = (record: ClientInvitationRecord) => {
    router.push(`/editar/${encodeURIComponent(record.slug)}`);
  };

  const handleGenerateAccess = async (record: ClientInvitationRecord) => {
    try {
      const response = await fetch(`/api/admin/invitations/${encodeURIComponent(record.id)}/pin`, { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo generar el acceso');
      setShareAccess({ slug: result.slug, pin: result.pin });
    } catch (error) { toast.error(error instanceof Error ? error.message : 'No se pudo generar el acceso'); }
  };

  const handleSaveCurrentBuilder = async () => {
    try { await updateInvitation(eventId, {
      slug,
      clientName,
      title,
      templateId,
      eventDate,
      config: structuredClone(config),
    });
    toast.success(`Cambios guardados para ${clientName}`);
    } catch (err) { toast.error(err instanceof Error ? err.message : 'No se pudieron guardar los cambios'); }
  };

  const handleCreateNewInvitation = async (
    e: React.FormEvent,
    openBuilderAfter = true
  ) => {
    e.preventDefault();
    if (!newForm.clientName.trim() || !newForm.title.trim()) {
      toast.error('Completa el nombre del cliente y el título del evento');
      return;
    }

    const cleanSlug =
      slugify(newForm.slug || newForm.title) || `evento-${Date.now()}`;

    const duplicate = invitations.some(
      (i) => i.slug.toLowerCase() === cleanSlug.toLowerCase()
    );
    const finalSlug = duplicate
      ? `${cleanSlug}-${Math.floor(100 + Math.random() * 900)}`
      : cleanSlug;

    try {
    const { invitation: created, pin } = await addInvitation({
      clientName: newForm.clientName.trim(),
      clientEmail: newForm.clientEmail.trim(),
      clientPhone: newForm.clientPhone.trim(),
      title: newForm.title.trim(),
      slug: finalSlug,
      templateId: newForm.templateId,
      eventDate: `${newForm.eventDate}T17:00:00-06:00`,
    });

    setSelectedHistoryTemplate(newForm.templateId);
    setIsNewModalOpen(false);
    setShareAccess({ slug: created.slug, pin });
    setNewForm({
      clientName: '',
      clientEmail: '',
      clientPhone: '+52 55 ',
      title: '',
      slug: '',
      templateId: newForm.templateId,
      eventDate: '2026-12-19',
    });

    toast.success(
      `Invitación creada para ${created.clientName} con el template ${created.templateId}`
    );

    if (openBuilderAfter) loadInvitationRecord(created);
    } catch (err) { toast.error(err instanceof Error ? err.message : 'No se pudo crear la invitación'); }
  };

  const handleAddGuestGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim() || !activeInvitationRecord) return;
    const token =
      'fam-' +
      slugify(newGuestName).slice(0, 14) +
      '-' +
      Math.random().toString(36).slice(2, 6);

    const updatedGuests = [
      {
        id: String(Date.now()),
        eventId: activeInvitationRecord.id,
        guestToken: token,
        groupName: newGuestName.trim(),
        whatsappPhone: newGuestPhone.trim() || '525500000000',
        groupTag: 'Invitado',
        allocatedAdults: newGuestAdults,
        allocatedChildren: newGuestChildren,
        rsvpStatus: 'pending' as const,
        confirmedAdults: 0,
        confirmedChildren: 0,
        tableName: newGuestTable,
        checkedInCount: 0,
      },
      ...activeInvitationRecord.guests,
    ];

    try { await updateInvitation(activeInvitationRecord.id, { guests: updatedGuests });
    setNewGuestName('');
    setNewGuestPhone('');
    toast.success(`Pase único creado para ${newGuestName}`);
    } catch (err) { toast.error(err instanceof Error ? err.message : 'No se pudo crear el pase'); }
  };

  const handleLogout = async () => {
    const { error } = await createClient().auth.signOut();
    if (error) {
      toast.error('No pudimos cerrar la sesión. Inténtalo de nuevo.');
      return;
    }
    toast.success('Sesión cerrada correctamente');
    router.replace('/login');
    router.refresh();
  };

  const activeGuests = activeInvitationRecord?.guests || [];
  const totalAllocated = activeGuests.reduce(
    (acc, g) => acc + g.allocatedAdults + g.allocatedChildren,
    0
  );
  const totalConfirmed = activeGuests.reduce(
    (acc, g) => acc + g.confirmedAdults + g.confirmedChildren,
    0
  );

  return (
    <div className="dashboard-shell flex min-h-dvh flex-col overflow-x-hidden bg-[#faf9f5] text-[#141413]">
      {loading && <div role="status" className="px-5 py-2 text-sm">Cargando invitaciones…</div>}
      {error && <div role="alert" className="px-5 py-2 text-sm text-red-700">No se pudieron cargar las invitaciones: {error} <button onClick={() => void load()} className="underline">Reintentar</button></div>}
      {/* TOPBAR DEL DASHBOARD */}
      <header className="dashboard-topbar sticky top-0 z-40 flex flex-wrap items-center justify-between gap-3 border-b border-[#e6dfd8] bg-[#faf9f5]/95 px-4 py-3 backdrop-blur-md sm:px-6">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          <Link href="/" className="flex cursor-pointer items-center gap-2" aria-label="HeyDay, volver al inicio">
            <HeyDayBrand />
            <span className="hidden text-[10px] font-semibold uppercase tracking-[.12em] text-[#6c6a64] sm:inline">Admin</span>
          </Link>

          <div className="hidden h-5 w-px bg-[#e6dfd8] sm:block" />

          {/* Navegación de Módulos */}
          <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto rounded-lg border border-[#e6dfd8] bg-white p-1 sm:flex-none">
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === 'history'
                  ? 'bg-[#cc785c] text-white'
                  : 'text-[#6c6a64] hover:text-[#141413]'
              }`}
            >
              <FolderKanban className="h-3.5 w-3.5" />
              <span className="whitespace-nowrap">Historial ({invitations.length})</span>
            </button>
            <button
              type="button"
              onClick={() => activeInvitationRecord ? handleOpenInBuilder(activeInvitationRecord) : setIsNewModalOpen(true)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === 'builder'
                  ? 'bg-[#cc785c] text-white'
                  : 'text-[#6c6a64] hover:text-[#141413]'
              }`}
            >
              <Wand2 className="h-3.5 w-3.5" />
              <span className="whitespace-nowrap">Editor</span>
            </button>
            <button
              type="button"
              onClick={() => activeInvitationRecord ? router.push(`/editar/${encodeURIComponent(activeInvitationRecord.slug)}?tab=guests`) : setIsNewModalOpen(true)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === 'guests'
                  ? 'bg-[#cc785c] text-white'
                  : 'text-[#6c6a64] hover:text-[#141413]'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              <span className="whitespace-nowrap">Invitados ({activeGuests.length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('checkin')}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === 'checkin'
                  ? 'bg-[#cc785c] text-white'
                  : 'text-[#6c6a64] hover:text-[#141413]'
              }`}
            >
              <QrCode className="h-3.5 w-3.5" />
              <span className="whitespace-nowrap">Recepción QR</span>
            </button>
          </div>
        </div>

        {/* Acciones Derecha: Crear Nueva Invitación + Guardar + Logout */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setNewForm((prev) => ({
                ...prev,
                templateId:
                  selectedHistoryTemplate !== 'all'
                    ? selectedHistoryTemplate
                    : templateId,
              }));
              setIsNewModalOpen(true);
            }}
            className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-[#cc785c]/40 bg-[#cc785c]/10 px-3.5 text-xs font-semibold text-[#a9583e] transition hover:bg-[#cc785c] hover:text-white"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden whitespace-nowrap sm:inline">Nueva invitación</span>
          </button>

          {activeTab === 'builder' && (
            <button
              type="button"
              onClick={handleSaveCurrentBuilder}
              className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg bg-[#cc785c] px-4 text-xs font-semibold text-white transition hover:bg-[#a9583e]"
            >
              <CheckCircle2 className="h-4 w-4" />
              <span className="hidden sm:inline">Guardar cambios</span>
            </button>
          )}

          <div className="hidden items-center gap-2 rounded-xl border border-[#e6dfd8] bg-[#faf9f5] px-3 py-1.5 text-xs xl:flex">
            <UserCheck className="h-3.5 w-3.5 text-[#5db872]" />
            <span className="text-[#6c6a64]">{adminEmail}</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Cerrar sesión"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-[#e6dfd8] bg-white px-3 py-2 text-xs font-semibold text-[#3d3d3a] transition hover:bg-[#c64545]/10 hover:text-[#c64545]"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </header>

      {/* =====================================================================
          VISTA 1: HISTORIAL DE INVITACIONES POR TEMPLATE Y CLIENTES
      ===================================================================== */}
      {activeTab === 'history' && (
        <div className="dashboard-history w-full flex-1">
          <section className="dashboard-history__hero" aria-label="Resumen del espacio de trabajo">
            <div className="dashboard-history__hero-inner">
              <div>
                <p className="dashboard-history__eyebrow"><span /> HeyDay / Espacio de trabajo</p>
                <h1>Momentos extraordinarios, <em>perfectamente organizados.</em></h1>
                <p>Diseña cada historia, acompaña a tus clientes y sigue cada confirmación desde un solo lugar.</p>
              </div>
              <div className="dashboard-history__stats" aria-label="Estado de las invitaciones">
                <div><strong>{invitations.length}</strong><span>invitaciones</span></div>
                <div><strong>{invitations.filter((inv) => inv.status === 'published').length}</strong><span>publicadas</span></div>
                <div><strong>{TEMPLATES_CATALOG.length}</strong><span>templates</span></div>
              </div>
            </div>
          </section>
          <div className="dashboard-history__content mx-auto grid w-full max-w-[1200px] gap-6 p-4 sm:p-6 lg:grid-cols-12">
          {/* Columna Izquierda: Selector de los 10 Templates con Historial */}
          <aside className="dashboard-history__sidebar space-y-3 lg:col-span-3">
            <div className="rounded-xl border border-[#e6dfd8] bg-[#f5f0e8] p-4">
              <h2 className="text-xs font-bold tracking-wider text-[#cc785c] uppercase">
                Historial por Template
              </h2>
              <p className="mt-1 text-xs text-[#6c6a64]">
                Selecciona una plantilla para ver todas las invitaciones de
                clientes creadas con ella:
              </p>

              <div className="mt-4 space-y-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedHistoryTemplate('all')}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold transition ${
                    selectedHistoryTemplate === 'all'
                      ? 'bg-[#cc785c] text-white font-bold'
                      : 'text-[#3d3d3a] hover:bg-white'
                  }`}
                >
                  <span>Todos los Templates</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      selectedHistoryTemplate === 'all'
                        ? 'bg-black/5 text-[#141413]'
                        : 'bg-[#ebe6df] text-[#3d3d3a]'
                    }`}
                  >
                    {templateCounts.all}
                  </span>
                </button>

                {TEMPLATES_CATALOG.map((tpl, idx) => {
                  const isSelected = selectedHistoryTemplate === tpl.id;
                  const count = templateCounts[tpl.id] || 0;
                  return (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setSelectedHistoryTemplate(tpl.id)}
                      className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-left text-xs transition ${
                        isSelected
                          ? 'bg-[#cc785c] font-bold text-white shadow-sm'
                          : 'text-[#3d3d3a] hover:bg-white'
                      }`}
                    >
                      <span className="truncate">
                        {idx + 1}. {tpl.name}
                      </span>
                      <span
                        className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isSelected
                            ? 'bg-black/5 text-[#141413]'
                            : 'bg-[#ebe6df] text-[#a9583e]'
                        }`}
                      >
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Columna Derecha: Filtros por Cliente/Fecha + Tabla Paginada */}
          <div className="dashboard-history__main flex min-w-0 flex-col space-y-5 lg:col-span-9">
            {/* Cabecera del Template Activo */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#e6dfd8] bg-[#f5f0e8] p-5">
              <div>
                <span className="text-xs font-bold tracking-wider text-[#cc785c] uppercase">
                  {selectedHistoryTemplate === 'all'
                    ? 'Historial Global Multi-Cliente'
                    : `Historial del Template: ${
                        TEMPLATES_CATALOG.find(
                          (t) => t.id === selectedHistoryTemplate
                        )?.name
                      }`}
                </span>
                <h1 className="mt-0.5 text-2xl font-medium text-[#141413]">
                  {selectedHistoryTemplate === 'all'
                    ? 'Todas las Invitaciones de Clientes'
                    : `Invitaciones creadas con ${
                        TEMPLATES_CATALOG.find(
                          (t) => t.id === selectedHistoryTemplate
                        )?.name
                      }`}
                </h1>
              </div>

              <button
                type="button"
                onClick={() => {
                  setNewForm((prev) => ({
                    ...prev,
                    templateId:
                      selectedHistoryTemplate !== 'all'
                        ? selectedHistoryTemplate
                        : 'eternal-elegance',
                  }));
                  setIsNewModalOpen(true);
                }}
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#cc785c] px-4 py-2.5 text-xs font-bold tracking-wider text-white uppercase   transition hover:bg-[#a9583e]"
              >
                <Plus className="h-4 w-4" />
                {selectedHistoryTemplate === 'all'
                  ? 'Crear Invitación de Cliente'
                  : `Nueva con ${
                      TEMPLATES_CATALOG.find(
                        (t) => t.id === selectedHistoryTemplate
                      )?.name
                    }`}
              </button>
            </div>

            {/* Barra de Filtros: Cliente, Rango de Fechas y Estado */}
            <div className="grid gap-3 rounded-xl border border-[#e6dfd8] bg-[#f5f0e8] p-4 sm:grid-cols-12">
              {/* Búsqueda por Cliente / Evento / URL */}
              <div className="sm:col-span-4">
                <label className="mb-1 block text-[11px] font-semibold text-[#6c6a64] uppercase">
                  Filtrar por Cliente, Evento o Slug
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-[#8e8b82]" />
                  <input
                    type="text"
                    value={clientQuery}
                    onChange={(e) => setClientQuery(e.target.value)}
                    placeholder="Ej. Sofía, Camila, XV, boda-sofia..."
                    className="w-full rounded-xl border border-[#d7cfc4] bg-[#faf9f5] py-2 pr-3 pl-9 text-xs text-[#141413] outline-none focus:border-[#cc785c]"
                  />
                </div>
              </div>

              {/* Tipo de Fecha */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[11px] font-semibold text-[#6c6a64] uppercase">
                  Campo de Fecha
                </label>
                <select
                  value={dateFilterField}
                  onChange={(e) =>
                    setDateFilterField(
                      e.target.value as 'eventDate' | 'createdAt'
                    )
                  }
                  className="w-full rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-3 py-2 text-xs text-[#141413] outline-none focus:border-[#cc785c]"
                >
                  <option value="eventDate">Fecha de Evento</option>
                  <option value="createdAt">Fecha Creada</option>
                </select>
              </div>

              {/* Fecha Desde */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[11px] font-semibold text-[#6c6a64] uppercase">
                  Desde
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-2.5 py-2 text-xs text-[#141413] outline-none focus:border-[#cc785c]"
                />
              </div>

              {/* Fecha Hasta */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[11px] font-semibold text-[#6c6a64] uppercase">
                  Hasta
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-2.5 py-2 text-xs text-[#141413] outline-none focus:border-[#cc785c]"
                />
              </div>

              {/* Estado + Botón Limpiar */}
              <div className="flex items-end gap-2 sm:col-span-2">
                <div className="flex-1">
                  <label className="mb-1 block text-[11px] font-semibold text-[#6c6a64] uppercase">
                    Estado
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) =>
                      setStatusFilter(
                        e.target.value as
                          | 'all'
                          | 'published'
                          | 'draft'
                          | 'archived'
                      )
                    }
                    className="w-full rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-2.5 py-2 text-xs text-[#141413] outline-none focus:border-[#cc785c]"
                  >
                    <option value="all">Todos</option>
                    <option value="published">Publicadas</option>
                    <option value="draft">Borradores</option>
                    <option value="archived">Archivadas</option>
                  </select>
                </div>

                {(clientQuery ||
                  dateFrom ||
                  dateTo ||
                  statusFilter !== 'all') && (
                  <button
                    type="button"
                    onClick={() => {
                      setClientQuery('');
                      setDateFrom('');
                      setDateTo('');
                      setStatusFilter('all');
                    }}
                    title="Limpiar filtros"
                    className="cursor-pointer rounded-xl border border-[#d7cfc4] bg-[#faf9f5] p-2 text-[#6c6a64] hover:text-[#141413]"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Tabla del Historial de Invitaciones */}
            <div className="overflow-x-auto rounded-xl border border-[#e6dfd8] bg-white">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-[#e6dfd8] bg-[#faf9f5] text-[11px] font-bold tracking-wider text-[#6c6a64] uppercase">
                  <tr>
                    <th className="px-5 py-3.5">Cliente & Evento</th>
                    <th className="px-5 py-3.5">Template Usado</th>
                    <th className="px-5 py-3.5">Fecha Evento / Creada</th>
                    <th className="px-5 py-3.5">URL Personalizada</th>
                    <th className="px-5 py-3.5">Estado</th>
                    <th className="px-5 py-3.5 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {paginatedInvitations.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-6 py-12 text-center text-sm text-[#6c6a64]"
                      >
                        No se encontraron invitaciones con los filtros
                        seleccionados.
                      </td>
                    </tr>
                  ) : (
                    paginatedInvitations.map((inv) => {
                      const tplInfo = TEMPLATES_CATALOG.find(
                        (t) => t.id === inv.templateId
                      );
                      const isCurrentInBuilder = inv.id === eventId;

                      return (
                        <tr
                          key={inv.id}
                          className={`transition hover:bg-[#f5f0e8] ${
                            isCurrentInBuilder ? 'bg-[#cc785c]/5' : ''
                          }`}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#141413]">
                                {inv.clientName}
                              </span>
                              {isCurrentInBuilder && (
                                <span className="rounded-full bg-[#cc785c]/10 px-2 py-0.5 text-[10px] font-bold text-[#a9583e]">
                                  En Editor
                                </span>
                              )}
                            </div>
                            <span className="block text-xs text-[#6c6a64]">
                              Evento: {inv.title} • {inv.clientPhone}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedHistoryTemplate(inv.templateId)
                              }
                              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-[#e6dfd8] bg-[#faf9f5] px-2.5 py-1 text-xs font-semibold text-[#a9583e] hover:border-[#cc785c]/40"
                            >
                              <span>{tplInfo?.name || inv.templateId}</span>
                            </button>
                          </td>

                          <td className="px-5 py-4 text-xs">
                            <p className="font-semibold text-[#141413]">
                              Evento: {inv.eventDate.slice(0, 10)}
                            </p>
                            <p className="text-[#8e8b82]">
                              Creada: {inv.createdAt.slice(0, 10)}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <Link
                              href={`/invitacion/${encodeURIComponent(inv.slug)}`}
                              target="_blank"
                              className="inline-flex cursor-pointer items-center gap-1 font-mono text-xs text-[#cc785c] hover:underline"
                              title={
                                inv.status === 'published'
                                  ? 'Abrir invitación pública'
                                  : 'Vista previa privada para administradores'
                              }
                            >
                              <span>/invitacion/{inv.slug}</span>
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                            {inv.status !== 'published' && (
                              <span className="block text-[11px] text-[#a9583e]">
                                Vista previa privada · publica para compartir
                              </span>
                            )}
                            <span className="block text-[11px] text-[#8e8b82]">
                              {inv.viewsCount} aperturas
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                inv.status === 'published'
                                  ? 'bg-[#5db872]/10 text-[#5db872]'
                                  : 'bg-[#cc785c]/10 text-[#a9583e]'
                              }`}
                            >
                              {inv.status === 'published'
                                ? 'Publicada'
                                : 'Borrador'}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button type="button" className="rounded-xl border border-[#d7cfc4] px-2 py-1.5 text-xs" onClick={async () => { try { await updateInvitation(inv.id, { status: inv.status === 'published' ? 'draft' : 'published' }); toast.success(inv.status === 'published' ? 'Invitación retirada' : 'Invitación publicada'); } catch (err) { toast.error(err instanceof Error ? err.message : 'No se pudo cambiar el estado'); } }}>{inv.status === 'published' ? 'Retirar' : 'Publicar'}</button>
                              <button
                                type="button"
                                onClick={() => handleOpenInBuilder(inv)}
                                className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-[#cc785c] px-3 py-1.5 text-xs font-bold text-white transition hover:bg-[#a9583e]"
                              >
                                <Wand2 className="h-3.5 w-3.5" />
                                Personalizar
                              </button>
                              <button
                                type="button"
                                onClick={() => router.push(`/editar/${encodeURIComponent(inv.slug)}?tab=guests`)}
                                className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-[#d7cfc4] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#141413] transition hover:bg-[#ebe6df]"
                              >
                                <Users className="h-3.5 w-3.5" />
                                Invitados
                              </button>
                              <button type="button" onClick={() => void handleGenerateAccess(inv)} className="rounded-xl border border-[#d7cfc4] bg-white px-2.5 py-1.5 text-xs font-semibold text-[#141413] hover:bg-[#ebe6df]" title="Genera un PIN nuevo y desactiva el anterior">Generar acceso</button>
                              <button
                                type="button"
                                onClick={async () => {
                                  if (!window.confirm(`¿Eliminar la invitación de ${inv.clientName}?`)) return;
                                  try { await deleteInvitation(inv.id); toast.success('Invitación eliminada'); } catch (err) { toast.error(err instanceof Error ? err.message : 'No se pudo eliminar'); }
                                }}
                                title="Eliminar invitación"
                                className="cursor-pointer rounded-xl border border-[#e6dfd8] p-1.5 text-[#6c6a64] transition hover:border-[#c64545]/40 hover:text-[#c64545]"
                              >
                                <Trash2 className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>

              {/* Controles de Paginación */}
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-[#e6dfd8] bg-[#faf9f5] px-5 py-3.5 text-xs">
                <div className="flex items-center gap-3 text-[#6c6a64]">
                  <span>
                    Mostrando{' '}
                    <strong className="text-[#141413]">
                      {filteredInvitations.length === 0
                        ? 0
                        : (safePage - 1) * pageSize + 1}
                    </strong>{' '}
                    –{' '}
                    <strong className="text-[#141413]">
                      {Math.min(
                        safePage * pageSize,
                        filteredInvitations.length
                      )}
                    </strong>{' '}
                    de{' '}
                    <strong className="text-[#141413]">
                      {filteredInvitations.length}
                    </strong>{' '}
                    invitaciones
                  </span>

                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="rounded-lg border border-[#d7cfc4] bg-white px-2 py-1 text-xs text-[#141413] outline-none"
                  >
                    <option value={5}>5 por página</option>
                    <option value={10}>10 por página</option>
                    <option value={20}>20 por página</option>
                  </select>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    disabled={safePage <= 1}
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#d7cfc4] bg-white px-3 py-1.5 font-semibold text-[#3d3d3a] transition hover:bg-[#ebe6df] disabled:opacity-40"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                    Anterior
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (pageNum) => (
                      <button
                        key={pageNum}
                        type="button"
                        onClick={() => setCurrentPage(pageNum)}
                        className={`h-8 w-8 cursor-pointer rounded-lg text-xs font-bold transition ${
                          pageNum === safePage
                            ? 'bg-[#cc785c] text-white'
                            : 'border border-[#e6dfd8] bg-white text-[#3d3d3a] hover:bg-[#ebe6df]'
                        }`}
                      >
                        {pageNum}
                      </button>
                    )
                  )}

                  <button
                    type="button"
                    disabled={safePage >= totalPages}
                    onClick={() =>
                      setCurrentPage((p) => Math.min(totalPages, p + 1))
                    }
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#d7cfc4] bg-white px-3 py-1.5 font-semibold text-[#3d3d3a] transition hover:bg-[#ebe6df] disabled:opacity-40"
                  >
                    Siguiente
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          VISTA 2: CONSTRUCTOR VISUAL SPLIT-SCREEN EN TIEMPO REAL
      ===================================================================== */}
      {activeTab === 'builder' && (
        <div className="dashboard-builder flex flex-1 flex-col overflow-hidden xl:flex-row">
          {/* Panel Inspector Izquierdo */}
          <aside className="dashboard-builder__inspector flex max-h-[62dvh] w-full flex-col border-b border-[#e6dfd8] bg-[#f5f0e8] xl:max-h-none xl:max-w-md xl:border-r xl:border-b-0">
            {/* Tarjeta de Cliente Activo en el Builder */}
            <div className="border-b border-[#e6dfd8] bg-[#faf9f5]/95 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider text-[#cc785c] uppercase">
                  Cliente Activo en Editor
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className="cursor-pointer text-[11px] font-semibold text-[#6c6a64] underline hover:text-[#141413]"
                >
                  Cambiar cliente ({invitations.length})
                </button>
              </div>
              <p className="mt-0.5 truncate text-sm font-bold text-[#141413]">
                {clientName} — <span className="text-[#a9583e]">/{slug}</span>
              </p>
            </div>

            {/* Sub-tabs del Inspector */}
            <div className="grid grid-cols-4 border-b border-[#e6dfd8] bg-[#faf9f5] p-1.5 text-xs font-semibold">
              {[
                { id: 'templates', label: '10 Templates', icon: Sparkles },
                { id: 'colors', label: 'Colores/URL', icon: Palette },
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
                    className={`flex cursor-pointer flex-col items-center gap-1 rounded-lg py-2 transition ${
                      inspectorTab === t.id
                        ? 'bg-[#ebe6df] text-[#cc785c]'
                        : 'text-[#6c6a64] hover:text-[#141413]'
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
                <div className="space-y-4">
                  {/* Historial rápido de invitaciones creadas con el template seleccionado */}
                  <div className="rounded-xl border border-[#cc785c]/30 bg-[#cc785c]/10 p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-[#a9583e] uppercase">
                        Historial en {templateId} ({builderTemplateHistory.length}
                        )
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedHistoryTemplate(templateId);
                          setActiveTab('history');
                        }}
                        className="cursor-pointer text-[11px] font-semibold text-[#141413] underline"
                      >
                        Ver todas / Filtrar
                      </button>
                    </div>
                    <div className="mt-2.5 max-h-32 space-y-1.5 overflow-y-auto">
                      {builderTemplateHistory.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleOpenInBuilder(item)}
                          className={`flex w-full cursor-pointer items-center justify-between rounded-lg px-2.5 py-1.5 text-left text-xs transition ${
                            item.id === eventId
                              ? 'bg-[#cc785c] font-bold text-white'
                              : 'bg-[#faf9f5] text-[#141413] hover:bg-[#faf9f5]'
                          }`}
                        >
                          <span className="truncate">{item.clientName}</span>
                          <span className="ml-2 shrink-0 font-mono text-[10px] opacity-80">
                            {item.eventDate.slice(0, 10)}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <p className="text-xs text-[#6c6a64]">
                    Selecciona un template (muestra cuántas invitaciones has
                    creado con cada uno):
                  </p>

                  {TEMPLATES_CATALOG.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setTemplate(tpl.id as TemplateId)}
                      className={`flex w-full cursor-pointer items-center gap-3.5 rounded-xl border p-3 text-left transition ${
                        templateId === tpl.id
                          ? 'border-[#cc785c] bg-[#cc785c]/10'
                          : 'border-[#e6dfd8] bg-[#faf9f5] hover:border-[#d7cfc4]'
                      }`}
                    >
                      <img
                        src={tpl.previewImage}
                        alt={tpl.name}
                        className="h-14 w-14 shrink-0 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between">
                          <p className="truncate text-sm font-bold text-[#141413]">
                            {tpl.name}
                          </p>
                          <span className="rounded-full bg-[#ebe6df] px-2 py-0.5 text-[10px] font-bold text-[#a9583e]">
                            {templateCounts[tpl.id] || 0} creadas
                          </span>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-xs text-[#6c6a64]">
                          {tpl.categoryLabel} • {tpl.signatureAnimation}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {inspectorTab === 'colors' && (
                <div className="space-y-5">
                  <div>
                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-[#3d3d3a] uppercase">
                      Nombre del Cliente
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setMeta({ clientName: e.target.value })}
                      className="w-full rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-3.5 py-2 text-sm text-[#141413] outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-[#3d3d3a] uppercase">
                      URL Personalizada (Slug del Cliente)
                    </label>
                    <div className="flex items-center rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-3 py-2 text-xs">
                      <span className="text-[#8e8b82]">dominio.com/</span>
                      <input
                        type="text"
                        value={slug}
                        onChange={(e) => setMeta({ slug: e.target.value })}
                        className="ml-1 flex-1 bg-transparent font-semibold text-[#cc785c] outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-xs font-bold tracking-wider text-[#3d3d3a] uppercase">
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
                          className="flex items-center justify-between rounded-xl border border-[#e6dfd8] bg-[#faf9f5] p-2.5 text-xs"
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
                    <label className="mb-2 block text-xs font-bold tracking-wider text-[#3d3d3a] uppercase">
                      Sello del Sobre Interactivo
                    </label>
                    <input
                      type="text"
                      value={config.theme.envelope.sealMonogram}
                      onChange={(e) =>
                        updateEnvelope({ sealMonogram: e.target.value })
                      }
                      placeholder="Ej. S & M o XV"
                      className="w-full rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-3.5 py-2.5 text-sm text-[#141413] outline-none"
                    />
                  </div>
                </div>
              )}

              {inspectorTab === 'content' && (
                <div className="space-y-4">
                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#3d3d3a]">
                      Etiqueta Superior (Badge)
                    </label>
                    <input
                      type="text"
                      value={config.content.hero.badgeText}
                      onChange={(e) =>
                        updateHero({ badgeText: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-3.5 py-2 text-sm text-[#141413] outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#3d3d3a]">
                      Título Principal / Festejados
                    </label>
                    <input
                      type="text"
                      value={config.content.hero.mainTitle}
                      onChange={(e) => {
                        updateHero({ mainTitle: e.target.value });
                        setMeta({ title: e.target.value });
                      }}
                      className="w-full rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-3.5 py-2 text-sm text-[#141413] outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#3d3d3a]">
                      Fecha y Ciudad (Subtítulo)
                    </label>
                    <input
                      type="text"
                      value={config.content.hero.tagline}
                      onChange={(e) => updateHero({ tagline: e.target.value })}
                      className="w-full rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-3.5 py-2 text-sm text-[#141413] outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#3d3d3a]">
                      Fotografía de portada
                    </label>
                    <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploadingPhoto || !invitations.some(i => i.id === eventId)} className="mb-2 block w-full text-xs" onChange={async (e) => {
                      const file = e.target.files?.[0]; e.target.value = ''; if (!file) return;
                      if (file.size > 8 * 1024 * 1024) { toast.error('Cada foto puede pesar hasta 8 MB'); return; }
                      setUploadingPhoto(true);
                      try { const form = new FormData(); form.set('eventId', eventId); form.set('file', file); const response = await fetch('/api/admin/assets', { method: 'POST', body: form }); const result = await response.json(); if (!response.ok) throw new Error(result.error); updateHero({ coverImageUrl: result.url }); toast.success('Foto subida. Guarda los cambios para aplicarla.'); } catch (err) { toast.error(err instanceof Error ? err.message : 'No se pudo subir la foto'); } finally { setUploadingPhoto(false); }
                    }} />
                    <p className="mb-2 text-xs text-[#6c6a64]">{uploadingPhoto ? 'Subiendo foto…' : 'JPG, PNG o WebP · máximo 8 MB'}</p>
                    {config.content.hero.coverImageUrl && <img src={config.content.hero.coverImageUrl} alt="Portada actual" className="h-28 w-full rounded-xl object-cover" />}
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#3d3d3a]">Fotos de la galería</label>
                    <input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploadingPhoto || !invitations.some(i => i.id === eventId)} className="block w-full text-xs" onChange={async e => {
                      const file = e.target.files?.[0]; e.target.value = ''; if (!file) return;
                      if (file.size > 8 * 1024 * 1024) { toast.error('Cada foto puede pesar hasta 8 MB'); return; }
                      setUploadingPhoto(true);
                      try { const form = new FormData(); form.set('eventId', eventId); form.set('file', file); const response = await fetch('/api/admin/assets', { method: 'POST', body: form }); const result = await response.json(); if (!response.ok) throw new Error(result.error); updateGallery([...useBuilderStore.getState().config.content.gallery.images, { url: result.url }]); toast.success('Foto subida. Guarda los cambios para aplicarla.'); } catch (err) { toast.error(err instanceof Error ? err.message : 'No se pudo subir la foto'); } finally { setUploadingPhoto(false); }
                    }} />
                    <p className="my-2 text-xs text-[#6c6a64]">JPG, PNG o WebP · máximo 8 MB por foto</p>
                    <div className="grid grid-cols-3 gap-2">{config.content.gallery.images.map((photo, index) => <div key={`${photo.url}-${index}`} className="relative"><img src={photo.url} alt={`Foto ${index + 1}`} className="aspect-square w-full rounded-lg object-cover" /><button type="button" aria-label={`Quitar foto ${index + 1}`} className="absolute right-1 top-1 rounded-full bg-white px-2 text-sm" onClick={() => updateGallery(config.content.gallery.images.filter((_, i) => i !== index))}>×</button></div>)}</div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-semibold text-[#3d3d3a]">
                      Código de Vestimenta
                    </label>
                    <input
                      type="text"
                      value={config.content.dressCode.title}
                      onChange={(e) =>
                        updateDressCode({ title: e.target.value })
                      }
                      className="w-full rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-3.5 py-2 text-sm text-[#141413] outline-none"
                    />
                  </div>
                </div>
              )}

              {inspectorTab === 'sections' && (
                <div className="space-y-2.5">
                  <p className="text-xs text-[#6c6a64]">
                    Activa o desactiva cualquiera de los 12 bloques modulares:
                  </p>
                  <div className="rounded-xl border border-[#e6dfd8] bg-white p-3 text-xs"><p className="mb-2 font-semibold">Funciones sociales</p><label className="flex items-center justify-between py-1">Sugerencias de canciones<input type="checkbox" checked={config.content.socialFeatures.enableSongRequests} onChange={e => updateSocialFeatures({ enableSongRequests: e.target.checked })} className="h-4 w-4 accent-[#cc785c]" /></label><label className="flex items-center justify-between py-1">Mensajes de voz<input type="checkbox" checked={config.content.socialFeatures.enableAudioGuestbook} onChange={e => updateSocialFeatures({ enableAudioGuestbook: e.target.checked })} className="h-4 w-4 accent-[#cc785c]" /></label><p className="mt-2 text-[#6c6a64]">Activa también la sección social y guarda los cambios.</p></div>
                  {config.sectionsOrder.map((sec) => (
                    <div
                      key={sec.id}
                      className="flex items-center justify-between rounded-xl border border-[#e6dfd8] bg-[#faf9f5] px-3.5 py-2.5 text-xs"
                    >
                      <span className="font-medium text-[#141413]">
                        {SECTION_LABELS[sec.id]}
                      </span>
                      <input
                        type="checkbox"
                        checked={sec.enabled}
                        onChange={() => toggleSection(sec.id)}
                        className="h-4 w-4 cursor-pointer accent-[#cc785c]"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Lienzo Central de Previsualización Interactiva */}
          <main className="dashboard-builder__preview flex min-w-0 flex-1 flex-col bg-[#faf9f5]">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#e6dfd8] bg-[#f5f0e8] px-4 py-2.5 sm:px-6">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => useBuilderStore.temporal.getState().undo()}
                  className="cursor-pointer rounded-lg border border-[#e6dfd8] p-1.5 text-[#6c6a64] hover:text-[#141413]"
                  title="Deshacer (Undo)"
                >
                  <Undo2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => useBuilderStore.temporal.getState().redo()}
                  className="cursor-pointer rounded-lg border border-[#e6dfd8] p-1.5 text-[#6c6a64] hover:text-[#141413]"
                  title="Rehacer (Redo)"
                >
                  <Redo2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewEnvelopeOpen(!previewEnvelopeOpen)}
                  className="ml-2 cursor-pointer rounded-lg border border-[#cc785c]/40 bg-[#cc785c]/10 px-3 py-1 text-xs font-semibold text-[#a9583e]"
                >
                  {previewEnvelopeOpen
                    ? 'Probar Sobre Cerrado'
                    : 'Abrir Sobre en Preview'}
                </button>
                <Link
                  href={`/invitacion/${encodeURIComponent(slug)}`}
                  target="_blank"
                  className="ml-2 inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#e6dfd8] bg-white px-3 py-1 text-xs font-medium text-[#3d3d3a] hover:text-[#141413]"
                >
                  <span>
                    {activeInvitationRecord?.status === 'published'
                      ? `Ver URL Pública (/${slug})`
                      : `Vista previa privada (/${slug})`}
                  </span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
              </div>

              <div className="flex items-center gap-1 rounded-xl border border-[#e6dfd8] bg-white p-1">
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
                      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition ${
                        viewport === vp.id
                          ? 'bg-[#cc785c] text-white'
                          : 'text-[#6c6a64] hover:text-[#141413]'
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      <span className="hidden sm:inline">{vp.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-1 items-start justify-center overflow-y-auto p-4 sm:p-8">
              <div
                data-invitation-scroller
                className={`relative overflow-y-auto rounded-xl border border-[#d7cfc4]  transition-all duration-300 ${
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

      {/* =====================================================================
          VISTA 3: CRM DE INVITADOS Y LINKS WHATSAPP DEL CLIENTE ACTIVO
      ===================================================================== */}
      {activeTab === 'guests' && (
        <div className="mx-auto w-full max-w-6xl space-y-8 p-6 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider text-[#cc785c] uppercase">
                CRM de Invitados del Cliente
              </span>
              <h2 className="text-2xl font-medium text-[#141413]">
                {activeInvitationRecord?.clientName} ({title})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className="cursor-pointer rounded-xl border border-[#d7cfc4] bg-white px-4 py-2 text-xs font-semibold text-[#141413] hover:bg-[#ebe6df]"
            >
              Cambiar de Cliente / Invitación
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-[#e6dfd8] bg-white p-5">
              <span className="text-xs text-[#6c6a64] uppercase">
                Familias / Grupos en Lista
              </span>
              <p className="mt-1 text-3xl font-bold text-[#141413]">
                {activeGuests.length} Grupos
              </p>
              <span className="text-xs text-[#cc785c]">
                {totalAllocated} pases asignados en total
              </span>
            </div>
            <div className="rounded-xl border border-[#e6dfd8] bg-white p-5">
              <span className="text-xs text-[#6c6a64] uppercase">
                Invitados Confirmados (RSVP)
              </span>
              <p className="mt-1 text-3xl font-bold text-[#5db872]">
                {totalConfirmed} Personas
              </p>
              <span className="text-xs text-[#6c6a64]">
                Con Pase QR firmado generado
              </span>
            </div>
            <div className="rounded-xl border border-[#e6dfd8] bg-white p-5">
              <span className="text-xs text-[#6c6a64] uppercase">
                URL Base del Cliente
              </span>
              <p className="mt-1 truncate font-mono text-base font-bold text-[#cc785c]">
                /{slug}
              </p>
              <span className="text-xs text-[#6c6a64]">
                Smart Guest Links activos (?g=token)
              </span>
            </div>
          </div>

          <form
            onSubmit={handleAddGuestGroup}
            className="grid gap-4 rounded-xl border border-[#e6dfd8] bg-[#f5f0e8] p-6 sm:grid-cols-6"
          >
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs text-[#6c6a64]">
                Nombre de Familia o Invitado
              </label>
              <input
                type="text"
                required
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
                placeholder="Ej. Familia Hernández Soto"
                className="w-full rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-3.5 py-2.5 text-sm text-[#141413] outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#6c6a64]">
                WhatsApp
              </label>
              <input
                type="tel"
                value={newGuestPhone}
                onChange={(e) => setNewGuestPhone(e.target.value)}
                placeholder="525512345678"
                className="w-full rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-3.5 py-2.5 text-sm text-[#141413] outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#6c6a64]">
                Pases Adulto / Niño
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={newGuestAdults}
                  onChange={(e) => setNewGuestAdults(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-3 py-2.5 text-sm text-[#141413] outline-none"
                />
                <input
                  type="number"
                  min={0}
                  max={10}
                  value={newGuestChildren}
                  onChange={(e) => setNewGuestChildren(Number(e.target.value))}
                  className="w-full rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-3 py-2.5 text-sm text-[#141413] outline-none"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs text-[#6c6a64]">
                Mesa Asignada
              </label>
              <input
                type="text"
                value={newGuestTable}
                onChange={(e) => setNewGuestTable(e.target.value)}
                className="w-full rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-3.5 py-2.5 text-sm text-[#141413] outline-none"
              />
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full cursor-pointer rounded-xl bg-[#cc785c] py-2.5 text-xs font-bold tracking-wider text-white uppercase transition hover:bg-[#a9583e]"
              >
                + Crear Pase Único
              </button>
            </div>
          </form>

          <div className="overflow-x-auto rounded-xl border border-[#e6dfd8] bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-[#e6dfd8] bg-[#faf9f5] text-xs text-[#6c6a64] uppercase">
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
                {activeGuests.map((g) => {
                  const invitePath = `/invitacion/${encodeURIComponent(slug)}?g=${encodeURIComponent(g.guestToken)}`;
                  const fullInviteUrl = `https://heyday.party${invitePath}`;
                  const waUrl = buildWhatsappInviteUrl({
                    phone: g.whatsappPhone || '525512345678',
                    groupName: g.groupName,
                    eventTitle: title,
                    allocatedAdults: g.allocatedAdults,
                    allocatedChildren: g.allocatedChildren,
                    invitationUrl: fullInviteUrl,
                  });

                  return (
                    <tr key={g.id} className="hover:bg-[#f5f0e8]">
                      <td className="px-5 py-4 font-semibold text-[#141413]">
                        {g.groupName}
                        <span className="block text-xs font-normal text-[#6c6a64]">
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
                              ? 'bg-[#5db872]/10 text-[#5db872]'
                              : g.rsvpStatus === 'viewed'
                                ? 'bg-[#cc785c]/10 text-[#a9583e]'
                                : 'bg-[#ebe6df] text-[#6c6a64]'
                          }`}
                        >
                          {g.rsvpStatus === 'confirmed'
                            ? `Confirmado (${g.confirmedAdults + g.confirmedChildren})`
                            : g.rsvpStatus === 'viewed'
                              ? 'Sobre Abierto'
                              : 'Pendiente'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-[#3d3d3a]">
                        {g.tableName}
                      </td>
                      <td className="px-5 py-4">
                        <Link
                          href={invitePath}
                          target="_blank"
                          className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-[#cc785c] hover:underline"
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
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-[#d7cfc4] px-2.5 py-1.5 text-xs text-[#141413] hover:bg-[#ebe6df]"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Copiar Link
                          </button>
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-[#5db872] px-3 py-1.5 text-xs font-semibold text-[#141413] hover:bg-[#5db872]"
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

      {/* =====================================================================
          VISTA 4: RECEPCIÓN Y ESCÁNER DE PASES QR
      ===================================================================== */}
      {activeTab === 'checkin' && (
        <div className="mx-auto w-full max-w-4xl space-y-6 p-6 sm:p-10">
          <div className="rounded-xl border border-[#e6dfd8] bg-white p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-[#cc785c]/10 text-[#cc785c]">
              <QrCode className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-[#141413]">
              Modo Recepción — {activeInvitationRecord?.title || 'Selecciona una invitación'}
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-[#6c6a64]">
              Escanea el pase para validar la confirmación y registrar la entrada.
            </p>

            {activeInvitationRecord ? <EventReception key={activeInvitationRecord.id} eventId={activeInvitationRecord.id} onCheckedIn={load} /> : <p className="mt-4 text-sm">Selecciona una invitación para registrar entradas.</p>}

          </div>
          {activeInvitationRecord && <EventMemories key={activeInvitationRecord.id} eventId={activeInvitationRecord.id} />}
        </div>
      )}

      {/* =====================================================================
          MODAL: CREAR NUEVA INVITACIÓN DE CLIENTE (GUARDADO POR TEMPLATE)
      ===================================================================== */}
      {shareAccess && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-[#141413]/75 p-4" role="dialog" aria-modal="true" aria-label="Acceso del cliente">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl sm:p-8">
            <p className="text-xs font-bold uppercase tracking-widest text-[#a9583e]">Acceso del cliente</p>
            <h2 className="mt-2 text-2xl font-semibold text-[#141413]">Invitación lista para compartir</h2>
            <p className="mt-3 text-sm text-[#6c6a64]">Guarda estos datos. El PIN se muestra una sola vez y un PIN nuevo invalida el anterior.</p>
            <div className="mt-5 space-y-3 rounded-xl bg-[#f5f0e8] p-4 text-sm">
              <div><span className="block text-xs font-bold text-[#6c6a64]">URL DE EDICIÓN</span><span className="break-all font-medium">{typeof window !== 'undefined' ? window.location.origin : ''}/editar/{shareAccess.slug}</span></div>
              <div><span className="block text-xs font-bold text-[#6c6a64]">CONTRASEÑA</span><strong className="font-mono text-3xl tracking-[.25em]">{shareAccess.pin}</strong></div>
            </div>
            <div className="mt-6 flex flex-wrap gap-2">
              <button type="button" onClick={async () => { await navigator.clipboard.writeText(`Edita tu invitación aquí: ${window.location.origin}/editar/${shareAccess.slug}\nContraseña: ${shareAccess.pin}`); toast.success('Acceso copiado'); }} className="inline-flex items-center gap-2 rounded-lg bg-[#cc785c] px-4 py-2.5 text-sm font-semibold text-white"><Copy className="h-4 w-4" />Copiar URL y contraseña</button>
              <Link href={`/editar/${encodeURIComponent(shareAccess.slug)}`} className="rounded-lg border border-[#d7cfc4] px-4 py-2.5 text-sm font-semibold">Abrir editor</Link>
              <button type="button" onClick={() => setShareAccess(null)} className="rounded-lg px-4 py-2.5 text-sm">Cerrar</button>
            </div>
          </div>
        </div>
      )}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#141413]/70 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-[#d7cfc4] bg-white p-6  sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold tracking-wider text-[#cc785c] uppercase">
                  Registro Multi-Cliente
                </span>
                <h3 className="text-xl font-bold text-[#141413]">
                  Crear Nueva Invitación y Guardar en Template
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="cursor-pointer rounded-lg p-1.5 text-[#6c6a64] hover:bg-[#ebe6df] hover:text-[#141413]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => handleCreateNewInvitation(e, true)}
              className="space-y-4"
            >
              <div>
                <label className="mb-1 block text-xs font-semibold text-[#3d3d3a]">
                  1. Selecciona el Template (Se guardará en su historial)
                </label>
                <select
                  value={newForm.templateId}
                  onChange={(e) =>
                    setNewForm((prev) => ({
                      ...prev,
                      templateId: e.target.value as TemplateId,
                    }))
                  }
                  className="w-full rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-3.5 py-2.5 text-sm text-[#141413] outline-none focus:border-[#cc785c]"
                >
                  {TEMPLATES_CATALOG.map((tpl) => (
                    <option key={tpl.id} value={tpl.id}>
                      {tpl.name} — ({tpl.categoryLabel})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#3d3d3a]">
                    2. Nombre del Cliente
                  </label>
                  <input
                    type="text"
                    required
                    value={newForm.clientName}
                    onChange={(e) =>
                      setNewForm((prev) => ({
                        ...prev,
                        clientName: e.target.value,
                      }))
                    }
                    placeholder="Ej. Familia Garza / Lucía y Fer"
                    className="w-full rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-3.5 py-2.5 text-sm text-[#141413] outline-none focus:border-[#cc785c]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#3d3d3a]">
                    Teléfono WhatsApp del Cliente
                  </label>
                  <input
                    type="tel"
                    value={newForm.clientPhone}
                    onChange={(e) =>
                      setNewForm((prev) => ({
                        ...prev,
                        clientPhone: e.target.value,
                      }))
                    }
                    placeholder="+52 55 1234 5678"
                    className="w-full rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-3.5 py-2.5 text-sm text-[#141413] outline-none focus:border-[#cc785c]"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#3d3d3a]">
                    3. Título del Evento (Festejados)
                  </label>
                  <input
                    type="text"
                    required
                    value={newForm.title}
                    onChange={(e) => {
                      const titleVal = e.target.value;
                      setNewForm((prev) => ({
                        ...prev,
                        title: titleVal,
                        slug: slugify(titleVal),
                      }));
                    }}
                    placeholder="Ej. Boda Lucía & Fernando"
                    className="w-full rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-3.5 py-2.5 text-sm text-[#141413] outline-none focus:border-[#cc785c]"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-[#3d3d3a]">
                    Fecha del Evento
                  </label>
                  <input
                    type="date"
                    required
                    value={newForm.eventDate}
                    onChange={(e) =>
                      setNewForm((prev) => ({
                        ...prev,
                        eventDate: e.target.value,
                      }))
                    }
                    className="w-full rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-3.5 py-2.5 text-sm text-[#141413] outline-none focus:border-[#cc785c]"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-[#3d3d3a]">
                  4. URL Personalizada del Cliente
                </label>
                <div className="flex items-center rounded-xl border border-[#d7cfc4] bg-[#faf9f5] px-3.5 py-2.5 text-xs">
                  <span className="text-[#8e8b82]">
                    heyday.party/invitacion/
                  </span>
                  <input
                    type="text"
                    required
                    value={newForm.slug}
                    onChange={(e) =>
                      setNewForm((prev) => ({
                        ...prev,
                        slug: slugify(e.target.value),
                      }))
                    }
                    placeholder="boda-lucia-y-fernando"
                    className="ml-1 flex-1 bg-transparent font-mono font-bold text-[#cc785c] outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="cursor-pointer rounded-xl border border-[#d7cfc4] px-4 py-2.5 text-xs font-semibold text-[#3d3d3a] hover:bg-[#ebe6df]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-[#cc785c] px-5 py-2.5 text-xs font-bold tracking-wider text-white uppercase  transition hover:bg-[#a9583e]"
                >
                  <Wand2 className="h-4 w-4" />
                  Guardar en Historial y Personalizar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-dvh items-center justify-center bg-[#faf9f5] text-[#6c6a64]">
          Cargando Dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
