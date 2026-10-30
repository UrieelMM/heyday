'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { ArrowLeft, Copy, ExternalLink, ImagePlus, Link2, LockKeyhole, Monitor, MousePointer2, Plus, QrCode, Save, Smartphone, Tablet, Trash2, Users, WandSparkles } from 'lucide-react';
import type { InvitationConfig, SectionId, TemplateId } from '@/types/invitation.types';
import { INVITATION_FONTS, invitationFontStack } from '@/lib/fonts/invitation-fonts';
import { buildWhatsappInviteUrl } from '@/lib/whatsapp/link-builder';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { GuestPassPreview } from './GuestPassPreview';
import { EventReception } from '@/components/dashboard/EventReception';
import './editor.css';

type EditorEvent = { id: string; slug: string; title: string; clientName: string; templateId: TemplateId; eventDate: string; status: string; config: InvitationConfig; updatedAt: string };
type EditorGuest = { id: string; guest_token: string; group_name: string; whatsapp_phone: string | null; email: string | null; group_tag: string | null; allocated_adults: number; allocated_children: number; rsvp_status: string; confirmed_adults: number; confirmed_children: number; table_name_fallback: string | null; checked_in_count: number };
type GuestForm = { groupName: string; whatsappPhone: string; email: string; groupTag: string; allocatedAdults: number; allocatedChildren: number; tableName: string };
const blankGuest: GuestForm = { groupName: '', whatsappPhone: '', email: '', groupTag: '', allocatedAdults: 2, allocatedChildren: 0, tableName: '' };

const groups = [
  { id: 'theme', label: 'Colores y estilo', path: ['theme'] },
  { id: 'envelope', label: 'Sobre', path: ['theme', 'envelope'] },
  { id: 'audio', label: 'Música', path: ['audio'] },
  { id: 'hero', label: 'Portada', path: ['content', 'hero'] },
  { id: 'quoteStory', label: 'Historia', path: ['content', 'quoteStory'] },
  { id: 'vipParents', label: 'Familia y padrinos', path: ['content', 'vipParents'] },
  { id: 'countdown', label: 'Cuenta regresiva', path: ['content', 'sectionHeadings', 'countdown'] },
  { id: 'locations', label: 'Lugares', path: ['content', 'locations'] },
  { id: 'timeline', label: 'Programa', path: ['content', 'timeline'] },
  { id: 'gallery', label: 'Fotos', path: ['content', 'gallery'] },
  { id: 'dressCode', label: 'Vestimenta', path: ['content', 'dressCode'] },
  { id: 'gifts', label: 'Regalos', path: ['content', 'gifts'] },
  { id: 'accommodation', label: 'Hospedaje', path: ['content', 'accommodation'] },
  { id: 'socialFeatures', label: 'Funciones sociales', path: ['content', 'socialFeatures'] },
  { id: 'rsvp', label: 'Confirmación', path: ['content', 'rsvp'] },
  { id: 'sections', label: 'Mostrar secciones', path: ['sectionsOrder'] },
] as const;

