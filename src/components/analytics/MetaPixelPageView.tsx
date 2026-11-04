'use client';

import { useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

// The base snippet records the first page load. This tracks client-side navigation.
let lastTrackedUrl: string | null = null;

export function MetaPixelPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();

  useEffect(() => {
    const url = `${pathname}${search ? `?${search}` : ''}`;

    if (lastTrackedUrl === null) {
      // Read the browser URL so hydration of search params cannot count the
      // initial page load twice.
      lastTrackedUrl = `${window.location.pathname}${window.location.search}`;
      return;
    }

    if (lastTrackedUrl !== url) {
      lastTrackedUrl = url;
      const pixelWindow = window as typeof window & {
        fbq?: (...args: string[]) => void;
      };
      pixelWindow.fbq?.('track', 'PageView');
    }
  }, [pathname, search]);

  return null;
}
