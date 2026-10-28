import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { SessionProvider } from '@/components/SessionProvider';
import { TOKEN_COOKIE, USER_COOKIE, isTokenValid, parseUser } from '@/lib/session';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const store = await cookies();
  if (!isTokenValid(store.get(TOKEN_COOKIE)?.value)) redirect('/login');

  const user = parseUser(store.get(USER_COOKIE)?.value);

  return (
    <SessionProvider user={user}>
      <div className="min-h-screen bg-cream">
        <Sidebar />
        <main className="ml-64 p-8">{children}</main>
      </div>
    </SessionProvider>
  );
}
