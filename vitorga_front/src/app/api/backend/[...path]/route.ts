import { NextResponse, type NextRequest } from 'next/server';
import { TOKEN_COOKIE, USER_COOKIE } from '@/lib/session';

const BACKEND_URL = process.env.BACKEND_URL ?? 'http://localhost:3000';

async function forward(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  const token = request.cookies.get(TOKEN_COOKIE)?.value;

  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  if (contentType) headers.set('content-type', contentType);
  if (token) headers.set('authorization', `Bearer ${token}`);

  const hasBody = !['GET', 'HEAD'].includes(request.method);

  let res: Response;
  try {
    res = await fetch(`${BACKEND_URL}/${path.join('/')}${request.nextUrl.search}`, {
      method: request.method,
      headers,
      body: hasBody ? await request.arrayBuffer() : undefined,
      cache: 'no-store',
    });
  } catch {
    return NextResponse.json({ message: 'Backend inaccessible' }, { status: 502 });
  }

  const response = new NextResponse(res.body, {
    status: res.status,
    headers: { 'content-type': res.headers.get('content-type') ?? 'application/json' },
  });

  if (res.status === 401) {
    response.cookies.delete(TOKEN_COOKIE);
    response.cookies.delete(USER_COOKIE);
  }
  return response;
}

export { forward as GET, forward as POST, forward as PUT, forward as PATCH, forward as DELETE };
