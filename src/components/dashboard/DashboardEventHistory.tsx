'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, QrCode, Search, Users } from 'lucide-react';
import type { ClientInvitationRecord } from '@/stores/useEventsStore';

type Mode = 'guests' | 'checkin';
type CheckinGuest = { id: string; group_name: string; confirmed_adults: number; confirmed_children: number; checked_in_count: number; last_checked_in_at: string | null };
type CheckinLog = { id: string; group_name: string; adults_count: number; children_count: number; created_at: string };
type CheckinHistory = { guests: CheckinGuest[]; logs: CheckinLog[]; total: number; pageSize: number };

export function DashboardEventHistory({ invitations, mode }: { invitations: ClientInvitationRecord[]; mode: Mode }) {
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState('all');
  const [eventPage, setEventPage] = useState(1);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [guestQuery, setGuestQuery] = useState('');
  const [guestStatus, setGuestStatus] = useState('all');
  const [guestPage, setGuestPage] = useState(1);
  const [logPage, setLogPage] = useState(1);
  const [checkins, setCheckins] = useState<CheckinHistory | null>(null);
  const [loadError, setLoadError] = useState('');

  const events = useMemo(() => invitations.filter(invitation => {
    const term = query.trim().toLocaleLowerCase('es-MX');
    return (!term || `${invitation.clientName} ${invitation.title} ${invitation.slug} ${invitation.clientEmail}`.toLocaleLowerCase('es-MX').includes(term)) && (status === 'all' || invitation.status === status);
  }).sort((a, b) => b.createdAt.localeCompare(a.createdAt)), [invitations, query, status]);
  const totalEventPages = Math.max(1, Math.ceil(events.length / 6));
  const safeEventPage = Math.min(eventPage, totalEventPages);
  const visibleEvents = events.slice((safeEventPage - 1) * 6, safeEventPage * 6);
  const selected = visibleEvents.find(invitation => invitation.id === selectedId) || visibleEvents[0] || null;

  useEffect(() => { setEventPage(1); }, [query, status]);
  useEffect(() => { setGuestPage(1); }, [guestQuery, guestStatus, selected?.id]);
  useEffect(() => { setLogPage(1); }, [selected?.id]);
  useEffect(() => {
    if (mode !== 'checkin' || !selected) return;
    let live = true;
    setCheckins(null);
    fetch(`/api/admin/invitations/${encodeURIComponent(selected.id)}/checkins?page=${logPage}`, { cache: 'no-store' })
      .then(async response => { const data = await response.json(); if (!response.ok) throw new Error(data.error); return data as CheckinHistory; })
      .then(data => { if (live) { setCheckins(data); setLoadError(''); } })
      .catch(error => { if (live) { setCheckins(null); setLoadError(error instanceof Error ? error.message : 'No se pudo cargar el historial'); } });
    return () => { live = false; };
  }, [mode, selected?.id, logPage]);

  const guests = useMemo(() => selected?.guests.filter(guest => {
    const term = guestQuery.trim().toLocaleLowerCase('es-MX');
    const matchesText = !term || `${guest.groupName} ${guest.tableName} ${guest.groupTag}`.toLocaleLowerCase('es-MX').includes(term);
    const matchesStatus = guestStatus === 'all' || (guestStatus === 'arrived' ? guest.checkedInCount > 0 : guest.rsvpStatus === guestStatus);
    return matchesText && matchesStatus;
  }).sort((a, b) => a.groupName.localeCompare(b.groupName, 'es-MX')) || [], [selected, guestQuery, guestStatus]);
  const totalGuestPages = Math.max(1, Math.ceil(guests.length / 10));
  const visibleGuests = guests.slice((guestPage - 1) * 10, guestPage * 10);
  const confirmed = selected?.guests.reduce((sum, guest) => sum + guest.confirmedAdults + guest.confirmedChildren, 0) || 0;
  const arrived = selected?.guests.reduce((sum, guest) => sum + guest.checkedInCount, 0) || 0;

  return <main className="dashboard-event-history">
    <div className="dashboard-event-history__heading"><div><p>{mode === 'guests' ? 'Historial de invitados' : 'Historial de recepción'}</p><h1>{mode === 'guests' ? 'Invitados por cliente' : 'Entradas por invitación'}</h1><span>Selecciona una invitación para consultar sus datos y continuar la gestión en el editor.</span></div>{mode === 'guests' ? <Users size={35} /> : <QrCode size={35} />}</div>
    <div className="dashboard-event-history__filters"><label><Search size={16} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar cliente, evento o URL" aria-label="Buscar invitación" /></label><select value={status} onChange={event => setStatus(event.target.value)} aria-label="Estado de la invitación"><option value="all">Todos los estados</option><option value="published">Publicadas</option><option value="draft">Borradores</option><option value="archived">Archivadas</option></select></div>
    <div className="dashboard-event-history__layout"><aside className="dashboard-event-history__events"><div className="dashboard-event-history__count">{events.length} invitaciones · página {safeEventPage} de {totalEventPages}</div>{visibleEvents.map(invitation => <button type="button" key={invitation.id} className={selected?.id === invitation.id ? 'active' : ''} onClick={() => { setSelectedId(invitation.id); setLogPage(1); }}><strong>{invitation.clientName}</strong><span>{invitation.title}</span><small>{new Date(invitation.eventDate).toLocaleDateString('es-MX')} · {invitation.guests.length} pases</small></button>)}{events.length === 0 && <p>No hay invitaciones con estos filtros.</p>}<div className="dashboard-event-history__pages"><button type="button" disabled={safeEventPage <= 1} onClick={() => setEventPage(page => page - 1)} aria-label="Página anterior"><ChevronLeft size={17} /></button><span>{safeEventPage} / {totalEventPages}</span><button type="button" disabled={safeEventPage >= totalEventPages} onClick={() => setEventPage(page => page + 1)} aria-label="Página siguiente"><ChevronRight size={17} /></button></div></aside><section className="dashboard-event-history__detail">{selected ? <><div className="dashboard-event-history__detail-head"><div><p>{selected.clientName}</p><h2>{selected.title}</h2><span>/invitacion/{selected.slug}</span></div><Link href={`/editar/${encodeURIComponent(selected.slug)}?tab=${mode === 'guests' ? 'guests' : 'reception'}`}>{mode === 'guests' ? 'Gestionar invitados' : 'Abrir escáner QR'}</Link></div><div className="dashboard-event-history__metrics"><div><strong>{selected.guests.length}</strong><span>pases</span></div><div><strong>{confirmed}</strong><span>personas confirmadas</span></div><div><strong>{arrived}</strong><span>personas registradas</span></div></div>{mode === 'guests' ? <><div className="dashboard-event-history__filters"><label><Search size={16} /><input value={guestQuery} onChange={event => setGuestQuery(event.target.value)} placeholder="Buscar invitado o mesa" aria-label="Buscar invitado" /></label><select value={guestStatus} onChange={event => setGuestStatus(event.target.value)} aria-label="Filtrar invitados"><option value="all">Todos los pases</option><option value="pending">Pendientes</option><option value="confirmed">Confirmados</option><option value="declined">No asistirán</option><option value="arrived">Registrados</option></select></div><div className="dashboard-event-history__table-wrap"><table><thead><tr><th>Invitado</th><th>Estado</th><th>Confirmados</th><th>Entrada</th><th>Mesa</th></tr></thead><tbody>{visibleGuests.map(guest => <tr key={guest.id}><td><strong>{guest.groupName}</strong><small>{guest.groupTag}</small></td><td>{guest.rsvpStatus === 'confirmed' ? 'Confirmado' : guest.rsvpStatus === 'declined' ? 'No asistirá' : 'Pendiente'}</td><td>{guest.confirmedAdults + guest.confirmedChildren}</td><td>{guest.checkedInCount}</td><td>{guest.tableName || 'Sin asignar'}</td></tr>)}</tbody></table>{guests.length === 0 && <p>No hay pases con estos filtros.</p>}</div><div className="dashboard-event-history__pages"><button type="button" disabled={guestPage <= 1} onClick={() => setGuestPage(page => page - 1)}>Anterior</button><span>{guestPage} / {totalGuestPages} · {guests.length} pases</span><button type="button" disabled={guestPage >= totalGuestPages} onClick={() => setGuestPage(page => page + 1)}>Siguiente</button></div></> : <><h3>Bitácora de entradas</h3>{loadError && <p role="alert">{loadError}</p>}{!checkins && !loadError && <p>Cargando entradas…</p>}{checkins?.logs.length === 0 && <p>Todavía no se han registrado entradas.</p>}<div className="dashboard-event-history__entries">{checkins?.logs.map(log => <article key={log.id}><div><strong>{log.group_name}</strong><span>{log.adults_count} adultos · {log.children_count} niños</span></div><time dateTime={log.created_at}>{new Date(log.created_at).toLocaleString('es-MX')}</time></article>)}</div>{checkins && <div className="dashboard-event-history__pages"><button type="button" disabled={logPage <= 1} onClick={() => setLogPage(page => page - 1)}>Anterior</button><span>{logPage} / {Math.max(1, Math.ceil(checkins.total / checkins.pageSize))} · {checkins.total} entradas</span><button type="button" disabled={logPage * checkins.pageSize >= checkins.total} onClick={() => setLogPage(page => page + 1)}>Siguiente</button></div>}</>}</> : <p>Selecciona una invitación para ver el historial.</p>}</section></div>
  </main>;
}