const labels: Record<string, string> = {
  colors: 'Paleta de colores', fonts: 'Tipografías', envelope: 'Sobre', ambientEffect: 'Efecto ambiental',
  bgPrimary: 'Fondo principal', bgSecondary: 'Fondo secundario', textPrimary: 'Texto principal', textMuted: 'Texto secundario', accentPrimary: 'Acento principal', accentSecondary: 'Acento secundario',
  headingFont: 'Fuente de títulos', scriptFont: 'Fuente decorativa', bodyFont: 'Fuente del texto', variant: 'Diseño del sobre', sealMonogram: 'Monograma', sealColor: 'Color del sello', openButtonText: 'Texto del botón para abrir',
  enabled: 'Activado', trackUrl: 'Pista de audio', trackTitle: 'Título de la canción', startSecond: 'Iniciar en el segundo', autoplayOnEnvelopeOpen: 'Reproducir al abrir',
  badgeText: 'Etiqueta superior', mainTitle: 'Título principal', tagline: 'Subtítulo', coverImageUrl: 'Foto de portada', coverVideoUrl: 'Video de portada', focalPoint: 'Posición de la portada', x: 'Horizontal (%)', y: 'Vertical (%)',
  quoteText: 'Frase principal', quoteAuthor: 'Autor de la frase', storyBlocks: 'Momentos de la historia', description: 'Descripción',
  blessingMessage: 'Mensaje de bendición', groups: 'Familia y padrinos', groupTitle: 'Nombre del grupo', names: 'Nombres',
  type: 'Tipo de lugar', title: 'Título', venueName: 'Nombre del lugar', time: 'Hora', address: 'Dirección', imageUrl: 'Foto del lugar', coordinates: 'Coordenadas', lat: 'Latitud', lng: 'Longitud', googleMapsUrl: 'Enlace de Google Maps', wazeUrl: 'Enlace de Waze',
  icon: 'Ícono', layout: 'Diseño de galería', images: 'Fotos', url: 'Enlace', caption: 'Descripción de foto', aspectRatio: 'Proporción',
  womenNotes: 'Indicaciones para mujeres', menNotes: 'Indicaciones para hombres', reservedColors: 'Colores reservados', name: 'Nombre', hex: 'Color', reservedNote: 'Nota sobre colores', pinterestBoardUrl: 'Tablero de inspiración',
  introMessage: 'Mensaje de regalos', registries: 'Mesas de regalos', storeName: 'Tienda', eventNumber: 'Número de evento', bankTransfer: 'Transferencia bancaria', bankName: 'Banco', accountHolder: 'Titular', clabe: 'CLABE', accountNumber: 'Número de cuenta', conceptNote: 'Concepto', cashEnvelopeAtVenue: 'Sobre de efectivo en el evento',
  hotelName: 'Hotel', distanceNote: 'Distancia', discountCode: 'Código de descuento', bookingUrl: 'Enlace de reserva', phone: 'Teléfono',
  enableSongRequests: 'Sugerencias musicales', enableAudioGuestbook: 'Mensajes de voz', enableLiveDisposableCamera: 'Cámara compartida', hashtag: 'Hashtag',
  askDietaryRestrictions: 'Preguntar por restricciones alimentarias', allowChildrenSelection: 'Permitir niños', customConfirmationMessage: 'Mensaje al confirmar', plannerContactWhatsapp: 'WhatsApp de contacto',
};
const sectionLabels: Record<string, string> = { hero: 'Portada', quote_story: 'Historia', vip_parents: 'Familia y padrinos', countdown: 'Cuenta regresiva', locations: 'Lugares', timeline: 'Programa', gallery: 'Galería', dress_code: 'Vestimenta', gifts: 'Regalos', accommodation: 'Hospedaje', social_features: 'Funciones sociales', rsvp: 'Confirmación' };
const headingSections: Partial<Record<string, SectionId>> = { quoteStory: 'quote_story', vipParents: 'vip_parents', countdown: 'countdown', locations: 'locations', timeline: 'timeline', gallery: 'gallery', dressCode: 'dress_code', gifts: 'gifts', accommodation: 'accommodation', socialFeatures: 'social_features', rsvp: 'rsvp' };
const selects: Record<string, string[]> = {
  'theme.envelope.variant': ['wax-seal-classic', 'editorial-curtain', 'pass-ticket-tear'],
  'theme.ambientEffect': ['none', 'gold-sparkles', 'white-petals', 'soft-stars', 'confetti'],
  'content.gallery.layout': ['bento-grid', 'polaroid-scatter', 'cinema-slider'],
  'content.timeline.icon': ['church', 'rings', 'cocktail', 'dinner', 'waltz', 'party', 'cake', 'car'],
  'content.locations.type': ['religious_ceremony', 'civil_ceremony', 'reception', 'after_party'],
};
const selectLabels: Record<string, string> = {
  'wax-seal-classic': 'Sello de lacre clásico',
  'editorial-curtain': 'Cortina editorial',
  'pass-ticket-tear': 'Pase de entrada',
};

