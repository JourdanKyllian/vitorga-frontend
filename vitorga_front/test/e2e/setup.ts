import { Page } from '@playwright/test';

export const API_URL = 'http://localhost:3000';

export async function login(
  page: Page,
  email = 'admin@test.fr',
  password = '123456',
): Promise<void> {
  await page.goto('/login');
  await page.fill('input[type="email"]', email);
  await page.fill('input[type="password"]', password);
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
}

export async function seedTestUser(): Promise<void> {
  await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      firstname: 'Admin',
      lastname: 'Test',
      email: 'admin@test.fr',
      password: '123456',
    }),
  }).catch(() => null);
}

export async function getAuthToken(): Promise<string> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@test.fr', password: '123456' }),
  });
  const data = await res.json() as { accessToken: string };
  return data.accessToken;
}