import type { ReactNode } from 'react';
import type { InvitationConfig } from '@/types/invitation.types';
import styles from './gallery-layout.module.css';

export function GalleryLayout({ layout, className, children }: {
  layout: InvitationConfig['content']['gallery']['layout'];
  className: string;
  children: ReactNode;
}) {
  if (layout === 'cinema-slider') {
    return (
      <div className={`${className} ${styles.slider}`} role="region" aria-label="Fotos de la galería, desliza para ver más" tabIndex={0}>
        {children}
      </div>
    );
  }
  return <div className={`${className}${layout === 'polaroid-scatter' ? ` ${styles.polaroids}` : ''}`}>{children}</div>;
}
