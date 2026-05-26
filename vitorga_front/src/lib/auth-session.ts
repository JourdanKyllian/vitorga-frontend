const TOKEN_KEY = 'accessToken';
const USER_KEY = 'user';

export type AuthUser = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
};

export function getAccessToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY) ?? localStorage.getItem(TOKEN_KEY);
}

function getAuthStorage(): Storage | null {
  if (sessionStorage.getItem(TOKEN_KEY)) return sessionStorage;
  if (localStorage.getItem(TOKEN_KEY)) return localStorage;
  return null;
}

export function setAuth(token: string, user: AuthUser, remember: boolean): void {
  clearAuth();
  const storage = remember ? localStorage : sessionStorage;
  storage.setItem(TOKEN_KEY, token);
  storage.setItem(USER_KEY, JSON.stringify(user));
}

export function clearAuth(): void {
  for (const storage of [localStorage, sessionStorage]) {
    storage.removeItem(TOKEN_KEY);
    storage.removeItem(USER_KEY);
  }
}

export function isTokenValid(): boolean {
  const token = getAccessToken();
  if (!token) return false;
  try {
    const payload = JSON.parse(atob(token.split('.')[1])) as { exp?: number };
    if (typeof payload.exp !== 'number') return false;
    return payload.exp * 1000 > Date.now();
  } catch {
    return false;
  }
}

export function getCurrentUser(): AuthUser | null {
  try {
    const storage = getAuthStorage();
    if (!storage) return null;
    const user = storage.getItem(USER_KEY);
    return user ? (JSON.parse(user) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function getCurrentUserRole(): string {
  try {
    const token = getAccessToken();
    if (!token) return '';
    const payload = JSON.parse(atob(token.split('.')[1])) as { role?: string };
    return payload.role ?? '';
  } catch {
    return '';
  }
}
