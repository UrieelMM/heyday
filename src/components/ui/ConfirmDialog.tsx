'use client';

import { useEffect, useRef } from 'react';
import { AlertTriangle, X } from 'lucide-react';

type ConfirmDialogProps = {
  title: string;
  description: string;
  confirmLabel: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmDialog({ title, description, confirmLabel, busy = false, onCancel, onConfirm }: ConfirmDialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    cancelRef.current?.focus();
    return () => previousFocus?.focus();
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !busy) onCancel();
      if (event.key !== 'Tab') return;
      const buttons = Array.from(dialogRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') || []);
      if (buttons.length === 0) return;
      const first = buttons[0];
      const last = buttons[buttons.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [busy, onCancel]);

  return (
    <div className="fixed inset-0 z-[110] grid place-items-center bg-[#1d1714]/70 p-4 backdrop-blur-sm" role="presentation">
      <div ref={dialogRef} role="alertdialog" aria-modal="true" aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description" className="relative w-full max-w-md rounded-[22px] border border-[#eaded3] bg-white p-6 shadow-2xl sm:p-8">
        <button type="button" aria-label="Cerrar" disabled={busy} onClick={onCancel} className="absolute right-5 top-5 rounded-lg p-1.5 text-[#75695f] hover:bg-[#f5f0e8]"><X size={18} /></button>
        <div className="mb-5 grid h-12 w-12 place-items-center rounded-2xl bg-[#fff0e8] text-[#a9533b]"><AlertTriangle size={22} /></div>
        <h2 id="confirm-dialog-title" className="font-serif text-2xl text-[#28241f]">{title}</h2>
        <p id="confirm-dialog-description" className="mt-3 text-sm leading-relaxed text-[#74685d]">{description}</p>
        <div className="mt-7 flex justify-end gap-2">
          <button ref={cancelRef} type="button" disabled={busy} onClick={onCancel} className="rounded-xl border border-[#ddd0c3] px-4 py-2.5 text-sm font-semibold text-[#51463b] hover:bg-[#f8f4ee]">Cancelar</button>
          <button type="button" disabled={busy} onClick={onConfirm} className="rounded-xl bg-[#b34f3d] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#963f30] disabled:opacity-60">{busy ? 'Eliminando…' : confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
