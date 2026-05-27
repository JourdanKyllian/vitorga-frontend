import { test, expect } from '@playwright/test';
import { login, seedTestUser } from './setup';

test.beforeAll(async () => {
  await seedTestUser();
});

test.beforeEach(async ({ page }) => {
  await login(page);
});

test('affiche le dropdown de parcelles', async ({ page }) => {
  const dropdown = page.locator('button[class*="min-w"]');
  await expect(dropdown).toBeVisible();
  await expect(dropdown).toContainText('Toutes les parcelles');
});

test('ouvre le dropdown et affiche les options', async ({ page }) => {
  await page.click('button[class*="min-w"]');
  await expect(page.locator('text=Toutes les parcelles').last()).toBeVisible();
});

test('affiche les graphiques', async ({ page }) => {
  const charts = page.locator('.recharts-wrapper');
  await expect(charts.first()).toBeVisible({ timeout: 5000 });
});

test('ouvre le modal Nouvelle parcelle si admin', async ({ page }) => {
  const btn = page.locator('button', { hasText: 'Nouvelle parcelle' });
  if (await btn.isVisible()) {
    await btn.click();
    await expect(page.locator('h3', { hasText: 'Nouvelle parcelle' })).toBeVisible();
    await page.keyboard.press('Escape');
  }
});