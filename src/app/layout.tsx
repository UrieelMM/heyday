import type { Metadata } from 'next';
import {
  Cinzel,
  Cormorant_Garamond,
  Fredoka,
  Great_Vibes,
  Inter,
  JetBrains_Mono,
  Montserrat,
  Pinyon_Script,
  Playfair_Display,
  Plus_Jakarta_Sans,
  Space_Grotesk,
  Syne,
} from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-playfair',
});
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['500', '700'],
  variable: '--font-cinzel',
});
const syne = Syne({
  subsets: ['latin'],
  weight: ['600', '700', '800'],
  variable: '--font-syne',
});
const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['500', '600', '700'],
  variable: '--font-fredoka',
});
const pinyon = Pinyon_Script({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-pinyon',
});
const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-great-vibes',
});
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jakarta',
});
const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-montserrat',
});
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains',
});
const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-space',
});

export const metadata: Metadata = {
  title: 'Atelier Invitaciones — Plataforma de Invitaciones Digitales Interactivas',
  description:
    'Crea, personaliza y administra invitaciones digitales premium con animaciones scrollytelling, links por invitado, confirmación RSVP y pases QR.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      data-scroll-behavior="smooth"
      className={[
        cormorant.variable,
        playfair.variable,
        cinzel.variable,
        syne.variable,
        fredoka.variable,
        pinyon.variable,
        greatVibes.variable,
        jakarta.variable,
        montserrat.variable,
        inter.variable,
        jetbrains.variable,
        spaceGrotesk.variable,
      ].join(' ')}
    >
      <body className="min-h-dvh bg-[#faf9f5] font-[var(--font-inter)] text-[#141413] antialiased">
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
