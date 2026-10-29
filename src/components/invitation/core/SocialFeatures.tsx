'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
type Song = { id: string; track_title: string; artist_name: string; suggested_by_name: string; votes_count: number };
export function SocialFeatures({ slug, token, preview, songsEnabled, audioEnabled }: { slug: string; token?: string; preview?: boolean; songsEnabled: boolean; audioEnabled: boolean }) {
  const [songs, setSongs] = useState<Song[]>([]); const [voted, setVoted] = useState<string[]>([]); const [title, setTitle] = useState(''); const [artist, setArtist] = useState('');
  const [busy, setBusy] = useState(false); const [recording, setRecording] = useState(false); const [clip, setClip] = useState<Blob | null>(null); const [clipUrl, setClipUrl] = useState(''); const [error, setError] = useState('');
  const recorder = useRef<MediaRecorder | null>(null); const stream = useRef<MediaStream | null>(null); const timeout = useRef<ReturnType<typeof setTimeout> | null>(null); const alive = useRef(true);
  const url = `/api/public/invitations/${encodeURIComponent(slug)}/social`;
  const load = useCallback(async () => { if (!token || preview || !songsEnabled) return; try { const res = await fetch(`${url}?g=${encodeURIComponent(token)}`, { cache: 'no-store' }); const data = await res.json(); if (!res.ok) throw new Error(data.error); setSongs(data.songs); setVoted(data.voted); setError(''); } catch (e) { setError(e instanceof Error ? e.message : 'No se pudo cargar'); } }, [token, preview, songsEnabled, url]);
  useEffect(() => { void load(); }, [load]);
  useEffect(() => { alive.current = true; return () => { alive.current = false; if (timeout.current) clearTimeout(timeout.current); if (recorder.current?.state === 'recording') recorder.current.stop(); stream.current?.getTracks().forEach(t => t.stop()); }; }, []);
  useEffect(() => { if (!clip) { setClipUrl(''); return; } const objectUrl = URL.createObjectURL(clip); setClipUrl(objectUrl); return () => URL.revokeObjectURL(objectUrl); }, [clip]);
  async function send(action: string, fields: Record<string, string | Blob>) {
    if (!token || preview) { toast.error('Abre tu enlace personal para participar'); return false; }
    setBusy(true);
    try { const form = new FormData(); form.set('token', token); form.set('action', action); for (const [key, value] of Object.entries(fields)) form.set(key, value); const res = await fetch(url, { method: 'POST', body: form }); const data = await res.json(); if (!res.ok) throw new Error(data.error); toast.success(action === 'audio' ? 'Mensaje de voz enviado' : action === 'vote' ? 'Voto registrado' : 'Canción sugerida'); await load(); return true; }
    catch (e) { toast.error(e instanceof Error ? e.message : 'No se pudo guardar'); return false; } finally { setBusy(false); }
  }
  async function startRecording() {
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') throw new Error('Tu navegador no permite grabar audio');
      const mime = ['audio/webm;codecs=opus', 'audio/mp4'].find(t => MediaRecorder.isTypeSupported(t));
      if (!mime) throw new Error('Tu navegador no admite un formato de audio compatible');
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      const media = new MediaRecorder(stream.current, { mimeType: mime, audioBitsPerSecond: 64000 }); const chunks: Blob[] = []; recorder.current = media;
      media.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
      media.onstop = () => { stream.current?.getTracks().forEach(t => t.stop()); stream.current = null; if (!alive.current) return; const result = new Blob(chunks, { type: mime.split(';')[0] }); if (result.size > 2 * 1024 * 1024) toast.error('El audio supera 2 MB'); else setClip(result); setRecording(false); };
      setClip(null); media.start(); setRecording(true); timeout.current = setTimeout(() => { if (media.state === 'recording') media.stop(); }, 45000);
    } catch (e) { stream.current?.getTracks().forEach(t => t.stop()); toast.error(e instanceof Error ? e.message : 'No se pudo acceder al micrófono'); }
  }
  function stopRecording() { if (timeout.current) clearTimeout(timeout.current); if (recorder.current?.state === 'recording') recorder.current.stop(); }
  if (!songsEnabled && !audioEnabled) return null;
  return <div className="space-y-6 text-sm" aria-live="polite">
    {!token || preview ? <p>Abre tu enlace personal para compartir canciones o mensajes de voz.</p> : null}
    {songsEnabled && <div className="space-y-3"><h3 className="text-lg font-semibold">Sugiere una canción</h3><form className="flex flex-wrap gap-2" onSubmit={async e => { e.preventDefault(); if (await send('song', { title, artist })) { setTitle(''); setArtist(''); } }}><input aria-label="Canción" maxLength={120} required value={title} onChange={e => setTitle(e.target.value)} placeholder="Canción" className="min-w-0 flex-1 rounded border border-current bg-transparent p-2"/><input aria-label="Artista" maxLength={120} value={artist} onChange={e => setArtist(e.target.value)} placeholder="Artista" className="min-w-0 flex-1 rounded border border-current bg-transparent p-2"/><button disabled={busy || !token || preview} className="rounded border border-current px-3 py-2 disabled:opacity-50">Sugerir</button></form>{error && <p role="alert">{error} <button type="button" onClick={() => void load()}>Reintentar</button></p>}<ul className="space-y-2">{songs.map(song => <li key={song.id} className="flex items-center justify-between gap-2 border-b border-current/20 py-2"><span><strong>{song.track_title}</strong> · {song.artist_name}<small className="block opacity-70">Sugerida por {song.suggested_by_name}</small></span><button type="button" disabled={busy || voted.includes(song.id)} onClick={() => void send('vote', { songId: song.id })} className="rounded border border-current px-3 py-1 disabled:opacity-50" aria-label={`Votar por ${song.track_title}`}>♥ {song.votes_count}</button></li>)}</ul></div>}
    {audioEnabled && <div className="space-y-3"><h3 className="text-lg font-semibold">Deja un mensaje de voz</h3><p>Graba hasta 45 segundos. Cada pase puede enviar tres mensajes.</p><button type="button" disabled={busy || !token || preview} onClick={recording ? stopRecording : () => void startRecording()} className="rounded border border-current px-4 py-2 disabled:opacity-50">{recording ? 'Detener grabación' : 'Grabar mensaje'}</button>{recording && <span role="status"> Grabando…</span>}{clipUrl && <div className="space-y-2"><audio controls src={clipUrl} className="max-w-full"/><div className="flex gap-2"><button type="button" disabled={busy} onClick={async () => { if (clip && await send('audio', { file: clip })) setClip(null); }} className="rounded border border-current px-4 py-2">{busy ? 'Enviando…' : 'Enviar mensaje'}</button><button type="button" disabled={busy} onClick={() => setClip(null)}>Descartar</button></div></div>}</div>}
  </div>;
}
