import type { Page } from '@playwright/test';

export async function setupCookieAutoAccept(page: Page): Promise<void> {
  await page.addLocatorHandler(page.locator('#system-ialert'), async () => {
    const acceptButton = page.locator('#system-ialert').getByRole('button', { name: /^accept$/i }).first();
    if (await acceptButton.isVisible().catch(() => false)) {
      await acceptButton.click({ force: true });
    }
  });

  await page.addLocatorHandler(page.getByRole('dialog').filter({ hasText: /cookie|cookies/i }), async () => {
    const acceptButton = page.getByRole('dialog').getByRole('button', { name: /^accept$/i }).first();
    if (await acceptButton.isVisible().catch(() => false)) {
      await acceptButton.click({ force: true });
    }
  });
}
