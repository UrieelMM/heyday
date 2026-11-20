'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';
import styles from './pagination.module.css';

type PaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  label: string;
  controlsId?: string;
};

export function Pagination({ page, pageSize, total, onPageChange, label, controlsId }: PaginationProps) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.max(1, Math.min(page, pages));
  if (pages <= 1) return null;

  const visible = Array.from(new Set([1, current - 1, current, current + 1, pages]))
    .filter(value => value >= 1 && value <= pages).sort((a, b) => a - b);

  return <nav className={styles.pagination} aria-label={label}>
    <span className={styles.summary} role="status">Página {current} de {pages}</span>
    <div className={styles.buttons}>
      <button type="button" disabled={current === 1} onClick={() => onPageChange(current - 1)} aria-label="Página anterior" aria-controls={controlsId}><ChevronLeft size={18} aria-hidden="true" /></button>
      {visible.map((value, index) => <span key={value} className={styles.page}>
        {index > 0 && value - visible[index - 1] > 1 && <span className={styles.ellipsis} aria-hidden="true">…</span>}
        <button type="button" aria-label={`Ir a la página ${value}`} aria-current={current === value ? 'page' : undefined} aria-controls={controlsId} onClick={() => onPageChange(value)}>{value}</button>
      </span>)}
      <button type="button" disabled={current === pages} onClick={() => onPageChange(current + 1)} aria-label="Página siguiente" aria-controls={controlsId}><ChevronRight size={18} aria-hidden="true" /></button>
    </div>
  </nav>;
}
