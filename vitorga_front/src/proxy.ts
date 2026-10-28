import { NextResponse, type NextRequest } from 'next/server';
import { TOKEN_COOKIE, USER_COOKIE, isTokenValid } from '@/lib/session';

export function proxy(request: NextRequest) {
  const authenticated = isTokenValid(request.cookies.get(TOKEN_COOKIE)?.value);

  if (request.nextUrl.pathname === '/login') {
    return authenticated
      ? NextResponse.redirect(new URL('/dashboard', request.url))
      : NextResponse.next();
  }

  if (!authenticated) {
    const response = NextResponse.redirect(new URL('/login', request.url));
    response.cookies.delete(TOKEN_COOKIE);
    response.cookies.delete(USER_COOKIE);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*', '/admin/:path*', '/logistique/:path*'],
};
