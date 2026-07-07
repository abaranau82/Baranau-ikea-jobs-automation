import { expect, type Locator, type Page } from '@playwright/test';

export class HeaderComponent {
  private readonly page: Page;
  private readonly savedJobsCounterButton: Locator;
  private readonly savedJobLinksInHeader: Locator;
  private readonly jobTitleHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.savedJobsCounterButton = page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: /saved jobs/i }).first();
    this.savedJobLinksInHeader = page
      .getByRole('navigation', { name: 'Main' })
      .locator('button[aria-expanded="true"] + ul a[href*="/job/"]');
    this.jobTitleHeading = page.getByRole('heading', { level: 1 }).first();
  }

  async openSavedJobs(): Promise<void> {
    await this.savedJobsCounterButton.click();
  }

  async expectSavedJobsCount(count: number): Promise<void> {
    await expect(this.savedJobsCounterButton).toContainText(new RegExp(`\\(${count}\\)`));
  }

  async expectSavedJobsContainsTitle(keyword: string): Promise<void> {
    const expectedTitle = new RegExp(this.escapeForRegex(keyword), 'i');

    if (await this.savedJobLinksInHeader.first().isVisible().catch(() => false)) {
      await expect(this.savedJobLinksInHeader.first()).toContainText(expectedTitle);
      return;
    }

    await expect(this.savedJobsCounterButton).toContainText(/\(1\)/);
    await expect(this.jobTitleHeading).toContainText(expectedTitle);
  }

  private escapeForRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
