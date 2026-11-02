import type { Metadata } from 'next';
import '@fontsource-variable/cormorant-garamond/wght.css';
import '@fontsource-variable/cormorant-garamond/wght-italic.css';
import '@fontsource-variable/playfair-display/wght.css';
import '@fontsource-variable/cinzel/wght.css';
import '@fontsource-variable/syne/wght.css';
import '@fontsource-variable/fredoka/wght.css';
import '@fontsource/pinyon-script/latin-400.css';
import '@fontsource/great-vibes/latin-400.css';
import '@fontsource-variable/plus-jakarta-sans/wght.css';
import '@fontsource-variable/montserrat/wght.css';
import '@fontsource-variable/inter/wght.css';
import '@fontsource-variable/jetbrains-mono/wght.css';
import '@fontsource-variable/space-grotesk/wght.css';
import { Toaster } from 'sonner';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://heyday.party'),
  title: 'HeyDay — Invitaciones digitales para celebrar tu historia',
  description:
    'Invitaciones digitales interactivas para tu celebración. Diseños únicos, invitados ilimitados, RSVP y pases digitales con QR.',
  icons: { icon: '/icon.svg' },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" data-scroll-behavior="smooth">
      <body className="min-h-dvh bg-[#faf9f5] font-[var(--font-inter)] text-[#141413] antialiased">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
