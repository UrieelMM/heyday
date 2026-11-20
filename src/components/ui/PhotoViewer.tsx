'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, ChevronRight, Download, ImageOff, X } from 'lucide-react';
import styles from './photo-viewer.module.css';

export type ViewerPhoto = { id: string; author: string; url: string; fullUrl: string; downloadUrl?: string };

export function PhotoImage({ src, alt, full = false }: { src: string; alt: string; full?: boolean }) {
  const image = useRef<HTMLImageElement>(null);
  const [loadedSource, setLoadedSource] = useState('');
  const [failedSource, setFailedSource] = useState('');
  useEffect(() => { if (image.current?.complete && image.current.naturalWidth > 0) setLoadedSource(src); }, [src]);
  if (failedSource === src) return <span className={styles.imageError} role="status"><ImageOff size={28} aria-hidden="true" /><span>No se pudo cargar la foto.{full && ' Actualiza el álbum e inténtalo de nuevo.'}</span></span>;
  return <img ref={image} src={src} alt={alt} draggable={false} className={full ? styles.fullImage : styles.photoImage} data-loaded={loadedSource === src} loading={full ? 'eager' : 'lazy'} decoding="async" onLoad={() => setLoadedSource(src)} onError={() => setFailedSource(src)} />;
}

export function PhotoViewer({ photos, activeId, onSelect, onClose, eventTitle, inline = false }: { photos: ViewerPhoto[]; activeId: string; onSelect: (id: string) => void; onClose: () => void; eventTitle: string; inline?: boolean }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const activeThumbnail = useRef<HTMLButtonElement>(null);
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const index = photos.findIndex(photo => photo.id === activeId);
  const photo = photos[index];
  const move = useCallback((direction: number) => { const next = photos[index + direction]; if (next) onSelect(next.id); }, [index, onSelect, photos]);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const element = dialog.current;
    element?.showModal();
    return () => { element?.close(); document.body.style.overflow = previousOverflow; previousFocus?.focus({ preventScroll: true }); };
  }, []);
  useEffect(() => { activeThumbnail.current?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'instant' }); }, [activeId]);
  if (!photo) return null;

  const viewer = <dialog ref={dialog} className={`${styles.viewer}${inline ? ` ${styles.inherited}` : ''}`} data-lenis-prevent aria-labelledby={titleId} aria-describedby={descriptionId}
    onCancel={event => { event.preventDefault(); onClose(); }}
    onClick={event => { if (event.target === event.currentTarget) onClose(); }}
    onKeyDown={event => {
      if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
      if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    }}>
    <div className={styles.viewerHeader}>
      <div><span className={styles.viewerEyebrow}>ÁLBUM COMPARTIDO</span><h2 id={titleId}>{eventTitle}</h2></div>
      <div className={styles.viewerActions}>
        {photo.downloadUrl && <a className={styles.viewerDownload} href={photo.downloadUrl} download aria-label={`Descargar foto de ${photo.author}`}><Download size={18} aria-hidden="true" /><span>Descargar foto</span></a>}
        <button type="button" onClick={onClose} className={styles.viewerClose} aria-label="Cerrar visor"><X size={22} aria-hidden="true" /></button>
      </div>
    </div>
    <div className={styles.viewerStage}
      onClick={event => { if (event.target === event.currentTarget) onClose(); }}
      onPointerDown={event => { if (event.pointerType === 'touch') touchStart.current = { x: event.clientX, y: event.clientY }; }}
      onPointerCancel={() => { touchStart.current = null; }}
      onPointerUp={event => {
        if (!touchStart.current) return;
        const dx = event.clientX - touchStart.current.x;
        const dy = event.clientY - touchStart.current.y;
        if (Math.abs(dx) > 55 && Math.abs(dx) > Math.abs(dy)) move(dx < 0 ? 1 : -1);
        touchStart.current = null;
      }}>
      <button type="button" className={`${styles.viewerNav} ${styles.viewerPrevious}`} disabled={index === 0} onClick={() => move(-1)} aria-label="Foto anterior"><ChevronLeft size={25} aria-hidden="true" /></button>
      <div key={photo.id} className={styles.viewerImageFrame}><PhotoImage src={photo.fullUrl} alt={`Foto compartida por ${photo.author}`} full /></div>
      <button type="button" className={`${styles.viewerNav} ${styles.viewerNext}`} disabled={index === photos.length - 1} onClick={() => move(1)} aria-label="Foto siguiente"><ChevronRight size={25} aria-hidden="true" /></button>
    </div>
    <div className={styles.viewerFooter}>
      <div className={styles.viewerCaption} id={descriptionId} aria-live="polite"><span>Una mirada de <strong>{photo.author}</strong></span><span>{index + 1} / {photos.length}</span></div>
      <div className={styles.filmstrip} aria-label="Elegir foto">{photos.map((item, itemIndex) => <button key={item.id} ref={item.id === activeId ? activeThumbnail : undefined} type="button" aria-label={`Ver foto ${itemIndex + 1} de ${item.author}`} aria-current={item.id === activeId ? 'true' : undefined} onClick={() => onSelect(item.id)}><img src={item.url} alt="" loading="lazy" /></button>)}</div>
      <p className={styles.viewerHint}>Desliza o usa las teclas de dirección para explorar · Esc para cerrar</p>
    </div>
  </dialog>;
  return inline ? viewer : createPortal(viewer, document.body);
}
