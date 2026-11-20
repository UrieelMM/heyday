'use client';

import { useCallback, useEffect, useId, useMemo, useState, type CSSProperties } from 'react';
import { Camera, ChevronDown, Download, Expand, Images } from 'lucide-react';
import { PhotoImage, PhotoViewer } from '@/components/ui/PhotoViewer';
import { AlbumExpirationNotice } from './AlbumExpirationNotice';
import { Pagination } from '@/components/ui/Pagination';
import styles from './event-memories.module.css';

export type AlbumPhoto = { id: string; author: string; url: string; fullUrl: string; downloadUrl?: string; createdAt: string };
const PHOTOS_PER_PAGE = 12;
const photoDate = (value: string) => new Intl.DateTimeFormat('es-MX', { day: 'numeric', month: 'short' }).format(new Date(value));

export function EventPhotoGallery({ photos, eventTitle, expiresAt, purgedAt }: { photos: AlbumPhoto[]; eventTitle: string; expiresAt?: string; purgedAt?: string | null }) {
  const [page, setPage] = useState(1);
  const [order, setOrder] = useState('recent');
  const [activeId, setActiveId] = useState<string | null>(null);
  const gridId = useId();
  const sorted = useMemo(() => [...photos].sort((a, b) => {
    const difference = new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    return order === 'recent' ? difference : -difference;
  }), [photos, order]);
  const currentPage = Math.min(page, Math.max(1, Math.ceil(sorted.length / PHOTOS_PER_PAGE)));
  const offset = (currentPage - 1) * PHOTOS_PER_PAGE;
  const visible = sorted.slice(offset, offset + PHOTOS_PER_PAGE);
  const contributors = new Set(photos.map(photo => photo.author)).size;
  const closeViewer = useCallback(() => setActiveId(null), []);

  return <section className={styles.gallery} aria-label="Galería del álbum compartido">
    <div className={styles.galleryToolbar}>
      <div className={styles.galleryTitle}><Images size={20} aria-hidden="true" /><h3>Álbum compartido</h3><span>{photos.length} {photos.length === 1 ? 'foto' : 'fotos'}</span></div>
      {photos.length > 0 && <label className={styles.sort}><span className="sr-only">Ordenar fotografías</span><select value={order} onChange={event => { setOrder(event.target.value); setPage(1); }}><option value="recent">Más recientes</option><option value="oldest">Más antiguas</option></select><ChevronDown size={15} aria-hidden="true" /></label>}
    </div>
    <AlbumExpirationNotice expiresAt={expiresAt} purgedAt={purgedAt} />
    {photos.length ? <>
      <div className={styles.galleryMeta}><p>{contributors === 1 ? 'Una mirada' : `${contributors} miradas distintas`}, una celebración inolvidable.</p><span aria-live="polite">{offset + 1}–{Math.min(offset + PHOTOS_PER_PAGE, photos.length)} de {photos.length}</span></div>
      <div id={gridId} className={styles.photoGrid} key={`${currentPage}-${order}`}>
        {visible.map((photo, index) => <figure key={photo.id} className={styles.photoCard} style={{ '--photo-delay': `${index * 35}ms` } as CSSProperties}>
          <button type="button" className={styles.photoOpen} onClick={() => setActiveId(photo.id)} aria-label={`Ver foto ${offset + index + 1} de ${photo.author} en pantalla completa`}>
            <PhotoImage src={photo.url} alt={`Foto compartida por ${photo.author}`} />
            <span className={styles.photoShade} />
            <span className={styles.photoExpand}><Expand size={18} aria-hidden="true" /></span>
            <span className={styles.photoCaption}><span className={styles.avatar}>{photo.author.trim().charAt(0).toLocaleUpperCase('es-MX') || '♥'}</span><span><strong>{photo.author}</strong><time dateTime={photo.createdAt}>{photoDate(photo.createdAt)}</time></span></span>
          </button>
          {photo.downloadUrl && <a className={styles.photoDownload} href={photo.downloadUrl} download aria-label={`Descargar foto ${offset + index + 1} de ${photo.author}`}><Download size={17} aria-hidden="true" /></a>}
        </figure>)}
      </div>
      <div className={styles.galleryPagination}><Pagination page={currentPage} pageSize={PHOTOS_PER_PAGE} total={photos.length} onPageChange={setPage} label="Páginas del álbum compartido" controlsId={gridId} /></div>
    </> : <div className={styles.emptyAlbum}><span className={styles.emptyIcon}><Camera size={31} aria-hidden="true" /></span><h4>La primera foto será el comienzo.</h4><p>Cuando tus invitados compartan fotos desde su invitación, aparecerán aquí listas para revivirlas y descargarlas.</p><span>Muchas miradas. Una misma historia.</span></div>}
    {activeId && sorted.some(photo => photo.id === activeId) && <PhotoViewer photos={sorted} activeId={activeId} onSelect={setActiveId} onClose={closeViewer} eventTitle={eventTitle} />}
  </section>;
}
