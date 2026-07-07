import { expect, type Locator, type Page } from '@playwright/test';
import { CookieBanner } from './components/cookie-banner.component';

export class JobDetailsPage {
  private readonly page: Page;
  private readonly cookieBanner: CookieBanner;
  private readonly jobTitleHeading: Locator;
  private readonly jobDescriptionHeading: Locator;
  private readonly applyJobLink: Locator;
  private readonly saveJobButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cookieBanner = new CookieBanner(page);
    this.jobTitleHeading = page.getByRole('heading', { level: 1 }).first();
    this.jobDescriptionHeading = page.getByRole('heading', { name: /job description/i }).first();
    this.applyJobLink = page.getByRole('link', { name: /apply/i }).first();
    this.saveJobButton = page.locator('button[data-default-text="Save"]:visible').first();
  }

  async expectOnJobDetailsPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/job\//i);
  }

  async expectJobDescriptionVisible(): Promise<void> {
    await expect(this.jobDescriptionHeading).toBeVisible();
  }

  async expectApplyLinkIsValid(): Promise<void> {
    await expect(this.applyJobLink).toBeVisible();
    await expect(this.applyJobLink).toHaveAttribute('href', /https?:\/\//i);
  }

  async saveCurrentJob(): Promise<void> {
    await this.cookieBanner.acceptIfVisible();
    await this.saveJobButton.click();
    await expect(this.saveJobButton).toContainText(/saved/i);
  }

  async expectJobTitleContains(keyword: string): Promise<void> {
    await expect(this.jobTitleHeading).toContainText(new RegExp(this.escapeForRegex(keyword), 'i'));
  }

  private escapeForRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
