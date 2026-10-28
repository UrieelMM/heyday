import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith('/dashboard')) {
    const adminCookie = request.cookies.get('atelier_admin_session')?.value;
    if (adminCookie !== 'authenticated') {
      const loginUrl = new URL('/login', request.url);
      if (search) {
        loginUrl.search = search;
      }
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
