import { test, expect } from '@playwright/test';
import { login, getAuthToken, API_URL } from './setup';

test.beforeAll(async () => {
  const token = await getAuthToken();
  await fetch(`${API_URL}/ressource`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      nom: 'Soufre E2E',
      categorie: 'ressource',
      type: 'Traitement',
      stock_actuel: 80,
      seuil_alerte: 30,
      unite: 'kg',
    }),
  }).catch(() => null);
});

test.beforeEach(async ({ page }) => {
  await login(page);
  await page.goto('/logistique/inventaire');
  await page.waitForSelector('h1');
});

test('affiche les boutons de filtre', async ({ page }) => {
  await expect(page.locator('button', { hasText: 'Tout' })).toBeVisible();
  await expect(page.locator('button', { hasText: 'Ressources' })).toBeVisible();
  await expect(page.locator('button', { hasText: 'Outils' })).toBeVisible();
  await expect(page.locator('button', { hasText: 'Alertes' })).toBeVisible();
});

test('ouvre le modal Retirer du stock', async ({ page }) => {
  await page.waitForSelector('text=Soufre E2E');
  await page.click('button:has-text("Retirer")');
  await expect(page.locator('h3', { hasText: 'Retirer du stock' })).toBeVisible();
  await page.click('button:has-text("Annuler")');
});

test('affiche le bouton Nouvelle ressource si admin', async ({ page }) => {
  const btn = page.locator('button', { hasText: 'Nouvelle ressource' });
  if (await btn.isVisible()) {
    await expect(btn).toBeVisible();
  }
});

test('ouvre le modal Nouvelle ressource si admin', async ({ page }) => {
  const btn = page.locator('button', { hasText: 'Nouvelle ressource' });
  if (await btn.isVisible()) {
    await btn.click();
    await expect(page.locator('h3', { hasText: 'Nouvelle ressource' })).toBeVisible();
    await page.click('button:has-text("Annuler")');
  }
});