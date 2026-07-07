import { type Locator, type Page } from '@playwright/test';

export class CookieBanner {
  private readonly page: Page;
  private readonly systemAlertAcceptButton: Locator;
  private readonly modalAcceptButton: Locator;
  private readonly inlineAcceptButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.systemAlertAcceptButton = page.locator('#system-ialert').getByRole('button', { name: /^accept$/i }).first();
    this.modalAcceptButton = page.getByRole('dialog').getByRole('button', { name: /^accept$/i }).first();
    this.inlineAcceptButtons = page.getByRole('button', { name: /accept/i });
  }

  async acceptIfVisible(): Promise<void> {
    if (await this.systemAlertAcceptButton.isVisible().catch(() => false)) {
      await this.systemAlertAcceptButton.click({ force: true });
      await this.waitForBannerHidden();
      return;
    }

    if (await this.modalAcceptButton.isVisible().catch(() => false)) {
      await this.modalAcceptButton.click();
      await this.waitForBannerHidden();
      return;
    }

    const inlineAcceptButton = this.inlineAcceptButtons.first();
    if (await inlineAcceptButton.isVisible().catch(() => false)) {
      await inlineAcceptButton.click();
      await this.waitForBannerHidden();
    }
  }

  private async waitForBannerHidden(): Promise<void> {
    await Promise.all([
      this.page.waitForSelector('#system-ialert', { state: 'hidden', timeout: 5000 }).catch(() => {}),
      this.page.waitForSelector('dialog', { state: 'hidden', timeout: 5000 }).catch(() => {}),
    ]);
  }
}
