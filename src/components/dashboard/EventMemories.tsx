'use client';

import { useEffect, useId, useState } from 'react';
import { Heart, Mic, Music2, RefreshCw } from 'lucide-react';
import { EventPhotoGallery, type AlbumPhoto } from './EventPhotoGallery';
import { Pagination } from '@/components/ui/Pagination';
import styles from './event-memories.module.css';

type Memory = AlbumPhoto & { type: string };
type Song = { id: string; track_title: string; artist_name: string; suggested_by_name: string; votes_count: number };

export function EventMemories({ slug, eventTitle }: { slug: string; eventTitle: string }) {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [songs, setSongs] = useState<Song[]>([]);
  const [album, setAlbum] = useState<{ expiresAt: string; purgedAt: string | null } | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [songPage, setSongPage] = useState(1);
  const songListId = useId();

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    async function load() {
      try {
        const response = await fetch(`/api/editor/${encodeURIComponent(slug)}/memories`, { cache: 'no-store', signal: controller.signal });
        const data = await response.json();
        if (!response.ok) throw new Error(data.error || 'No se pudieron cargar los recuerdos');
        setMemories(data.memories); setSongs(data.songs); setAlbum(data.album); setError(''); setLoaded(true);
      } catch (error) {
        if (!controller.signal.aborted) setError(error instanceof Error ? error.message : 'No se pudieron cargar los recuerdos');
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }
    void load();
    return () => controller.abort();
  }, [slug, refresh]);

  const photos = memories.filter(memory => memory.type === 'photo');
  const audio = memories.filter(memory => memory.type === 'audio_message');
  const currentSongPage = Math.min(songPage, Math.max(1, Math.ceil(songs.length / 6)));

  return <section className={styles.memories} aria-label="Recuerdos de tu celebración">
    <header className={styles.heading}>
      <div><p className={styles.eyebrow}>TU CELEBRACIÓN, DESDE SUS OJOS</p><h2>Momentos que <em>se quedan.</em></h2><p className={styles.description}>Todas las miradas de <strong>{eventTitle}</strong>, reunidas en un solo lugar.</p></div>
      <button type="button" className={styles.refresh} disabled={loading} onClick={() => setRefresh(value => value + 1)}><RefreshCw size={17} className={loading ? styles.spinning : undefined} aria-hidden="true" />{loading ? 'Actualizando…' : 'Actualizar álbum'}</button>
    </header>
    {error && <div className={styles.error} role="alert"><p>{error}</p><button type="button" disabled={loading} onClick={() => setRefresh(value => value + 1)}>Reintentar</button></div>}
    {!loaded && loading ? <div className={styles.skeleton} role="status"><span className="sr-only">Cargando álbum compartido…</span>{Array.from({ length: 8 }, (_, index) => <div key={index} />)}</div> : loaded && <>
      <EventPhotoGallery photos={photos} eventTitle={eventTitle} expiresAt={album?.expiresAt} purgedAt={album?.purgedAt} />
      <div className={styles.extras}>
        <section className={styles.extraCard} aria-labelledby={`${songListId}-title`}>
          <div className={styles.extraHeading}><span className={styles.extraIcon}><Music2 size={20} aria-hidden="true" /></span><div><h3 id={`${songListId}-title`}>La playlist de tu celebración</h3><p>{songs.length} {songs.length === 1 ? 'canción sugerida' : 'canciones sugeridas'}</p></div></div>
          {songs.length ? <><ul id={songListId} className={styles.songList}>{songs.slice((currentSongPage - 1) * 6, currentSongPage * 6).map(song => <li key={song.id}><div><strong>{song.track_title}</strong><span>{song.artist_name} · {song.suggested_by_name}</span></div><span className={styles.votes}><Heart size={14} aria-hidden="true" />{song.votes_count}<span className="sr-only"> votos</span></span></li>)}</ul><Pagination page={currentSongPage} pageSize={6} total={songs.length} onPageChange={setSongPage} label="Páginas de la playlist" controlsId={songListId} /></> : <p className={styles.extraEmpty}>Las canciones que sugieran tus invitados aparecerán aquí. Que empiece la música.</p>}
        </section>
        <section className={styles.extraCard} aria-label="Mensajes de voz">
          <div className={styles.extraHeading}><span className={styles.extraIcon}><Mic size={20} aria-hidden="true" /></span><div><h3>Palabras para recordar</h3><p>{audio.length} {audio.length === 1 ? 'mensaje de voz' : 'mensajes de voz'}</p></div></div>
          {audio.length ? <div className={styles.audioList}>{audio.map(memory => <div key={memory.id}><p>{memory.author}</p><audio controls preload="none" src={memory.fullUrl || memory.url} aria-label={`Mensaje de voz de ${memory.author}`} /></div>)}</div> : <p className={styles.extraEmpty}>Hay palabras que merecen escucharse otra vez. Aquí encontrarás los mensajes de tus invitados.</p>}
        </section>
      </div>
    </>}
  </section>;
}
