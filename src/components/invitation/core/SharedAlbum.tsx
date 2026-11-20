'use client';

import { useCallback, useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { Camera, Expand, ImagePlus, LoaderCircle, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';
import { Pagination } from '@/components/ui/Pagination';
import { PhotoImage, PhotoViewer, type ViewerPhoto } from '@/components/ui/PhotoViewer';
import styles from './shared-album.module.css';

type SharedPhoto = ViewerPhoto;
const PHOTOS_PER_PAGE = 6;

export function SharedAlbum({ slug, token, preview = false }: { slug: string; token?: string; preview?: boolean }) {
  const [photos, setPhotos] = useState<SharedPhoto[]>([]);
  const [counts, setCounts] = useState({ ownCount: 0, total: 0 });
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [activeId, setActiveId] = useState<string | null>(null);
  const gridId = useId();
  const inputId = useId();
  const requestId = useRef(0);
  const url = `/api/public/invitations/${encodeURIComponent(slug)}/photos`;
  const canParticipate = Boolean(token) && !preview;
  const currentPage = Math.min(page, Math.max(1, Math.ceil(photos.length / PHOTOS_PER_PAGE)));
  const offset = (currentPage - 1) * PHOTOS_PER_PAGE;
  const closeViewer = useCallback(() => setActiveId(null), []);

  const load = useCallback(async () => {
    if (!token || preview) return;
    const currentRequest = ++requestId.current;
    setLoading(true);
    try {
      const response = await fetch(`${url}?g=${encodeURIComponent(token)}`, { cache: 'no-store' });
      const data = await response.json();
      if (currentRequest !== requestId.current) return;
      if (response.status === 410) { setExpired(true); setPhotos([]); setActiveId(null); }
      if (!response.ok) throw new Error(data.error || 'No se pudo cargar el álbum');
      setPhotos(data.photos); setCounts({ ownCount: data.ownCount, total: data.total }); setExpired(false); setLoaded(true); setError('');
    } catch (error) {
      if (currentRequest === requestId.current) setError(error instanceof Error ? error.message : 'No se pudo cargar el álbum');
    } finally {
      if (currentRequest === requestId.current) setLoading(false);
    }
  }, [url, token, preview]);

  useEffect(() => {
    setPage(1); setPhotos([]); setCounts({ ownCount: 0, total: 0 }); setLoaded(false); setExpired(false); setError(''); setActiveId(null);
    void load();
    return () => { requestId.current++; };
  }, [load]);

  async function upload(files: FileList | null) {
    if (!files?.length || !token || busy || expired) return;
    if (files.length > Math.min(5 - counts.ownCount, 50 - counts.total)) { toast.error('La selección supera el espacio disponible en el álbum'); return; }
    setBusy(true);
    for (const file of Array.from(files)) {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || !file.size || file.size > 8 * 1024 * 1024) { toast.error(`${file.name}: usa JPG, PNG o WebP de hasta 8 MB`); continue; }
      try {
        const form = new FormData(); form.set('token', token); form.set('file', file);
        const response = await fetch(url, { method: 'POST', body: form }); const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'No se pudo subir la foto');
        toast.success(`${file.name} compartida`);
      } catch (error) { toast.error(error instanceof Error ? error.message : 'No se pudo subir'); }
    }
    setPage(1); await load(); setBusy(false);
  }

  return <div className={styles.album}>
    <p className={`shared-album__note ${styles.note}`}>Hasta 5 fotos por pase y 50 en total. JPG, PNG o WebP, máximo 8 MB por foto. Las optimizamos al subirlas para que el álbum cargue rápido.</p>
    {!canParticipate ? <div className={styles.availability}><Camera size={25} aria-hidden="true" /><small className="shared-album__availability">{preview ? 'El álbum estará disponible en la invitación publicada.' : 'Abre tu enlace personal para compartir y ver las fotos.'}</small></div> : <>
      <div className={styles.toolbar}>
        <label htmlFor={inputId} className={styles.upload} data-disabled={busy || !loaded || expired || counts.ownCount >= 5 || counts.total >= 50}>
          {busy ? <LoaderCircle size={18} className={styles.spinning} aria-hidden="true" /> : <ImagePlus size={18} aria-hidden="true" />}
          {busy ? 'Subiendo fotos…' : counts.ownCount >= 5 ? 'Tus 5 fotos están compartidas' : 'Compartir fotos'}
          <input id={inputId} type="file" multiple accept="image/jpeg,image/png,image/webp" disabled={busy || !loaded || expired || counts.ownCount >= 5 || counts.total >= 50} className={styles.fileInput} onChange={event => { void upload(event.target.files); event.target.value = ''; }} />
        </label>
        <button type="button" className={styles.refresh} disabled={loading || busy} onClick={() => void load()} aria-label="Actualizar fotos del álbum"><RefreshCw size={17} className={loading ? styles.spinning : undefined} aria-hidden="true" /></button>
      </div>
      {loaded && !expired && <div className={styles.counts}><span>{counts.ownCount}/5 de tu pase</span><span>{counts.total} {counts.total === 1 ? 'recuerdo compartido' : 'recuerdos compartidos'}</span></div>}
      {error && <p role="alert" className={styles.error}>{error}{!expired && <button type="button" disabled={loading} onClick={() => void load()}>Reintentar</button>}</p>}
      {loading && !loaded ? <div className={styles.skeleton} role="status"><span className="sr-only">Cargando fotos del álbum…</span>{Array.from({ length: 6 }, (_, index) => <span key={index} />)}</div> : photos.length > 0 ? <>
        <div id={gridId} className={styles.grid} key={currentPage}>
          {photos.slice(offset, offset + PHOTOS_PER_PAGE).map((photo, index) => <button type="button" key={photo.id} className={styles.photo} style={{ '--photo-delay': `${index * 40}ms` } as CSSProperties} aria-label={`Ver foto ${offset + index + 1} de ${photo.author} en pantalla completa`} onClick={() => setActiveId(photo.id)}>
            <PhotoImage src={photo.url} alt={`Foto compartida por ${photo.author}`} />
            <span className={styles.shade} /><span className={styles.expand}><Expand size={18} aria-hidden="true" /></span><span className={styles.author}>{photo.author}</span>
          </button>)}
        </div>
        <Pagination page={currentPage} pageSize={PHOTOS_PER_PAGE} total={photos.length} onPageChange={setPage} label="Páginas de fotos compartidas" controlsId={gridId} />
      </> : loaded && !error && <div className={styles.empty}><Camera size={30} aria-hidden="true" /><p>Tu mirada también es parte de esta historia.</p><span>Comparte la primera foto de la celebración.</span></div>}
      {activeId && photos.some(photo => photo.id === activeId) && <PhotoViewer photos={photos} activeId={activeId} onSelect={setActiveId} onClose={closeViewer} eventTitle="Recuerdos de la celebración" inline />}
    </>}
  </div>;
}
