import { NextResponse } from 'next/server';
import { TOKEN_COOKIE, USER_COOKIE, getTokenExpiry, type AuthUser } from '@/lib/session';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3000';

export async function POST(request: Request) {
  const { email, password, remember } = (await request.json()) as {
    email: string;
    password: string;
    remember?: boolean;
  };

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
  } catch {
    return NextResponse.json({ message: 'Erreur réseau: backend inaccessible' }, { status: 502 });
  }

  if (!res.ok) {
    return NextResponse.json({ message: 'Email ou mot de passe incorrect' }, { status: 401 });
  }

  const data = (await res.json()) as { accessToken: string; user: AuthUser };
  const exp = getTokenExpiry(data.accessToken);
  const options = {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.COOKIE_SECURE === 'true',
    path: '/',
    ...(remember && exp ? { expires: new Date(exp) } : {}),
  };

  const response = NextResponse.json({ user: data.user });
  response.cookies.set(TOKEN_COOKIE, data.accessToken, options);
  response.cookies.set(USER_COOKIE, JSON.stringify(data.user), options);
  return response;
}
