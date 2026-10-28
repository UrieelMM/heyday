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
import { getAdminSession, logoutFakeAdmin } from '@/lib/auth/fake-auth';
import { slugify } from '@/lib/utils';
import type { SectionId, TemplateId } from '@/types/invitation.types';

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
    invitations,
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
    updateDressCode,
  } = useBuilderStore();

  const [adminEmail, setAdminEmail] = useState<string>(
    'admin@atelierinvitaciones.com'
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

  // Verificar sesión del administrador
  useEffect(() => {
    const session = getAdminSession();
    if (!session) {
      router.replace('/login');
      return;
    }
    setAdminEmail(session.email);
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
    loadInvitationRecord(record);
    setActiveTab('builder');
    toast.success(
      `Editando invitación de ${record.clientName} (${record.title})`
    );
  };

  const handleSaveCurrentBuilder = () => {
    updateInvitation(eventId, {
      slug,
      clientName,
      title,
      templateId,
      eventDate,
      config: structuredClone(config),
    });
    toast.success(
      `¡Cambios guardados en el historial de ${templateId} para ${clientName}!`
    );
  };

  const handleCreateNewInvitation = (
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

    const created = addInvitation({
      clientName: newForm.clientName.trim(),
      clientEmail: newForm.clientEmail.trim() || 'cliente@email.com',
      clientPhone: newForm.clientPhone.trim() || '+52 55 0000 0000',
      title: newForm.title.trim(),
      slug: finalSlug,
      templateId: newForm.templateId,
      eventDate: `${newForm.eventDate}T17:00:00-06:00`,
    });

    setSelectedHistoryTemplate(newForm.templateId);
    setIsNewModalOpen(false);
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

    if (openBuilderAfter) {
      loadInvitationRecord(created);
      setActiveTab('builder');
    }
  };

  const handleAddGuestGroup = (e: React.FormEvent) => {
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

    updateInvitation(activeInvitationRecord.id, { guests: updatedGuests });
    setNewGuestName('');
    setNewGuestPhone('');
    toast.success(`Pase único creado para ${newGuestName}`);
  };

  const handleLogout = () => {
    logoutFakeAdmin();
    toast.info('Sesión cerrada correctamente');
    router.push('/login');
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
    <div className="flex min-h-dvh flex-col bg-stone-950 text-stone-100">
      {/* TOPBAR DEL DASHBOARD */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 bg-stone-900/90 px-6 py-3.5 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-4">
          <Link href="/" className="flex cursor-pointer items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500 text-stone-950">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-bold tracking-tight text-white">
              Atelier<span className="text-amber-400">Admin</span>
            </span>
          </Link>

          <div className="hidden h-5 w-px bg-white/15 sm:block" />

          {/* Navegación de Módulos */}
          <div className="flex flex-wrap rounded-xl border border-white/10 bg-stone-950 p-1">
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === 'history'
                  ? 'bg-amber-500 text-stone-950'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <FolderKanban className="h-3.5 w-3.5" />
              Clientes & Historial por Template ({invitations.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('builder')}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
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
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === 'guests'
                  ? 'bg-amber-500 text-stone-950'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Users className="h-3.5 w-3.5" />
              Invitados de {title} ({activeGuests.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('checkin')}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition ${
                activeTab === 'checkin'
                  ? 'bg-amber-500 text-stone-950'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <QrCode className="h-3.5 w-3.5" />
              Recepción QR
            </button>
          </div>
        </div>

        {/* Acciones Derecha: Crear Nueva Invitación + Guardar + Logout */}
        <div className="flex items-center gap-2.5">
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
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/15 px-3.5 py-2 text-xs font-bold text-amber-300 transition hover:bg-amber-500 hover:text-stone-950"
          >
            <Plus className="h-4 w-4" />
            Nueva Invitación de Cliente
          </button>

          {activeTab === 'builder' && (
            <button
              type="button"
              onClick={handleSaveCurrentBuilder}
              className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-amber-500 px-4 py-2 text-xs font-bold tracking-wider text-stone-950 uppercase shadow-md transition hover:bg-amber-400"
            >
              <CheckCircle2 className="h-4 w-4" />
              Guardar Cambios
            </button>
          )}

          <div className="hidden items-center gap-2 rounded-xl border border-white/10 bg-stone-950 px-3 py-1.5 text-xs xl:flex">
            <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-stone-400">{adminEmail}</span>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            title="Cerrar sesión"
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-semibold text-stone-300 transition hover:bg-rose-500/20 hover:text-rose-300"
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
        <div className="mx-auto grid w-full max-w-7xl flex-1 gap-6 p-6 lg:grid-cols-12">
          {/* Columna Izquierda: Selector de los 10 Templates con Historial */}
          <aside className="space-y-3 lg:col-span-3">
            <div className="rounded-2xl border border-white/10 bg-stone-900/70 p-4">
              <h2 className="text-xs font-bold tracking-wider text-amber-400 uppercase">
                Historial por Template
              </h2>
              <p className="mt-1 text-xs text-stone-400">
                Selecciona una plantilla para ver todas las invitaciones de
                clientes creadas con ella:
              </p>

              <div className="mt-4 space-y-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedHistoryTemplate('all')}
                  className={`flex w-full cursor-pointer items-center justify-between rounded-xl px-3.5 py-2.5 text-left text-xs font-semibold transition ${
                    selectedHistoryTemplate === 'all'
                      ? 'bg-amber-500 text-stone-950 font-bold'
                      : 'text-stone-300 hover:bg-white/5'
                  }`}
                >
                  <span>Todos los Templates</span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] ${
                      selectedHistoryTemplate === 'all'
                        ? 'bg-stone-950/20 text-stone-950'
                        : 'bg-stone-800 text-stone-300'
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
                          ? 'bg-amber-500 font-bold text-stone-950 shadow-sm'
                          : 'text-stone-300 hover:bg-white/5'
                      }`}
                    >
                      <span className="truncate">
                        {idx + 1}. {tpl.name}
                      </span>
                      <span
                        className={`ml-2 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          isSelected
                            ? 'bg-stone-950/20 text-stone-950'
                            : 'bg-stone-800 text-amber-300'
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
          <div className="flex flex-col space-y-5 lg:col-span-9">
            {/* Cabecera del Template Activo */}
            <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-stone-900/80 p-5">
              <div>
                <span className="text-xs font-bold tracking-wider text-amber-400 uppercase">
                  {selectedHistoryTemplate === 'all'
                    ? 'Historial Global Multi-Cliente'
                    : `Historial del Template: ${
                        TEMPLATES_CATALOG.find(
                          (t) => t.id === selectedHistoryTemplate
                        )?.name
                      }`}
                </span>
                <h1 className="mt-0.5 text-2xl font-extrabold text-white">
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
                className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-xs font-bold tracking-wider text-stone-950 uppercase shadow-lg shadow-amber-500/20 transition hover:bg-amber-400"
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
            <div className="grid gap-3 rounded-2xl border border-white/10 bg-stone-900/60 p-4 sm:grid-cols-12">
              {/* Búsqueda por Cliente / Evento / URL */}
              <div className="sm:col-span-4">
                <label className="mb-1 block text-[11px] font-semibold text-stone-400 uppercase">
                  Filtrar por Cliente, Evento o Slug
                </label>
                <div className="relative">
                  <Search className="pointer-events-none absolute top-2.5 left-3 h-4 w-4 text-stone-500" />
                  <input
                    type="text"
                    value={clientQuery}
                    onChange={(e) => setClientQuery(e.target.value)}
                    placeholder="Ej. Sofía, Camila, XV, boda-sofia..."
                    className="w-full rounded-xl border border-white/15 bg-stone-950 py-2 pr-3 pl-9 text-xs text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* Tipo de Fecha */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[11px] font-semibold text-stone-400 uppercase">
                  Campo de Fecha
                </label>
                <select
                  value={dateFilterField}
                  onChange={(e) =>
                    setDateFilterField(
                      e.target.value as 'eventDate' | 'createdAt'
                    )
                  }
                  className="w-full rounded-xl border border-white/15 bg-stone-950 px-3 py-2 text-xs text-white outline-none focus:border-amber-500"
                >
                  <option value="eventDate">Fecha de Evento</option>
                  <option value="createdAt">Fecha Creada</option>
                </select>
              </div>

              {/* Fecha Desde */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[11px] font-semibold text-stone-400 uppercase">
                  Desde
                </label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-stone-950 px-2.5 py-2 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              {/* Fecha Hasta */}
              <div className="sm:col-span-2">
                <label className="mb-1 block text-[11px] font-semibold text-stone-400 uppercase">
                  Hasta
                </label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full rounded-xl border border-white/15 bg-stone-950 px-2.5 py-2 text-xs text-white outline-none focus:border-amber-500"
                />
              </div>

              {/* Estado + Botón Limpiar */}
              <div className="flex items-end gap-2 sm:col-span-2">
                <div className="flex-1">
                  <label className="mb-1 block text-[11px] font-semibold text-stone-400 uppercase">
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
                    className="w-full rounded-xl border border-white/15 bg-stone-950 px-2.5 py-2 text-xs text-white outline-none focus:border-amber-500"
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
                    className="cursor-pointer rounded-xl border border-white/15 bg-stone-950 p-2 text-stone-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Tabla del Historial de Invitaciones */}
            <div className="overflow-x-auto rounded-2xl border border-white/10 bg-stone-900">
              <table className="w-full text-left text-sm">
                <thead className="border-b border-white/10 bg-stone-950/70 text-[11px] font-bold tracking-wider text-stone-400 uppercase">
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
                        className="px-6 py-12 text-center text-sm text-stone-400"
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
                          className={`transition hover:bg-white/[0.03] ${
                            isCurrentInBuilder ? 'bg-amber-500/[0.05]' : ''
                          }`}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-white">
                                {inv.clientName}
                              </span>
                              {isCurrentInBuilder && (
                                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                                  En Editor
                                </span>
                              )}
                            </div>
                            <span className="block text-xs text-stone-400">
                              Evento: {inv.title} • {inv.clientPhone}
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <button
                              type="button"
                              onClick={() =>
                                setSelectedHistoryTemplate(inv.templateId)
                              }
                              className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-white/10 bg-stone-950 px-2.5 py-1 text-xs font-semibold text-amber-300 hover:border-amber-500/40"
                            >
                              <span>{tplInfo?.name || inv.templateId}</span>
                            </button>
                          </td>

                          <td className="px-5 py-4 text-xs">
                            <p className="font-semibold text-stone-200">
                              Evento: {inv.eventDate.slice(0, 10)}
                            </p>
                            <p className="text-stone-500">
                              Creada: {inv.createdAt.slice(0, 10)}
                            </p>
                          </td>

                          <td className="px-5 py-4">
                            <Link
                              href={`/${inv.slug}?template=${inv.templateId}&g=fam-lopez-8a2f`}
                              target="_blank"
                              className="inline-flex cursor-pointer items-center gap-1 font-mono text-xs text-amber-400 hover:underline"
                            >
                              <span>/{inv.slug}</span>
                              <ExternalLink className="h-3 w-3" />
                            </Link>
                            <span className="block text-[11px] text-stone-500">
                              {inv.viewsCount} aperturas
                            </span>
                          </td>

                          <td className="px-5 py-4">
                            <span
                              className={`inline-flex rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                                inv.status === 'published'
                                  ? 'bg-emerald-500/15 text-emerald-400'
                                  : 'bg-amber-500/15 text-amber-300'
                              }`}
                            >
                              {inv.status === 'published'
                                ? 'Publicada'
                                : 'Borrador'}
                            </span>
                          </td>

                          <td className="px-5 py-4 text-right">
                            <div className="inline-flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenInBuilder(inv)}
                                className="inline-flex cursor-pointer items-center gap-1 rounded-xl bg-amber-500 px-3 py-1.5 text-xs font-bold text-stone-950 transition hover:bg-amber-400"
                              >
                                <Wand2 className="h-3.5 w-3.5" />
                                Personalizar
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  loadInvitationRecord(inv);
                                  setActiveTab('guests');
                                }}
                                className="inline-flex cursor-pointer items-center gap-1 rounded-xl border border-white/15 bg-white/5 px-2.5 py-1.5 text-xs font-semibold text-stone-200 transition hover:bg-white/10"
                              >
                                <Users className="h-3.5 w-3.5" />
                                Invitados
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  deleteInvitation(inv.id);
                                  toast.info('Invitación eliminada del historial');
                                }}
                                title="Eliminar invitación"
                                className="cursor-pointer rounded-xl border border-white/10 p-1.5 text-stone-400 transition hover:border-rose-500/40 hover:text-rose-400"
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
              <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/10 bg-stone-950/60 px-5 py-3.5 text-xs">
                <div className="flex items-center gap-3 text-stone-400">
                  <span>
                    Mostrando{' '}
                    <strong className="text-white">
                      {filteredInvitations.length === 0
                        ? 0
                        : (safePage - 1) * pageSize + 1}
                    </strong>{' '}
                    –{' '}
                    <strong className="text-white">
                      {Math.min(
                        safePage * pageSize,
                        filteredInvitations.length
                      )}
                    </strong>{' '}
                    de{' '}
                    <strong className="text-white">
                      {filteredInvitations.length}
                    </strong>{' '}
                    invitaciones
                  </span>

                  <select
                    value={pageSize}
                    onChange={(e) => setPageSize(Number(e.target.value))}
                    className="rounded-lg border border-white/15 bg-stone-900 px-2 py-1 text-xs text-white outline-none"
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
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-white/15 bg-stone-900 px-3 py-1.5 font-semibold text-stone-300 transition hover:bg-white/10 disabled:opacity-40"
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
                            ? 'bg-amber-500 text-stone-950'
                            : 'border border-white/10 bg-stone-900 text-stone-300 hover:bg-white/10'
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
                    className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-white/15 bg-stone-900 px-3 py-1.5 font-semibold text-stone-300 transition hover:bg-white/10 disabled:opacity-40"
                  >
                    Siguiente
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
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
        <div className="flex flex-1 overflow-hidden">
          {/* Panel Inspector Izquierdo */}
          <aside className="flex w-full max-w-md flex-col border-r border-white/10 bg-stone-900/60">
            {/* Tarjeta de Cliente Activo en el Builder */}
            <div className="border-b border-white/10 bg-stone-950/90 px-4 py-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold tracking-wider text-amber-400 uppercase">
                  Cliente Activo en Editor
                </span>
                <button
                  type="button"
                  onClick={() => setActiveTab('history')}
                  className="cursor-pointer text-[11px] font-semibold text-stone-400 underline hover:text-white"
                >
                  Cambiar cliente ({invitations.length})
                </button>
              </div>
              <p className="mt-0.5 truncate text-sm font-bold text-white">
                {clientName} — <span className="text-amber-300">/{slug}</span>
              </p>
            </div>

            {/* Sub-tabs del Inspector */}
            <div className="grid grid-cols-4 border-b border-white/10 bg-stone-950/60 p-1.5 text-xs font-semibold">
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
                <div className="space-y-4">
                  {/* Historial rápido de invitaciones creadas con el template seleccionado */}
                  <div className="rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-amber-300 uppercase">
                        Historial en {templateId} ({builderTemplateHistory.length}
                        )
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedHistoryTemplate(templateId);
                          setActiveTab('history');
                        }}
                        className="cursor-pointer text-[11px] font-semibold text-white underline"
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
                              ? 'bg-amber-500 font-bold text-stone-950'
                              : 'bg-stone-950/70 text-stone-200 hover:bg-stone-950'
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

                  <p className="text-xs text-stone-400">
                    Selecciona un template (muestra cuántas invitaciones has
                    creado con cada uno):
                  </p>

                  {TEMPLATES_CATALOG.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setTemplate(tpl.id as TemplateId)}
                      className={`flex w-full cursor-pointer items-center gap-3.5 rounded-2xl border p-3 text-left transition ${
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
                          <span className="rounded-full bg-stone-800 px-2 py-0.5 text-[10px] font-bold text-amber-300">
                            {templateCounts[tpl.id] || 0} creadas
                          </span>
                        </div>
                        <p className="mt-0.5 line-clamp-1 text-xs text-stone-400">
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
                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-stone-300 uppercase">
                      Nombre del Cliente
                    </label>
                    <input
                      type="text"
                      value={clientName}
                      onChange={(e) => setMeta({ clientName: e.target.value })}
                      className="w-full rounded-xl border border-white/15 bg-stone-950 px-3.5 py-2 text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="mb-1.5 block text-xs font-bold tracking-wider text-stone-300 uppercase">
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
                        className="h-4 w-4 cursor-pointer accent-amber-500"
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>

          {/* Lienzo Central de Previsualización Interactiva */}
          <main className="flex flex-1 flex-col bg-stone-950">
            <div className="flex items-center justify-between border-b border-white/10 bg-stone-900/40 px-6 py-2.5">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => useBuilderStore.temporal.getState().undo()}
                  className="cursor-pointer rounded-lg border border-white/10 p-1.5 text-stone-400 hover:text-white"
                  title="Deshacer (Undo)"
                >
                  <Undo2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => useBuilderStore.temporal.getState().redo()}
                  className="cursor-pointer rounded-lg border border-white/10 p-1.5 text-stone-400 hover:text-white"
                  title="Rehacer (Redo)"
                >
                  <Redo2 className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewEnvelopeOpen(!previewEnvelopeOpen)}
                  className="ml-2 cursor-pointer rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-1 text-xs font-semibold text-amber-300"
                >
                  {previewEnvelopeOpen
                    ? 'Probar Sobre Cerrado'
                    : 'Abrir Sobre en Preview'}
                </button>
                <Link
                  href={`/${slug}?template=${templateId}&g=fam-lopez-8a2f`}
                  target="_blank"
                  className="ml-2 inline-flex cursor-pointer items-center gap-1 rounded-lg border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-stone-300 hover:text-white"
                >
                  <span>Ver URL Pública (/{slug})</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
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
                      className={`inline-flex cursor-pointer items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-medium transition ${
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

      {/* =====================================================================
          VISTA 3: CRM DE INVITADOS Y LINKS WHATSAPP DEL CLIENTE ACTIVO
      ===================================================================== */}
      {activeTab === 'guests' && (
        <div className="mx-auto w-full max-w-6xl space-y-8 p-6 sm:p-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold tracking-wider text-amber-400 uppercase">
                CRM de Invitados del Cliente
              </span>
              <h2 className="text-2xl font-extrabold text-white">
                {activeInvitationRecord?.clientName} ({title})
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('history')}
              className="cursor-pointer rounded-xl border border-white/15 bg-white/5 px-4 py-2 text-xs font-semibold text-stone-200 hover:bg-white/10"
            >
              Cambiar de Cliente / Invitación
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-stone-900 p-5">
              <span className="text-xs text-stone-400 uppercase">
                Familias / Grupos en Lista
              </span>
              <p className="mt-1 text-3xl font-bold text-white">
                {activeGuests.length} Grupos
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
                URL Base del Cliente
              </span>
              <p className="mt-1 truncate font-mono text-base font-bold text-amber-400">
                /{slug}
              </p>
              <span className="text-xs text-stone-400">
                Smart Guest Links activos (?g=token)
              </span>
            </div>
          </div>

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
                className="w-full cursor-pointer rounded-xl bg-amber-500 py-2.5 text-xs font-bold tracking-wider text-stone-950 uppercase transition hover:bg-amber-400"
              >
                + Crear Pase Único
              </button>
            </div>
          </form>

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
                {activeGuests.map((g) => {
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
                          className="inline-flex cursor-pointer items-center gap-1 text-xs font-medium text-amber-400 hover:underline"
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
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg border border-white/15 px-2.5 py-1.5 text-xs text-stone-200 hover:bg-white/10"
                          >
                            <Copy className="h-3.5 w-3.5" />
                            Copiar Link
                          </button>
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex cursor-pointer items-center gap-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-emerald-500"
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
          <div className="rounded-3xl border border-white/10 bg-stone-900 p-8 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400">
              <QrCode className="h-8 w-8" />
            </div>
            <h2 className="text-2xl font-bold text-white">
              Modo Recepción — {title} ({clientName})
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm text-stone-400">
              Valida la firma HMAC-SHA256 de los códigos QR en la puerta del
              evento y asigna el ingreso en tiempo real.
            </p>

            <div className="mt-8 grid gap-4 text-left sm:grid-cols-2">
              {activeGuests.map((g) => (
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
                      if (!activeInvitationRecord) return;
                      const updated = activeInvitationRecord.guests.map(
                        (item) =>
                          item.id === g.id
                            ? {
                                ...item,
                                checkedInCount:
                                  item.allocatedAdults + item.allocatedChildren,
                              }
                            : item
                      );
                      updateInvitation(activeInvitationRecord.id, {
                        guests: updated,
                      });
                      toast.success(
                        `Check-in validado: ${g.groupName} -> Pasar a ${g.tableName}`
                      );
                    }}
                    className="mt-4 w-full cursor-pointer rounded-xl bg-white/10 py-2.5 text-xs font-semibold text-white transition hover:bg-amber-500 hover:text-stone-950"
                  >
                    Simular Escaneo QR en Puerta
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          MODAL: CREAR NUEVA INVITACIÓN DE CLIENTE (GUARDADO POR TEMPLATE)
      ===================================================================== */}
      {isNewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl border border-white/15 bg-stone-900 p-6 shadow-2xl sm:p-8">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold tracking-wider text-amber-400 uppercase">
                  Registro Multi-Cliente
                </span>
                <h3 className="text-xl font-bold text-white">
                  Crear Nueva Invitación y Guardar en Template
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNewModalOpen(false)}
                className="cursor-pointer rounded-lg p-1.5 text-stone-400 hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => handleCreateNewInvitation(e, true)}
              className="space-y-4"
            >
              <div>
                <label className="mb-1 block text-xs font-semibold text-stone-300">
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
                  className="w-full rounded-xl border border-white/15 bg-stone-950 px-3.5 py-2.5 text-sm text-white outline-none focus:border-amber-500"
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
                  <label className="mb-1 block text-xs font-semibold text-stone-300">
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
                    className="w-full rounded-xl border border-white/15 bg-stone-950 px-3.5 py-2.5 text-sm text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-stone-300">
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
                    className="w-full rounded-xl border border-white/15 bg-stone-950 px-3.5 py-2.5 text-sm text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-stone-300">
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
                    className="w-full rounded-xl border border-white/15 bg-stone-950 px-3.5 py-2.5 text-sm text-white outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-xs font-semibold text-stone-300">
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
                    className="w-full rounded-xl border border-white/15 bg-stone-950 px-3.5 py-2.5 text-sm text-white outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-xs font-semibold text-stone-300">
                  4. URL Personalizada del Cliente
                </label>
                <div className="flex items-center rounded-xl border border-white/15 bg-stone-950 px-3.5 py-2.5 text-xs">
                  <span className="text-stone-500">
                    www.dominioprincipal.com/
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
                    className="ml-1 flex-1 bg-transparent font-mono font-bold text-amber-400 outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="cursor-pointer rounded-xl border border-white/15 px-4 py-2.5 text-xs font-semibold text-stone-300 hover:bg-white/10"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex cursor-pointer items-center gap-1.5 rounded-xl bg-amber-500 px-5 py-2.5 text-xs font-bold tracking-wider text-stone-950 uppercase shadow-lg transition hover:bg-amber-400"
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
        <div className="flex min-h-dvh items-center justify-center bg-stone-950 text-stone-400">
          Cargando Dashboard...
        </div>
      }
    >
      <DashboardContent />
    </Suspense>
  );
}
