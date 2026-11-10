import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { HeyDayBrand } from '@/components/brand/HeyDayBrand';
import styles from './not-found.module.css';

function LostInvitation() {
  return (
    <div className={styles.illustration} aria-hidden="true">
      <svg viewBox="0 0 540 460" fill="none" focusable="false">
        <defs>
          <linearGradient id="lost-envelope" x1="8" y1="100" x2="290" y2="284" gradientUnits="userSpaceOnUse">
            <stop stopColor="#d3846e" />
            <stop offset="1" stopColor="#ac5445" />
          </linearGradient>
          <linearGradient id="lost-paper" x1="38" y1="11" x2="296" y2="221" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fffaf0" />
            <stop offset="1" stopColor="#f0dbc0" />
          </linearGradient>
          <radialGradient id="lost-shadow">
            <stop stopColor="#573522" stopOpacity=".24" />
            <stop offset="1" stopColor="#573522" stopOpacity="0" />
          </radialGradient>
        </defs>

        <path d="M26 52V26h26m436 0h26v26m0 356v26h-26m-436 0H26v-26" stroke="#99634e" strokeOpacity=".5" />
        <path
          d="M20 332c61 46 128 42 119-3-6-28-48-29-62-63C46 188 150 135 261 139c103 4 152-10 193-65"
          stroke="#985744"
          strokeOpacity=".57"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeDasharray="3 7"
        />
        <path d="m440 62 41-24-12 39-12-13-17-2Zm17 2 24-26" stroke="#a05c48" strokeWidth="1.4" strokeLinejoin="round" />
        <path d="M101 97v22m-11-11h22m338 195v26m-13-13h26m-67 61v12m-6-6h12" stroke="#a05c48" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="68" cy="140" r="2.5" fill="#a05c48" />
        <circle cx="472" cy="285" r="2.5" fill="#a05c48" />
        <ellipse cx="272" cy="384" rx="208" ry="38" fill="url(#lost-shadow)" />

        <g className={styles.mail}>
          <g transform="translate(101 97) rotate(-8 168 141)">
            <path d="M0 124 152 17a28 28 0 0 1 32 0l152 107v142a9 9 0 0 1-9 9H9a9 9 0 0 1-9-9Z" fill="#924636" stroke="#8b4234" />
            <path d="M5 125 157 23a19 19 0 0 1 22 0l152 102" stroke="#f0aa8a" strokeOpacity=".48" />

            <g transform="rotate(9 172 118)">
              <rect x="35" y="9" width="267" height="214" rx="5" fill="#663628" opacity=".27" />
              <rect x="38" y="6" width="265" height="213" rx="5" fill="url(#lost-paper)" stroke="#c7987c" />
              <rect x="49" y="17" width="243" height="191" rx="2" stroke="#b07960" strokeOpacity=".48" />
              <text x="62" y="43" className={styles.postalType}>CORREO HEYDAY</text>
              <path d="M62 54h128m-128 94h112" stroke="#aa7764" strokeOpacity=".6" />
              <text x="58" y="133" className={styles.postalCode}>404</text>
              <text x="62" y="171" className={styles.postalType}>DESTINO DESCONOCIDO</text>

              <rect x="227" y="28" width="51" height="60" rx="2" fill="#e7b49a" stroke="#925744" strokeDasharray="2 2" />
              <rect x="233" y="34" width="39" height="48" rx="1" stroke="#925744" strokeOpacity=".72" />
              <path d="M252 43c1 10 4 13 13 15-9 1-12 5-13 15-2-10-5-14-14-15 9-2 12-5 14-15Z" fill="#864737" />
              <path d="M265 102c-12-12-26 6-39-4m39 11c-12-12-26 6-39-4m39 11c-12-12-26 6-39-4" stroke="#a25b48" strokeOpacity=".7" strokeLinecap="round" />
            </g>

            <path d="M0 124 168 221 336 124v142a9 9 0 0 1-9 9H9a9 9 0 0 1-9-9Z" fill="url(#lost-envelope)" stroke="#9b4e40" />
            <path d="m6 270 131-86a57 57 0 0 1 62 0l131 86" fill="#bd6b56" stroke="#9b4e40" />
            <path d="m0 124 168 97 168-97" stroke="#8c4437" strokeWidth="1.2" />
            <path d="m12 136 156 91 156-91" stroke="#f5b698" strokeOpacity=".58" />
            <path d="M167 192c13-2 26 11 25 25 2 15-10 25-24 25-15 2-27-11-27-24-2-14 12-26 26-26Z" fill="#773c33" />
            <circle cx="167" cy="216" r="18" fill="#8e4b3e" stroke="#a65d4c" />
            <path d="M167 204c1 7 4 10 12 12-8 1-11 4-12 12-1-8-4-11-12-12 8-2 11-5 12-12Z" fill="#efbda1" />
          </g>
        </g>

        <text x="40" y="419" className={styles.panelLabel}>FIG. 01</text>
        <text x="498" y="419" textAnchor="end" className={styles.panelLabel}>CORRESPONDENCIA EXTRAVIADA</text>
      </svg>
    </div>
  );
}

export default function NotFound() {
  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link href="/" aria-label="HeyDay, volver al inicio">
          <HeyDayBrand />
        </Link>
        <span className={styles.label}>Correo de celebraciones</span>
      </header>

      <main className={styles.main} aria-labelledby="not-found-title">
        <div className={styles.copy}>
          <p className={styles.kicker}><span />404 · Página no encontrada</p>
          <h1 id="not-found-title">Este enlace <span>se perdió</span> <em>de camino.</em></h1>
          <p className={styles.description}>
            Si venías a una celebración, revisa el enlace de tu invitación o pídele a quien te invitó que te lo reenvíe.
          </p>
          <nav className={styles.actions} aria-label="Opciones para continuar">
            <Link href="/" className={styles.primary}>
              Volver al inicio <ArrowRight size={17} aria-hidden="true" />
            </Link>
            <Link href="/#templates" className={styles.secondary}>Ver diseños</Link>
          </nav>
        </div>
        <LostInvitation />
      </main>

      <footer className={styles.footer}>
        <span>HEYDAY.PARTY</span>
        <span>Siempre hay algo que celebrar <span aria-hidden="true">✦</span></span>
      </footer>
    </div>
  );
}
