import { expect, type Locator, type Page } from '@playwright/test';
import { CookieBanner } from './cookie-banner.component';

export class JobAlertsComponent {
  private readonly page: Page;
  private readonly cookieBanner: CookieBanner;
  private readonly jobAlertsHeading: Locator;
  private readonly alertEmailInput: Locator;
  private readonly alertCategorySelect: Locator;
  private readonly alertLocationInput: Locator;
  private readonly alertLocationOptions: Locator;
  private readonly alertAddButton: Locator;
  private readonly alertSignUpButton: Locator;
  private readonly alertFeedbackMessages: Locator;
  private readonly selectedAlertsRegion: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cookieBanner = new CookieBanner(page);
    this.jobAlertsHeading = page.getByRole('heading', { name: /get job alerts/i }).first();
    this.alertEmailInput = page.getByRole('textbox', { name: /^email/i }).first();
    this.alertCategorySelect = page.getByRole('combobox', { name: /category/i }).first();
    this.alertLocationInput = page.getByRole('combobox', { name: /location/i }).first();
    this.alertLocationOptions = page.getByRole('option');
    this.alertAddButton = page.getByRole('button', { name: /add job alert|^add$/i }).first();
    this.alertSignUpButton = page.getByRole('button', { name: /sign up|submit job alerts/i }).first();
    this.alertFeedbackMessages = page.locator('text=/thank|success|subscrib|confirmed|job alert/i');
    this.selectedAlertsRegion = page.getByRole('region', { name: /selected job alerts/i }).first();
  }

  async scrollToJobAlerts(): Promise<void> {
    await this.jobAlertsHeading.scrollIntoViewIfNeeded();
    await expect(this.jobAlertsHeading).toBeVisible();
  }

  async fillJobAlertEmail(email: string): Promise<void> {
    await this.alertEmailInput.fill(email);
  }

  async selectJobAlertCategory(category: string): Promise<void> {
    await this.alertCategorySelect.selectOption({ label: category });
  }

  async selectJobAlertLocation(location: string): Promise<void> {
    await this.cookieBanner.acceptIfVisible();
    await this.alertLocationInput.fill(location);

    if (await this.alertLocationOptions.first().isVisible().catch(() => false)) {
      await this.alertLocationOptions.first().click();
      return;
    }

    await this.alertLocationInput.press('ArrowDown');
    await this.alertLocationInput.press('Enter');
  }

  async addJobAlertSelection(): Promise<void> {
    await this.alertAddButton.scrollIntoViewIfNeeded();
    await this.alertAddButton.click({ force: true });
    await expect(this.selectedAlertsRegion).not.toContainText(/no items selected/i);
  }

  async submitJobAlertSignup(): Promise<void> {
    await this.alertSignUpButton.scrollIntoViewIfNeeded();
    await this.alertSignUpButton.click({ force: true });
  }

  async expectJobAlertConfirmation(messagePattern: RegExp): Promise<void> {
    await expect(this.alertFeedbackMessages.first()).toContainText(messagePattern);
  }
}