function getAtPath(value: unknown, path: Array<string | number>): unknown {
  return path.reduce<unknown>((current, part) => (current as Record<string | number, unknown>)?.[part], value);
}
function setAtPath(config: InvitationConfig, path: Array<string | number>, value: unknown): InvitationConfig {
  const next = structuredClone(config);
  let target: Record<string | number, unknown> = next as unknown as Record<string | number, unknown>;
  for (const part of path.slice(0, -1)) target = target[part] as Record<string | number, unknown>;
  target[path[path.length - 1]] = value;
  return next;
}
function arrayItem(path: Array<string | number>): unknown {
  const key = path.filter(part => typeof part === 'string').join('.');
  if (key.endsWith('storyBlocks')) return { title: '', description: '', imageUrl: '' };
  if (key.endsWith('groups')) return { groupTitle: '', names: [''] };
  if (key.endsWith('names')) return '';
  if (key.endsWith('locations')) return { id: crypto.randomUUID(), type: 'reception', title: '', venueName: '', time: '', address: '', imageUrl: '', coordinates: { lat: 0, lng: 0 }, googleMapsUrl: '', wazeUrl: '' };
  if (key.endsWith('timeline')) return { id: crypto.randomUUID(), time: '', title: '', description: '', icon: 'party' };
  if (key.endsWith('reservedColors')) return { name: '', hex: '#ffffff' };
  if (key.endsWith('registries')) return { storeName: '', eventNumber: '', url: '' };
  if (key.endsWith('accommodation')) return { hotelName: '', distanceNote: '', discountCode: '', bookingUrl: '', phone: '' };
  return '';
}
function localDateTime(iso: string) {
  const parts = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Mexico_City', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).formatToParts(new Date(iso));
  const get = (type: string) => parts.find(part => part.type === type)?.value || '';
  return `${get('year')}-${get('month')}-${get('day')}T${get('hour')}:${get('minute')}`;
}
function guestForm(guest: EditorGuest): GuestForm {
  return { groupName: guest.group_name, whatsappPhone: guest.whatsapp_phone || '', email: guest.email || '', groupTag: guest.group_tag || '', allocatedAdults: guest.allocated_adults, allocatedChildren: guest.allocated_children, tableName: guest.table_name_fallback || '' };
}

