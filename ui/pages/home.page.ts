import { type Locator, type Page } from '@playwright/test';

export class HomePage {
  private readonly page: Page;
  private readonly jobsLink: Locator;

  constructor(page: Page) {
    this.page = page;
    this.jobsLink = page.getByRole('link', { name: /jobs/i });
  }

  async openHome(baseUrl: string): Promise<void> {
    await this.page.goto(baseUrl);
  }

  async openJobsSection(): Promise<void> {
    await this.jobsLink.click();
  }
}
