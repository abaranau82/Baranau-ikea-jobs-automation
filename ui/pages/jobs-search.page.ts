import { expect, type Locator, type Page } from '@playwright/test';
import { CookieBanner } from './components/cookie-banner.component';

export class JobsSearchPage {
  private readonly page: Page;
  private readonly cookieBanner: CookieBanner;
  private readonly exploreJobsLink: Locator;
  private readonly keywordInput: Locator;
  private readonly searchJobsButton: Locator;
  private readonly resultsSummary: Locator;
  private readonly searchResultJobLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.cookieBanner = new CookieBanner(page);
    this.exploreJobsLink = page.getByRole('link', { name: /explore available jobs/i });
    this.keywordInput = page.getByRole('searchbox', { name: /keyword search/i });
    this.searchJobsButton = page.locator('button.button--blue[data-last-action="search-submit"]');
    this.resultsSummary = page.locator('text=/\\d+\\s+results?\\s+for/i').first();
    this.searchResultJobLinks = page.locator('main a[href*="/job/"]');
  }

  async openExploreAvailableJobs(): Promise<void> {
    await this.exploreJobsLink.click();
  }

  async searchByKeyword(keyword: string): Promise<void> {
    await this.keywordInput.fill(keyword);
    await this.searchJobsButton.click();
  }

  async searchWithFallback(primaryKeyword: string, fallbackKeyword: string): Promise<string> {
    await this.searchByKeyword(primaryKeyword);
    await this.cookieBanner.acceptIfVisible();

    const primaryResultsCount = await this.getResultsCount();
    if (primaryResultsCount === 0) {
      await this.searchByKeyword(fallbackKeyword);
      await this.cookieBanner.acceptIfVisible();
      return fallbackKeyword;
    }

    return primaryKeyword;
  }

  async getResultsCount(): Promise<number> {
    await expect(this.resultsSummary).toBeVisible();
    const summaryText = await this.resultsSummary.innerText();
    const match = summaryText.match(/(\d+)\s+results?\s+for/i);

    if (!match) {
      throw new Error(`Unable to parse results count from: ${summaryText}`);
    }

    return Number.parseInt(match[1], 10);
  }

  async expectResultsForKeyword(keyword: string): Promise<void> {
    await expect(this.resultsSummary).toContainText(new RegExp(`results?\\s+for\\s+${this.escapeForRegex(keyword)}`, 'i'));
  }

  async openFirstJobFromResults(): Promise<void> {
    const resultJobUrls = await this.searchResultJobLinks.evaluateAll((links) => {
      const uniqueUrls = new Set<string>();
      for (const link of links) {
        const url = (link as HTMLAnchorElement).href;
        if (url && !uniqueUrls.has(url)) {
          uniqueUrls.add(url);
        }
      }
      return Array.from(uniqueUrls);
    });

    for (const jobUrl of resultJobUrls.slice(0, 8)) {
      await this.page.goto(jobUrl);
      await this.cookieBanner.acceptIfVisible();

      const saveJobButton = this.page.locator('button[data-default-text="Save"]:visible').first();
      if (await saveJobButton.isVisible().catch(() => false)) {
        return;
      }
    }

    throw new Error('Could not find a searchable job with visible Save button in first results');
  }

  private escapeForRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
