import type { Metadata } from 'next';
import { Suspense } from 'react';
import Script from 'next/script';
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
import { MetaPixelPageView } from '@/components/analytics/MetaPixelPageView';
import './globals.css';

const META_PIXEL_ID = '1791698182053124';

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
        <Script id="meta-pixel" strategy="beforeInteractive">
          {`!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init','${META_PIXEL_ID}');fbq('track','PageView');`}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        <Suspense fallback={null}>
          <MetaPixelPageView />
        </Suspense>
        {children}
        <Toaster position="top-center" richColors />
      </body>
    </html>
  );
}
