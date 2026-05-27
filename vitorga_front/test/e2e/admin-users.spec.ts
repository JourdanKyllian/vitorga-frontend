import { test, expect } from '@playwright/test';
import { login } from './setup';

test.beforeEach(async ({ page }) => {
  await login(page);
  await page.goto('/admin/users');
  await page.waitForSelector('h1');
});

test('vide la recherche affiche tous les users', async ({ page }) => {
  const search = page.locator('input[placeholder*="Rechercher"]');
  await search.fill('xxxxxxxxxxx');
  await page.waitForTimeout(300);
  await search.clear();
  await page.waitForTimeout(300);
  const rows = page.locator('table tbody tr');
  await expect(rows.first()).toBeVisible();
});

test('affiche le bouton Ajouter un utilisateur', async ({ page }) => {
  await expect(
    page.locator('button', { hasText: 'Ajouter un utilisateur' }),
  ).toBeVisible();
});

test('ouvre le modal Ajouter un utilisateur', async ({ page }) => {
  await page.click('button:has-text("Ajouter un utilisateur")');
  await expect(page.locator('h3', { hasText: 'Ajouter un utilisateur' })).toBeVisible();
});

test('affiche les compteurs Total et Actifs', async ({ page }) => {
  await expect(page.locator('text=Total:')).toBeVisible();
  await expect(page.locator('text=Actifs:')).toBeVisible();
});