export function EditorClient({ slug, initialTab }: { slug: string; initialTab: 'appearance' | 'guests' | 'reception' }) {
  const [tab, setTab] = useState<'appearance' | 'guests' | 'reception'>(initialTab);
  const [section, setSection] = useState<string>('hero');
  const [event, setEvent] = useState<EditorEvent | null>(null);
  const [config, setConfig] = useState<InvitationConfig | null>(null);
  const [title, setTitle] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [guests, setGuests] = useState<EditorGuest[]>([]);
  const [pin, setPin] = useState('');
  const [locked, setLocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [viewport, setViewport] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [frameReady, setFrameReady] = useState(0);
  const [pickMode, setPickMode] = useState(false);
  const [frameWidth, setFrameWidth] = useState(390);
  const [guestDraft, setGuestDraft] = useState<GuestForm>(blankGuest);
  const [editingGuestId, setEditingGuestId] = useState<string | null>(null);
  const [guestBusy, setGuestBusy] = useState(false);
  const [guestToDelete, setGuestToDelete] = useState<EditorGuest | null>(null);
  const [deletingGuest, setDeletingGuest] = useState(false);
  const frameRef = useRef<HTMLIFrameElement>(null);
  const frameArea = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  const focusPreviewSection = useCallback((id: string) => {
    frameRef.current?.contentWindow?.postMessage({ type: 'heyday:focus-section', section: id }, window.location.origin);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/editor/${encodeURIComponent(slug)}`, { cache: 'no-store' });
      if (response.status === 401) { setLocked(true); setEvent(null); return; }
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo abrir la invitación');
      setEvent(result.event); setConfig({ ...result.event.config, content: { ...result.event.config.content, hero: { ...result.event.config.content.hero, coverVideoUrl: result.event.config.content.hero.coverVideoUrl || '' } } }); setTitle(result.event.title); setEventDate(result.event.eventDate);
      setGuests(result.guests); setLocked(false); setDirty(false);
    } catch (error) { toast.error(error instanceof Error ? error.message : 'No se pudo abrir la invitación'); }
    finally { setLoading(false); }
  }, [slug]);
  useEffect(() => { void load(); }, [load]);

  useEffect(() => {
    const element = frameArea.current;
    if (!element) return;
    const observer = new ResizeObserver(() => setFrameWidth(element.clientWidth));
    observer.observe(element);
    return () => observer.disconnect();
  }, [event, tab]);

  useEffect(() => {
    const ready = (message: MessageEvent) => {
      if (message.origin !== window.location.origin || message.source !== frameRef.current?.contentWindow) return;
      if (message.data?.type === 'heyday:preview-ready') setFrameReady(current => current + 1);
      if (message.data?.type === 'heyday:pick-cancel') setPickMode(false);
      if (message.data?.type === 'heyday:select-section' && groups.some(group => group.id === message.data.section)) {
        setSection(message.data.section);
        setPickMode(false);
        requestAnimationFrame(() => focusPreviewSection(message.data.section));
      }
    };
    window.addEventListener('message', ready);
    return () => window.removeEventListener('message', ready);
  }, [focusPreviewSection]);

  const sendPreview = useCallback(() => {
    if (!config || !event || !frameReady) return;
    frameRef.current?.contentWindow?.postMessage({ type: 'heyday:preview', config, eventDate, templateId: event.templateId, previewEnvelope: tab === 'appearance' && section === 'envelope' }, window.location.origin);
  }, [config, event, eventDate, frameReady, section, tab]);
  useEffect(() => { const frame = requestAnimationFrame(sendPreview); return () => cancelAnimationFrame(frame); }, [sendPreview]);
  useEffect(() => {
    if (!frameReady || tab !== 'appearance') return;
    const frame = requestAnimationFrame(() => focusPreviewSection(section));
    return () => cancelAnimationFrame(frame);
  }, [focusPreviewSection, frameReady, section, tab]);
  useEffect(() => {
    if (!frameReady) return;
    frameRef.current?.contentWindow?.postMessage({ type: 'heyday:pick-mode', enabled: pickMode && tab === 'appearance' }, window.location.origin);
  }, [frameReady, pickMode, tab]);
  useEffect(() => {
    formRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    document.querySelector('.editor-section-nav button.active')?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [section]);

  const update = (path: Array<string | number>, value: unknown) => {
    setConfig(current => current ? setAtPath(current, path, value) : current);
    setDirty(true);
  };
  const updateHeading = (sectionId: SectionId, part: 'eyebrow' | 'title', value: string) => {
    setConfig(current => current ? { ...current, content: { ...current.content, sectionHeadings: { ...current.content.sectionHeadings, [sectionId]: { ...current.content.sectionHeadings?.[sectionId], [part]: value || undefined } } } } : current);
    setDirty(true);
  };
  const headingFields = (sectionId: SectionId) => <div className="editor-object editor-heading-fields"><span className="editor-label">Encabezado de la sección</span>{(sectionId === 'quote_story' ? ['eyebrow'] as const : ['eyebrow', 'title'] as const).map(part => <label className="editor-field" key={part}><span className="editor-label">{part === 'eyebrow' ? 'Etiqueta superior' : 'Título de sección'}</span><input value={config?.content.sectionHeadings?.[sectionId]?.[part] || ''} onChange={e => updateHeading(sectionId, part, e.target.value)} placeholder="Texto original de la plantilla" /></label>)}</div>;

  const unlock = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`/api/editor/${encodeURIComponent(slug)}/session`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ pin }) });
    const result = await response.json();
    if (!response.ok) { toast.error(result.error || 'Contraseña incorrecta'); return; }
    setPin(''); await load();
  };

  const save = async () => {
    if (!event || !config) return;
    setSaving(true);
    try {
      const response = await fetch(`/api/editor/${encodeURIComponent(slug)}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ title, eventDate, config, updatedAt: event.updatedAt }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudieron guardar los cambios');
      setEvent(result.event); setConfig(result.event.config); setDirty(false); toast.success('Cambios guardados');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'No se pudieron guardar los cambios'); }
    finally { setSaving(false); }
  };

  const upload = async (file: File, path?: Array<string | number>) => {
    if (!config) return;
    setUploading(true);
    try {
      const form = new FormData(); form.set('file', file);
      const response = await fetch(`/api/editor/${encodeURIComponent(slug)}/assets`, { method: 'POST', body: form });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo subir el archivo');
      if (path) update(path, result.url);
      else { setConfig(current => current ? setAtPath(current, ['content', 'gallery', 'images'], [...current.content.gallery.images, { url: result.url, caption: '' }]) : current); setDirty(true); }
      toast.success('Archivo subido a Supabase');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'No se pudo subir la foto'); }
    finally { setUploading(false); }
  };

  const renderField = (value: unknown, path: Array<string | number>, key: string): React.ReactNode => {
    if (key === 'id') return null;
    const pathText = path.filter(item => typeof item === 'string').join('.');
    const label = labels[key] || key;
    if (pathText === 'content.gallery.images') {
      const photos = value as InvitationConfig['content']['gallery']['images'];
      return <div className="editor-field" key={pathText}><span className="editor-label">Fotos de la galería</span><div className="editor-photos">{photos.map((photo, index) => <div className="editor-photo" key={`${photo.url}-${index}`}><img src={photo.url} alt={`Foto ${index + 1}`} /><input aria-label={`Descripción de foto ${index + 1}`} value={photo.caption || ''} onChange={e => update([...path, index, 'caption'], e.target.value)} placeholder="Descripción" /><button type="button" aria-label={`Quitar foto ${index + 1}`} onClick={() => update(path, photos.filter((_, i) => i !== index))}><Trash2 size={15} /></button></div>)}</div><label className="editor-upload"><ImagePlus size={17} />{uploading ? 'Subiendo…' : 'Agregar fotos'}<input type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={uploading} onChange={async e => { const files = Array.from(e.target.files || []); e.target.value = ''; for (const file of files) await upload(file); }} /></label></div>;
    }
    if (Array.isArray(value)) {
      return <div className="editor-array" key={pathText}><div className="editor-array-head"><span className="editor-label">{label}</span><button type="button" onClick={() => update(path, [...value, arrayItem(path)])}><Plus size={15} /> Agregar</button></div>{value.map((item, index) => <div className="editor-array-item" key={typeof item === 'object' && item && 'id' in item ? String(item.id) : index}><div className="editor-array-title"><strong>{label} {index + 1}</strong><button type="button" aria-label={`Quitar ${label} ${index + 1}`} onClick={() => update(path, value.filter((_, i) => i !== index))}><Trash2 size={15} /></button></div>{renderField(item, [...path, index], String(index))}</div>)}</div>;
    }
    if (typeof value === 'object' && value !== null) {
      return <fieldset className="editor-object" key={pathText}><legend>{typeof path[path.length - 1] === 'number' ? `Detalle` : label}</legend>{Object.entries(value).filter(([child]) => pathText !== 'theme' || child !== 'envelope').map(([child, childValue]) => renderField(childValue, [...path, child], child))}</fieldset>;
    }
    if (typeof value === 'boolean') return <label className="editor-toggle" key={pathText}><span>{label}</span><input type="checkbox" checked={value} onChange={e => update(path, e.target.checked)} /></label>;
    if (typeof value === 'number') return <label className="editor-field" key={pathText}><span className="editor-label">{label}</span><input type="number" step="any" value={value} onChange={e => update(path, Number(e.target.value))} /></label>;
    const text = String(value ?? '');
    if (pathText.startsWith('theme.fonts.')) {
      const known = INVITATION_FONTS.some(font => font.name === text);
      return <label className="editor-field editor-font-field" key={pathText}><span className="editor-label">{label}</span><select value={text} onChange={e => update(path, e.target.value)} style={{ fontFamily: invitationFontStack(text) }}>{!known && <option value={text}>{text}</option>}{INVITATION_FONTS.map(font => <option key={font.name} value={font.name} style={{ fontFamily: font.family }}>{font.name}</option>)}</select><span className="editor-font-sample" style={{ fontFamily: invitationFontStack(text) }}>Aa · Celebremos juntos</span></label>;
    }
    const image = key === 'imageUrl' || key === 'coverImageUrl';
    if (image) return <div className="editor-field" key={pathText}><span className="editor-label">{label}</span>{text && <img src={text} alt={label} className="editor-image-preview" />}<label className="editor-upload"><ImagePlus size={17} />{uploading ? 'Subiendo…' : 'Subir o reemplazar foto'}<input type="file" accept="image/jpeg,image/png,image/webp" disabled={uploading} onChange={e => { const file = e.target.files?.[0]; e.target.value = ''; if (file) void upload(file, path); }} /></label>{text && <button className="editor-remove-media" type="button" onClick={() => update(path, '')}>Quitar foto</button>}</div>;
    if (key === 'trackUrl' || key === 'coverVideoUrl') {
      const audio = key === 'trackUrl';
      return <div className="editor-field" key={pathText}><span className="editor-label">{label}</span>{text && (audio ? <audio controls src={text} /> : <video controls src={text} className="editor-image-preview" />)}<label className="editor-upload">{uploading ? 'Subiendo…' : audio ? 'Subir audio' : 'Subir video'}<input type="file" accept={audio ? 'audio/mpeg,audio/mp4' : 'video/mp4,video/webm'} disabled={uploading} onChange={e => { const file = e.target.files?.[0]; e.target.value = ''; if (file) void upload(file, path); }} /></label>{text && <button className="editor-remove-media" type="button" onClick={() => update(path, '')}>Quitar archivo</button>}</div>;
    }
    const selectKey = selects[pathText] ? pathText : pathText.replace(/\.\d+\./g, '.');
    if (selects[selectKey]) return <label className="editor-field" key={pathText}><span className="editor-label">{label}</span><select value={text} onChange={e => update(path, e.target.value)}>{selects[selectKey].map(option => <option key={option} value={option}>{selectLabels[option] || option.replaceAll('-', ' ').replaceAll('_', ' ')}</option>)}</select></label>;
    if (/^#(?:[0-9a-f]{3}|[0-9a-f]{6})$/i.test(text)) return <label className="editor-field editor-color" key={pathText}><span className="editor-label">{label}</span><span><input type="color" value={text} onChange={e => update(path, e.target.value)} /><code>{text}</code></span></label>;
    const multiline = text.length > 80 || /(?:description|Message|Notes|quoteText|reservedNote)$/i.test(key);
    return <label className="editor-field" key={pathText}><span className="editor-label">{label}</span>{multiline ? <textarea rows={3} value={text} onChange={e => update(path, e.target.value)} /> : <input value={text} onChange={e => update(path, e.target.value)} />}</label>;
  };

  const saveGuest = async (e: React.FormEvent) => {
    e.preventDefault(); setGuestBusy(true);
    try {
      const endpoint = `/api/editor/${encodeURIComponent(slug)}/guests${editingGuestId ? `/${encodeURIComponent(editingGuestId)}` : ''}`;
      const response = await fetch(endpoint, { method: editingGuestId ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(guestDraft) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo guardar el invitado');
      setGuests(current => editingGuestId ? current.map(item => item.id === editingGuestId ? result.guest : item) : [...current, result.guest]);
      setGuestDraft(blankGuest); setEditingGuestId(null); toast.success('Invitado guardado');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'No se pudo guardar el invitado'); }
    finally { setGuestBusy(false); }
  };
  const deleteGuest = async () => {
    if (!guestToDelete) return;
    setDeletingGuest(true);
    try {
      const response = await fetch(`/api/editor/${encodeURIComponent(slug)}/guests/${encodeURIComponent(guestToDelete.id)}`, { method: 'DELETE' });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || 'No se pudo eliminar el pase');
      setGuests(current => current.filter(item => item.id !== guestToDelete.id));
      if (editingGuestId === guestToDelete.id) { setEditingGuestId(null); setGuestDraft(blankGuest); }
      setGuestToDelete(null);
      toast.success('Pase eliminado');
    } catch (error) { toast.error(error instanceof Error ? error.message : 'No se pudo eliminar el pase'); }
    finally { setDeletingGuest(false); }
  };

  if (loading) return <main className="editor-loading">Cargando editor…</main>;
  if (locked) return <main className="editor-lock"><form onSubmit={unlock} className="editor-lock-card"><div className="editor-lock-icon"><LockKeyhole size={26} /></div><p className="editor-eyebrow">HeyDay · Tu invitación</p><h1>Hazla tuya</h1><p>Introduce la contraseña de 4 dígitos que recibiste para editar tu invitación.</p><label>Contraseña<input inputMode="numeric" pattern="[0-9]{4}" maxLength={4} autoComplete="one-time-code" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="0000" required autoFocus /></label><button type="submit">Entrar al editor</button></form></main>;
  if (!event || !config) return <main className="editor-loading">No se pudo abrir la invitación. <button onClick={() => void load()}>Reintentar</button></main>;

  const selected = groups.find(item => item.id === section) || groups[3];
  const screenWidth = viewport === 'mobile' ? 390 : viewport === 'tablet' ? 768 : 1200;
  const screenHeight = viewport === 'mobile' ? 844 : viewport === 'tablet' ? 1000 : 900;
  const scale = Math.min(1, Math.max(0.3, (frameWidth - 28) / screenWidth));
  const previewWidth = screenWidth * scale;
  const previewHeight = screenHeight * scale;

  return <main className={`editor-shell${tab === 'appearance' ? ' editor-shell--appearance' : ''}`}>
    <header className="editor-topbar"><div className="editor-heading"><Link href="/dashboard" aria-label="Volver al panel"><ArrowLeft size={18} /></Link><div><p className="editor-eyebrow">HeyDay · Editor de invitación</p><h1>{event.clientName || title}</h1></div></div><div className="editor-top-actions"><div className="editor-share-link"><Link href={`/invitacion/${encodeURIComponent(slug)}`} target="_blank" title="Abrir invitación"><Link2 size={17} /><span><strong>Enlace de invitación</strong><small>/invitacion/{slug}</small></span><ExternalLink size={14} /></Link><button type="button" aria-label="Copiar enlace de invitación" title="Copiar enlace de invitación" onClick={async () => { try { await navigator.clipboard.writeText(`${window.location.origin}/invitacion/${encodeURIComponent(slug)}`); toast.success('Enlace de invitación copiado'); } catch { toast.error('No se pudo copiar el enlace'); } }}><Copy size={16} /></button></div><span className={`editor-status ${dirty ? 'is-dirty' : ''}`}>{dirty ? 'Cambios sin guardar' : 'Todo guardado'}</span><button type="button" className="editor-save" onClick={() => void save()} disabled={!dirty || saving}><Save size={17} />{saving ? 'Guardando…' : 'Guardar cambios'}</button></div></header>
    <nav className="editor-tabs" aria-label="Panel de edición"><button className={tab === 'appearance' ? 'active' : ''} onClick={() => setTab('appearance')}><WandSparkles size={18} /> Editar aspecto</button><button className={tab === 'guests' ? 'active' : ''} onClick={() => { setPickMode(false); setTab('guests'); }}><Users size={18} /> Gestionar invitados <span>{guests.length}</span></button><button className={tab === 'reception' ? 'active' : ''} onClick={() => { setPickMode(false); setTab('reception'); }}><QrCode size={18} /> Recepción QR</button></nav>
    {tab === 'appearance' ? <div className="editor-workspace"><aside className="editor-inspector"><div className="editor-intro"><h2>Personaliza tu invitación</h2><p>Cada cambio aparece al instante en la vista previa. Guarda los cambios cuando termines.</p></div><div className="editor-section-nav">{groups.map(item => <button type="button" key={item.id} className={selected.id === item.id ? 'active' : ''} onClick={() => { setPickMode(false); if (item.id === section) focusPreviewSection(item.id); setSection(item.id); }}>{item.label}</button>)}</div><div className="editor-form" ref={formRef}><h2>{selected.label}</h2>{selected.id === 'hero' && <><label className="editor-field"><span className="editor-label">Nombre del evento</span><input value={title} onChange={e => { setTitle(e.target.value); setDirty(true); }} /></label><label className="editor-field"><span className="editor-label">Fecha y hora del evento</span><input type="datetime-local" value={localDateTime(eventDate)} onChange={e => { setEventDate(`${e.target.value}:00-06:00`); setDirty(true); }} /></label></>}{headingSections[selected.id] && headingFields(headingSections[selected.id]!)}{selected.id === 'countdown' ? null : selected.id === 'sections' ? config.sectionsOrder.map((item, index) => <label className="editor-toggle" key={item.id}><span>{sectionLabels[item.id] || item.id}</span><input type="checkbox" checked={item.enabled} onChange={e => update(['sectionsOrder', index, 'enabled'], e.target.checked)} /></label>) : renderField(getAtPath(config, [...selected.path]), [...selected.path], selected.label)}</div></aside><section className="editor-preview-panel"><div className="editor-preview-toolbar"><div><strong>{selected.id === 'envelope' ? 'Vista previa del sobre' : 'Vista previa en tiempo real'}</strong><span>{screenWidth} × {screenHeight} px</span></div><button type="button" className={`editor-pick-button${pickMode ? ' active' : ''}`} aria-pressed={pickMode} onClick={() => setPickMode(current => !current)}><MousePointer2 size={16} />{pickMode ? 'Salir de selección' : 'Seleccionar'}</button><div className="editor-device-buttons">{([['mobile', Smartphone, 'Móvil'], ['tablet', Tablet, 'Tablet'], ['desktop', Monitor, 'Escritorio']] as const).map(([id, Icon, label]) => <button type="button" key={id} title={label} aria-label={label} aria-pressed={viewport === id} className={viewport === id ? 'active' : ''} onClick={() => setViewport(id)}><Icon size={17} /><span>{label}</span></button>)}</div>{event.status === 'published' && <Link href={`/invitacion/${encodeURIComponent(slug)}`} target="_blank" title="Abrir invitación"><ExternalLink size={17} /></Link>}</div>{pickMode && <p className="editor-pick-hint"><MousePointer2 size={15} /> Haz clic en una sección de la invitación para abrir sus controles.</p>}<div className="editor-preview-space" ref={frameArea}><div className="editor-frame-holder" style={{ width: previewWidth, height: previewHeight }}><iframe ref={frameRef} title="Vista previa de la invitación" src={`/editar/${encodeURIComponent(slug)}/vista`} onLoad={() => setFrameReady(current => current + 1)} style={{ width: screenWidth, height: screenHeight, transform: `scale(${scale})`, transformOrigin: 'top left' }} /></div></div></section></div> : tab === 'guests' ? <section className="editor-guests"><div className="editor-guests-heading"><div><p className="editor-eyebrow">Pases personales</p><h2>Gestionar invitaciones a invitados</h2><p>Crea enlaces únicos, asigna cupos y consulta las confirmaciones.</p></div><div className="editor-guest-metric"><strong>{guests.reduce((total, guest) => total + guest.confirmed_adults + guest.confirmed_children, 0)}</strong><span>personas confirmadas</span></div></div>{event.status !== 'published' && <p className="editor-draft-note">La invitación sigue en borrador. El administrador debe publicarla antes de compartir los pases con invitados.</p>}<div className="editor-guests-grid"><form className="editor-guest-form" onSubmit={saveGuest}><h3>{editingGuestId ? 'Editar pase' : 'Crear pase'}</h3><label>Familia o invitado<input required value={guestDraft.groupName} onChange={e => setGuestDraft({ ...guestDraft, groupName: e.target.value })} /></label><label>WhatsApp<input type="tel" value={guestDraft.whatsappPhone} onChange={e => setGuestDraft({ ...guestDraft, whatsappPhone: e.target.value })} /></label><label>Correo electrónico<input type="email" value={guestDraft.email} onChange={e => setGuestDraft({ ...guestDraft, email: e.target.value })} /></label><label>Grupo o etiqueta<input value={guestDraft.groupTag} onChange={e => setGuestDraft({ ...guestDraft, groupTag: e.target.value })} /></label><div className="editor-guest-numbers"><label>Adultos<input type="number" min={0} max={20} value={guestDraft.allocatedAdults} onChange={e => setGuestDraft({ ...guestDraft, allocatedAdults: Number(e.target.value) })} /></label><label>Niños<input type="number" min={0} max={20} value={guestDraft.allocatedChildren} onChange={e => setGuestDraft({ ...guestDraft, allocatedChildren: Number(e.target.value) })} /></label></div><label>Mesa<input value={guestDraft.tableName} onChange={e => setGuestDraft({ ...guestDraft, tableName: e.target.value })} /></label><button type="submit" disabled={guestBusy}><Plus size={17} />{guestBusy ? 'Guardando…' : editingGuestId ? 'Guardar pase' : 'Crear pase'}</button>{editingGuestId && <button type="button" className="editor-cancel" onClick={() => { setEditingGuestId(null); setGuestDraft(blankGuest); }}>Cancelar edición</button>}</form><GuestPassPreview draft={guestDraft} eventTitle={title} /><div className="editor-guest-list"><div className="editor-guest-list-title"><h3>Invitados</h3><span>{guests.length} pases</span></div>{guests.length === 0 && <p className="editor-empty">Aún no hay pases. Crea el primero con el formulario.</p>}{guests.map(guest => { const url = `${window.location.origin}/invitacion/${encodeURIComponent(slug)}?g=${encodeURIComponent(guest.guest_token)}`; return <article className="editor-guest-card" key={guest.id}><div><strong>{guest.group_name}</strong><span>{guest.allocated_adults} adultos · {guest.allocated_children} niños · {guest.table_name_fallback || 'Sin mesa'}</span><small>{guest.rsvp_status === 'confirmed' ? `Confirmado: ${guest.confirmed_adults + guest.confirmed_children}` : guest.rsvp_status === 'declined' ? 'No asistirá' : 'Pendiente de respuesta'}</small></div><div className="editor-guest-card-actions"><button type="button" disabled={event.status !== 'published'} onClick={async () => { await navigator.clipboard.writeText(url); toast.success('Enlace copiado'); }}><Copy size={15} /> Copiar pase</button>{event.status === 'published' && guest.whatsapp_phone && <a href={buildWhatsappInviteUrl({ phone: guest.whatsapp_phone, groupName: guest.group_name, eventTitle: title, allocatedAdults: guest.allocated_adults, allocatedChildren: guest.allocated_children, invitationUrl: url })} target="_blank" rel="noreferrer">WhatsApp</a>}<button type="button" onClick={() => { setEditingGuestId(guest.id); setGuestDraft(guestForm(guest)); }}>Editar</button><button type="button" aria-label={`Eliminar pase de ${guest.group_name}`} onClick={() => setGuestToDelete(guest)}><Trash2 size={15} /></button></div></article>; })}</div></div></section> : <EventReception slug={slug} />}
    {guestToDelete && <ConfirmDialog title="Eliminar pase" description={`Se eliminará el pase de ${guestToDelete.group_name}. Su enlace dejará de funcionar y esta acción no se puede deshacer.`} confirmLabel="Sí, eliminar pase" busy={deletingGuest} onCancel={() => setGuestToDelete(null)} onConfirm={() => void deleteGuest()} />}
  </main>;
}
