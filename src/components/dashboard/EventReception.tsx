'use client';
import { useEffect, useRef, useState } from 'react';
import type { Html5Qrcode } from 'html5-qrcode';
import { toast } from 'sonner';
export function EventReception({ eventId, onCheckedIn }: { eventId: string; onCheckedIn: () => Promise<void> }) {
  const scanner = useRef<Html5Qrcode | null>(null); const scanning = useRef(false); const processing = useRef(false); const mounted = useRef(true); const [active, setActive] = useState(false); const [busy, setBusy] = useState(false); const [manual, setManual] = useState(''); const [result, setResult] = useState('');
  async function stop() { const current = scanner.current; if (current && scanning.current) { scanning.current = false; try { await current.stop(); } catch {} } setActive(false); }
  useEffect(() => { mounted.current = true; return () => { mounted.current = false; const current = scanner.current; if (current && scanning.current) { scanning.current = false; void current.stop().catch(() => {}); } }; }, []);
  async function check(payload: string) {
    if (processing.current) return; processing.current = true; setBusy(true); await stop();
    try { const res = await fetch(`/api/admin/invitations/${encodeURIComponent(eventId)}/checkin`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ payload: payload.trim() }) }); const data = await res.json(); if (!res.ok) throw new Error(data.error); setResult(`${data.result.group_name}: ${data.result.checked_in} personas registradas · ${data.result.table_name || 'Mesa por asignar'}`); setManual(''); await onCheckedIn(); toast.success('Entrada registrada'); }
    catch (e) { const message = e instanceof Error ? e.message : 'No se pudo validar'; setResult(message); toast.error(message); } finally { processing.current = false; setBusy(false); }
  }
  async function start() {
    setBusy(true);
    try { setResult(''); const { Html5Qrcode } = await import('html5-qrcode'); const instance = scanner.current || new Html5Qrcode('heyday-qr-reader'); scanner.current = instance; await instance.start({ facingMode: 'environment' }, { fps: 10, qrbox: { width: 240, height: 240 } }, text => { void check(text); }, () => {}); scanning.current = true; if (!mounted.current) { scanning.current = false; await instance.stop(); return; } setActive(true); }
    catch { if (mounted.current) toast.error('No se pudo abrir la cámara. Revisa los permisos o introduce el código manualmente.'); } finally { if (mounted.current) setBusy(false); }
  }
  return <div className="mt-6 space-y-4 text-left"><div id="heyday-qr-reader" className="mx-auto max-w-sm overflow-hidden rounded-xl" /><div className="flex flex-wrap gap-3"><button type="button" disabled={busy} onClick={() => active ? void stop() : void start()} className="rounded-xl bg-[#cc785c] px-4 py-2 text-sm font-semibold text-white disabled:opacity-50">{active ? 'Cerrar cámara' : 'Abrir cámara para escanear'}</button></div><form className="flex gap-2" onSubmit={e => { e.preventDefault(); void check(manual); }}><input value={manual} onChange={e => setManual(e.target.value)} required placeholder="Pegar código del pase" aria-label="Código del pase" className="min-w-0 flex-1 rounded-xl border border-[#d7cfc4] px-3 py-2 text-sm"/><button disabled={busy} className="rounded-xl border border-[#d7cfc4] px-4 py-2 text-sm disabled:opacity-50">{busy ? 'Validando…' : 'Validar'}</button></form>{result && <p role="status" className="rounded-xl bg-[#faf9f5] p-3 text-sm">{result}</p>}</div>;
}
