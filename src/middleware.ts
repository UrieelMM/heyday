import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const { response: supabaseResponse, supabase, userId } = await updateSession(request);

  if (pathname.startsWith('/dashboard')) {
    let authorized = false;
    if (userId) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();
      authorized = !error && ['agency_admin', 'superadmin'].includes(profile?.role ?? '');
    }

    if (!authorized) {
      const loginUrl = new URL('/login', request.url);
      const template = request.nextUrl.searchParams.get('template');
      if (template && /^[a-z0-9-]{1,60}$/.test(template)) {
        loginUrl.searchParams.set('template', template);
      }
      if (userId) loginUrl.searchParams.set('reason', 'unauthorized');
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
