'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Html5Qrcode } from 'html5-qrcode';
import { Camera, CameraOff, CheckCircle2, QrCode, RefreshCw } from 'lucide-react';

type Guest = { id: string; group_name: string; confirmed_adults: number; confirmed_children: number; checked_in_count: number };
type Entry = { id: string; group_name: string; adults_count: number; children_count: number; created_at: string };
type History = { guests: Guest[]; logs: Entry[]; total: number; pageSize: number };

export function EventReception({ slug }: { slug: string }) {
  const endpoint = `/api/editor/${encodeURIComponent(slug)}/checkins`;
  const scanner = useRef<Html5Qrcode | null>(null);
  const scanning = useRef(false);
  const processing = useRef(false);
  const mounted = useRef(true);
  const [active, setActive] = useState(false);
  const [busy, setBusy] = useState(false);
  const [manual, setManual] = useState('');
  const [notice, setNotice] = useState<{ ok: boolean; text: string } | null>(null);
  const [history, setHistory] = useState<History | null>(null);
  const [page, setPage] = useState(1);
  const [loadError, setLoadError] = useState('');

  const load = useCallback(async (targetPage = page) => {
    try {
      const response = await fetch(`${endpoint}?page=${targetPage}`, { cache: 'no-store' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo cargar la recepción');
      if (mounted.current) { setHistory(data); setLoadError(''); }
    } catch (error) {
      if (mounted.current) setLoadError(error instanceof Error ? error.message : 'No se pudo cargar la recepción');
    }
  }, [endpoint, page]);

  useEffect(() => { void load(); }, [load]);
  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
      if (scanning.current && scanner.current) { scanning.current = false; void scanner.current.stop().catch(() => {}); }
    };
  }, []);

  async function stop() {
    if (scanning.current && scanner.current) {
      scanning.current = false;
      try { await scanner.current.stop(); } catch { /* La cámara ya pudo cerrarse. */ }
    }
    if (mounted.current) setActive(false);
  }

  async function register(payload: string) {
    if (processing.current) return;
    processing.current = true;
    setBusy(true);
    await stop();
    try {
      const response = await fetch(endpoint, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ payload: payload.trim() }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'No se pudo registrar la entrada');
      if (mounted.current) {
        setNotice({ ok: true, text: `${data.result.group_name} · ${data.result.checked_in} personas registradas${data.result.table_name ? ` · ${data.result.table_name}` : ''}` });
        setManual(''); setPage(1); await load(1);
      }
    } catch (error) {
      if (mounted.current) setNotice({ ok: false, text: error instanceof Error ? error.message : 'No se pudo validar el pase' });
    } finally {
      processing.current = false;
      if (mounted.current) setBusy(false);
    }
  }

  async function start() {
    if (busy || active) return;
    setBusy(true); setNotice(null);
    try {
      const { Html5Qrcode } = await import('html5-qrcode');
      if (!mounted.current) return;
      const instance = scanner.current || new Html5Qrcode('heyday-qr-reader');
      scanner.current = instance;
      await instance.start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 240, height: 240 } }, value => { void register(value); }, () => {});
      scanning.current = true;
      if (processing.current) { await stop(); return; }
      if (mounted.current) setActive(true);
      else { scanning.current = false; await instance.stop(); }
    } catch {
      if (mounted.current) setNotice({ ok: false, text: 'No se pudo abrir la cámara. Revisa el permiso o introduce el código manualmente.' });
    } finally { if (mounted.current) setBusy(false); }
  }

  const confirmed = history?.guests.reduce((sum, guest) => sum + guest.confirmed_adults + guest.confirmed_children, 0) || 0;
  const arrived = history?.guests.reduce((sum, guest) => sum + guest.checked_in_count, 0) || 0;

  return <div className="editor-reception">
    <div className="editor-reception-heading"><div><p className="editor-eyebrow">Control de acceso</p><h2>Recepción QR</h2><p>Escanea el pase de cada familia. Una segunda lectura se rechaza automáticamente.</p></div><QrCode size={31} aria-hidden="true" /></div>
    <div className="editor-reception-stats"><div><strong>{arrived}</strong><span>personas registradas</span></div><div><strong>{confirmed}</strong><span>personas confirmadas</span></div><div><strong>{history?.total || 0}</strong><span>pases ingresados</span></div></div>
    <div className="editor-reception-grid"><section className="editor-reception-scanner"><h3>Escanear pase</h3><p>Usa la cámara trasera del teléfono o escribe el código del pase.</p><div id="heyday-qr-reader" className="editor-reception-camera" /><button type="button" className="editor-reception-primary" disabled={busy} onClick={() => active ? void stop() : void start()}>{active ? <CameraOff size={17} /> : <Camera size={17} />}{active ? 'Cerrar cámara' : busy ? 'Procesando…' : 'Abrir cámara'}</button><form onSubmit={event => { event.preventDefault(); void register(manual); }}><label htmlFor="qr-manual">Código manual</label><div><input id="qr-manual" value={manual} onChange={event => setManual(event.target.value)} placeholder="Pega el código del pase" required autoComplete="off" /><button type="submit" disabled={busy}>Registrar</button></div></form>{notice && <p className={`editor-reception-notice${notice.ok ? ' is-success' : ' is-error'}`} role="status">{notice.ok && <CheckCircle2 size={19} />}{notice.text}</p>}</section><section className="editor-reception-log"><div className="editor-reception-log-heading"><h3>Entradas registradas</h3><button type="button" onClick={() => void load()} aria-label="Actualizar entradas"><RefreshCw size={17} /></button></div>{loadError && <p role="alert">{loadError}</p>}{!loadError && history?.logs.length === 0 && <p>Aún no hay entradas registradas.</p>}{history?.logs.map(entry => <article key={entry.id}><div><strong>{entry.group_name}</strong><span>{entry.adults_count} adultos · {entry.children_count} niños</span></div><time dateTime={entry.created_at}>{new Date(entry.created_at).toLocaleString('es-MX')}</time></article>)}{history && history.total > history.pageSize && <div className="editor-reception-pages"><button type="button" disabled={page <= 1} onClick={() => setPage(value => value - 1)}>Anterior</button><span>{page} de {Math.ceil(history.total / history.pageSize)}</span><button type="button" disabled={page * history.pageSize >= history.total} onClick={() => setPage(value => value + 1)}>Siguiente</button></div>}</section></div>
  </div>;
}
