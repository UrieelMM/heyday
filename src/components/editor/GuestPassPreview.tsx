'use client';

import { AnimatePresence, motion } from 'motion/react';
import { Mail, Sparkles } from 'lucide-react';

type GuestPassDraft = {
  groupName: string;
  whatsappPhone: string;
  email: string;
  groupTag: string;
  allocatedAdults: number;
  allocatedChildren: number;
  tableName: string;
};

export function GuestPassPreview({ draft, eventTitle }: { draft: GuestPassDraft; eventTitle: string }) {
  const name = draft.groupName.trim();
  const details = [draft.groupTag.trim(), draft.tableName.trim(), draft.whatsappPhone.trim(), draft.email.trim()].filter(Boolean);
  const progress = Number(Boolean(name)) + details.length;
  const people = draft.allocatedAdults + draft.allocatedChildren;

  return (
    <aside className="editor-pass-preview" aria-label="Vista previa del pase mientras lo completas">
      <div className="editor-pass-preview-head"><span className="editor-eyebrow">Vista en vivo</span><h3>Un pase que cobra vida</h3><p>Los detalles aparecen en el sobre mientras completas el formulario.</p></div>
      <div className="editor-pass-stage" style={{ '--flap-rotation': `${progress * -14}deg` } as React.CSSProperties}>
        <span className="editor-pass-spark editor-pass-spark--one"><Sparkles size={16} /></span>
        <span className="editor-pass-spark editor-pass-spark--two"><Sparkles size={11} /></span>
        <div className="editor-pass-letter" style={{ transform: `translateY(${name ? -Math.min(progress * 7, 35) : 52}px)` }}>
          <span className="editor-pass-letter-kicker">HEYDAY · INVITACIÓN PERSONAL</span>
          <strong>{name || 'Tu invitado aquí'}</strong>
          <span className="editor-pass-letter-event">{eventTitle}</span>
          <div className="editor-pass-letter-lines">
            <AnimatePresence initial={false}>
              {people > 0 && <motion.span key="people" layout initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -7 }}>{people} {people === 1 ? 'pase reservado' : 'pases reservados'} · {draft.allocatedAdults} adultos · {draft.allocatedChildren} niños</motion.span>}
              {draft.groupTag.trim() && <motion.span key="tag" layout initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -7 }}>{draft.groupTag}</motion.span>}
              {draft.tableName.trim() && <motion.span key="table" layout initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -7 }}>Mesa · {draft.tableName}</motion.span>}
              {(draft.whatsappPhone.trim() || draft.email.trim()) && <motion.span key="contact" layout initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -7 }}>Listo para compartir {draft.whatsappPhone.trim() ? 'por WhatsApp' : 'por correo'}</motion.span>}
            </AnimatePresence>
          </div>
        </div>
        <div className="editor-pass-envelope" aria-hidden="true"><div className="editor-pass-envelope-back" /><div className="editor-pass-envelope-flap" /><div className="editor-pass-envelope-front" /><div className="editor-pass-envelope-seal"><Mail size={21} /></div></div>
      </div>
      <div className="editor-pass-progress" aria-label={`${progress} de 5 detalles completos`}><span style={{ width: `${progress * 20}%` }} /></div>
      <p className="editor-pass-progress-label">{progress === 0 ? 'Comienza con el nombre del invitado' : progress === 5 ? 'Pase listo para guardar' : `${progress} de 5 detalles agregados`}</p>
    </aside>
  );
}
