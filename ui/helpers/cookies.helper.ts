import type { Page } from '@playwright/test';

export async function setupCookieAutoAccept(page: Page): Promise<void> {
  const systemAlert = page.locator('#system-ialert').first();
  await page.addLocatorHandler(systemAlert, async () => {
    const acceptButton = systemAlert.getByRole('button', { name: /^accept$/i }).first();
    if (await acceptButton.isVisible().catch(() => false)) {
      await acceptButton.click({ force: true });
    }
  });

  const cookieDialog = page.getByRole('dialog').filter({ hasText: /cookie|cookies/i }).first();
  await page.addLocatorHandler(cookieDialog, async () => {
    const acceptButton = cookieDialog.getByRole('button', { name: /^accept$/i }).first();
    if (await acceptButton.isVisible().catch(() => false)) {
      await acceptButton.click({ force: true });
    }
  });
}
