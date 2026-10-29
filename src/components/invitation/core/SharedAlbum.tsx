'use client';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
export function SharedAlbum({ slug, token, preview = false }: { slug: string; token?: string; preview?: boolean }) {
  const [photos, setPhotos] = useState<{ id: string; url: string; fullUrl: string }[]>([]);
  const [counts, setCounts] = useState({ ownCount: 0, total: 0 });
  const [busy, setBusy] = useState(false); const [error, setError] = useState('');
  const url = `/api/public/invitations/${encodeURIComponent(slug)}/photos`;
  const load = useCallback(async () => {
    if (!token || preview) return;
    try { const response = await fetch(`${url}?g=${encodeURIComponent(token)}`, { cache: 'no-store' }); const data = await response.json(); if (!response.ok) throw new Error(data.error); setPhotos(data.photos); setCounts({ ownCount: data.ownCount, total: data.total }); setError(''); } catch (err) { setError(err instanceof Error ? err.message : 'No se pudo cargar el álbum'); }
  }, [url, token, preview]);
  useEffect(() => { void load(); }, [load]);
  async function upload(files: FileList | null) {
    if (!files || !token) return;
    if (files.length > Math.min(5 - counts.ownCount, 50 - counts.total)) { toast.error('La selección supera el espacio disponible en el álbum'); return; }
    setBusy(true);
    for (const file of Array.from(files)) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || !file.size || file.size > 8 * 1024 * 1024) { toast.error(`${file.name}: usa JPG, PNG o WebP de hasta 8 MB`); continue; }
      try { const form = new FormData(); form.set('token', token); form.set('file', file); const response = await fetch(url, { method: 'POST', body: form }); const result = await response.json(); if (!response.ok) throw new Error(result.error); toast.success(`${file.name} compartida`); } catch (err) { toast.error(err instanceof Error ? err.message : 'No se pudo subir'); }
    }
    await load(); setBusy(false);
  }
  return <div aria-live="polite"><p>Hasta 5 fotos por pase y 50 en total. JPG, PNG o WebP, máximo 8 MB por foto. Las optimizamos al subirlas para que el álbum cargue rápido.</p>{preview ? <small>El álbum estará disponible en la invitación publicada.</small> : !token ? <small>Abre tu enlace personal para compartir y ver las fotos.</small> : <><p>{counts.ownCount}/5 de tu pase · {counts.total}/50 en el álbum</p><label style={{ display: 'inline-block', cursor: busy ? 'wait' : 'pointer', padding: '10px', border: '1px solid currentColor' }}>{busy ? 'Subiendo fotos…' : 'Elegir fotos'}<input type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={busy || counts.ownCount >= 5 || counts.total >= 50} style={{ display: 'none' }} onChange={e => { void upload(e.target.files); e.target.value = ''; }} /></label>{error && <p role="alert">{error} <button type="button" onClick={() => void load()}>Reintentar</button></p>}<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(110px,1fr))', gap: 8, marginTop: 16 }}>{photos.map(p => <a key={p.id} href={p.fullUrl} target="_blank" rel="noreferrer" aria-label="Abrir foto en tamaño completo"><img src={p.url} alt="Foto compartida" loading="lazy" style={{ width: '100%', aspectRatio: '1', objectFit: 'cover' }} /></a>)}</div></>}</div>;
}
