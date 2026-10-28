import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const supabaseResponse = await updateSession(request);

  if (pathname.startsWith('/dashboard')) {
    const adminCookie = request.cookies.get('atelier_admin_session')?.value;
    if (adminCookie !== 'authenticated') {
      const loginUrl = new URL('/login', request.url);
      if (search) {
        loginUrl.search = search;
      }
      const redirect = NextResponse.redirect(loginUrl);
      supabaseResponse.cookies.getAll().forEach((cookie) =>
        redirect.cookies.set(cookie)
      );
      for (const header of ['cache-control', 'expires', 'pragma']) {
        const value = supabaseResponse.headers.get(header);
        if (value) redirect.headers.set(header, value);
      }
      return redirect;
    }
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
