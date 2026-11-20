'use client';

import { useEffect, useState } from 'react';
import { Clock3 } from 'lucide-react';
import { albumExpiration } from '@/lib/albums/expiration';
import styles from './event-memories.module.css';

export function AlbumExpirationNotice({ expiresAt, purgedAt }: { expiresAt?: string; purgedAt?: string | null }) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const update = () => setNow(Date.now());
    const timer = window.setInterval(update, 60_000);
    document.addEventListener('visibilitychange', update);
    return () => { window.clearInterval(timer); document.removeEventListener('visibilitychange', update); };
  }, []);
  const status = expiresAt ? albumExpiration(expiresAt, purgedAt, now) : null;
  if (!status) return null;

  return <p className={styles.expiration} data-urgent={status.expired || status.daysRemaining <= 7} role="status">
    <Clock3 size={16} aria-hidden="true" />
    <span>{status.expired
      ? <>El álbum venció el {status.date}.{purgedAt ? ' Sus fotos ya fueron eliminadas.' : ''}</>
      : <><strong>{status.daysRemaining === 1 ? 'Queda 1 día' : `Quedan ${status.daysRemaining} días`}</strong> para descargar tus fotos. El álbum vence el {status.date}.</>}
    </span>
  </p>;
}
