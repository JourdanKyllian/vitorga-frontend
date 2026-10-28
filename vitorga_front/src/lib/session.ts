export const TOKEN_COOKIE = 'vitorga_token';
export const USER_COOKIE = 'vitorga_user';

export type AuthUser = {
  id: number;
  email: string;
  firstname: string;
  lastname: string;
  role: string;
};

export function getTokenExpiry(token: string): number | null {
  try {
    const part = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(part)) as { exp?: number };
    return typeof payload.exp === 'number' ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

export function isTokenValid(token?: string): boolean {
  if (!token) return false;
  const exp = getTokenExpiry(token);
  return exp !== null && exp > Date.now();
}

export function parseUser(value?: string): AuthUser | null {
  try {
    return value ? (JSON.parse(value) as AuthUser) : null;
  } catch {
    return null;
  }
}
