'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import {
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  FolderKanban,
  LogOut,
  Plus,
  QrCode,
  Search,
  Trash2,
  UserCheck,
  Users,
  Wand2,
  X,
} from 'lucide-react';
import {
  useEventsStore,
  type ClientInvitationRecord,
} from '@/stores/useEventsStore';
import { TEMPLATES_CATALOG } from '@/lib/templates/templates-catalog';
import { createClient } from '@/lib/supabase/client';
import { slugify } from '@/lib/utils';
import type { TemplateId } from '@/types/invitation.types';
import { DashboardEventHistory } from '@/components/dashboard/DashboardEventHistory';
import { HeyDayBrand } from '@/components/brand/HeyDayBrand';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import './dashboard.css';

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


  const [shareAccess, setShareAccess] = useState<{ slug: string; pin: string } | null>(null);
  const [invitationToDelete, setInvitationToDelete] = useState<ClientInvitationRecord | null>(null);
  const [deletingInvitation, setDeletingInvitation] = useState(false);
  const [adminEmail, setAdminEmail] = useState<string>(
    'Administrador'
  );
  const [activeTab, setActiveTab] = useState<'history' | 'guests' | 'checkin'>('history');

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

  const handleOpenEditor = (record: ClientInvitationRecord) => router.push(`/editar/${encodeURIComponent(record.slug)}`);

  const handleGenerateAccess = async (record: ClientInvitationRecord) => {
    try {
      const response = await fetch(`/api/admin/invitations/${encodeURIComponent(record.id)}/pin`, { method: 'POST' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo generar el acceso');
      setShareAccess({ slug: result.slug, pin: result.pin });
    } catch (error) { toast.error(error instanceof Error ? error.message : 'No se pudo generar el acceso'); }
  };

  const handleCreateNewInvitation = async (
    e: React.FormEvent,
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

    } catch (err) { toast.error(err instanceof Error ? err.message : 'No se pudo crear la invitación'); }
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

          <nav className="dashboard-main-nav" aria-label="Secciones del administrador">
            <button type="button" className={activeTab === 'history' ? 'active' : ''} onClick={() => setActiveTab('history')}><FolderKanban size={16} /> Invitaciones</button>
            <button type="button" className={activeTab === 'guests' ? 'active' : ''} onClick={() => setActiveTab('guests')}><Users size={16} /> Invitados</button>
            <button type="button" className={activeTab === 'checkin' ? 'active' : ''} onClick={() => setActiveTab('checkin')}><QrCode size={16} /> Recepción QR</button>
          </nav>
        </div>

        {/* Acciones: crear invitación y cerrar sesión */}
        <div className="flex items-center gap-2">
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
            className="inline-flex h-10 cursor-pointer items-center gap-1.5 rounded-lg border border-[#cc785c]/40 bg-[#cc785c]/10 px-3.5 text-xs font-semibold text-[#a9583e] transition hover:bg-[#cc785c] hover:text-white"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden whitespace-nowrap sm:inline">Nueva invitación</span>
          </button>

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

                      return (
                        <tr
                          key={inv.id}
                          className="transition hover:bg-[#f5f0e8]"
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[#141413]">
                                {inv.clientName}
                              </span>
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
                                onClick={() => handleOpenEditor(inv)}
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
                                onClick={() => setInvitationToDelete(inv)}
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

      {activeTab === 'guests' && <DashboardEventHistory invitations={invitations} mode="guests" />}
      {activeTab === 'checkin' && <DashboardEventHistory invitations={invitations} mode="checkin" />}

      {/* =====================================================================
          MODAL: CREAR NUEVA INVITACIÓN DE CLIENTE (GUARDADO POR TEMPLATE)
      ===================================================================== */}
      {invitationToDelete && <ConfirmDialog title="Eliminar invitación" description={`Se eliminará la invitación de ${invitationToDelete.clientName} y sus pases de invitados. Esta acción no se puede deshacer.`} confirmLabel="Sí, eliminar" busy={deletingInvitation} onCancel={() => setInvitationToDelete(null)} onConfirm={async () => {
        setDeletingInvitation(true);
        try {
          await deleteInvitation(invitationToDelete.id);
          toast.success('Invitación eliminada');
          setInvitationToDelete(null);
        } catch (err) { toast.error(err instanceof Error ? err.message : 'No se pudo eliminar'); }
        finally { setDeletingInvitation(false); }
      }} />}
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
                  Crear nueva invitación
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
              onSubmit={handleCreateNewInvitation}
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
                  Crear invitación
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
