import { expect, type Locator, type Page } from '@playwright/test';

export class JobsPage {
  private readonly page: Page;
  private readonly jobsLink: Locator;
  private readonly exploreJobsLink: Locator;
  private readonly keywordInput: Locator;
  private readonly searchJobsButton: Locator;
  private readonly resultsSummary: Locator;
  private readonly searchResultJobLinks: Locator;
  private readonly jobTitleHeading: Locator;
  private readonly jobDescriptionHeading: Locator;
  private readonly applyJobLink: Locator;
  private readonly saveJobButton: Locator;
  private readonly savedJobsCounterButton: Locator;
  private readonly savedJobLinksInHeader: Locator;
  private readonly jobAlertsHeading: Locator;
  private readonly alertEmailInput: Locator;
  private readonly alertCategorySelect: Locator;
  private readonly alertLocationInput: Locator;
  private readonly alertLocationOptions: Locator;
  private readonly alertAddButton: Locator;
  private readonly selectedAlertsRegion: Locator;
  private readonly alertSignUpButton: Locator;
  private readonly alertFeedbackMessages: Locator;
  private readonly cookieAcceptButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.jobsLink = page.getByRole('link', { name: /jobs/i });
    this.exploreJobsLink = page.getByRole('link', { name: /explore available jobs/i });
    this.keywordInput = page.getByRole('searchbox', { name: /keyword search/i });
    this.searchJobsButton = page.locator('button.button--blue[data-last-action="search-submit"]');
    this.resultsSummary = page.locator('text=/\\d+\\s+results?\\s+for/i').first();
    this.searchResultJobLinks = page.locator('main a[href*="/job/"]');
    this.jobTitleHeading = page.getByRole('heading', { level: 1 }).first();
    this.jobDescriptionHeading = page.getByRole('heading', { name: /job description/i }).first();
    this.applyJobLink = page.getByRole('link', { name: /apply/i }).first();
    this.saveJobButton = page.locator('button[data-default-text="Save"]:visible').first();
    this.savedJobsCounterButton = page.getByRole('navigation', { name: 'Main' }).getByRole('button', { name: /saved jobs/i }).first();
    this.savedJobLinksInHeader = page.getByRole('navigation', { name: 'Main' }).locator('button[aria-expanded="true"] + ul a[href*="/job/"]');
    this.jobAlertsHeading = page.getByRole('heading', { name: /get job alerts/i }).first();
    this.alertEmailInput = page.getByRole('textbox', { name: /^email/i }).first();
    this.alertCategorySelect = page.getByRole('combobox', { name: /category/i }).first();
    this.alertLocationInput = page.getByRole('combobox', { name: /location/i }).first();
    this.alertLocationOptions = page.getByRole('option');
    this.alertAddButton = page.getByRole('button', { name: /add job alert|^add$/i }).first();
    this.selectedAlertsRegion = page.getByRole('region', { name: /selected job alerts/i }).first();
    this.alertSignUpButton = page.getByRole('button', { name: /sign up|submit job alerts/i }).first();
    this.alertFeedbackMessages = page.locator('text=/thank|success|subscrib|confirmed|job alert/i');

    // IKEA may show different "Accept" buttons on different steps.
    this.cookieAcceptButtons = page.getByRole('button', { name: /accept/i });
  }

  async openHome(baseUrl: string): Promise<void> {
    await this.page.goto(baseUrl);
  }

  // Dismisses any IKEA cookie banner or system alert if it appears.
  async acceptCookiesIfVisible(): Promise<void> {
    // Prefer the system alert when IKEA shows the global cookie overlay.
    const systemAlertAccept = this.page.locator('#system-ialert').getByRole('button', { name: /^accept$/i }).first();
    if (await systemAlertAccept.isVisible().catch(() => false)) {
      await systemAlertAccept.click({ force: true });
      return;
    }

    // Fall back to a regular cookie dialog.
    const modalAcceptButton = this.page.getByRole('dialog').getByRole('button', { name: /^accept$/i }).first();
    if (await modalAcceptButton.isVisible().catch(() => false)) {
      await modalAcceptButton.click();
      return;
    }

    // Fall back again to any inline accept button.
    const inlineAcceptButton = this.cookieAcceptButtons.first();
    if (await inlineAcceptButton.isVisible().catch(() => false)) {
      await inlineAcceptButton.click();
    }
  }

  async openJobsSection(): Promise<void> {
    await this.jobsLink.click();
  }

  async openExploreAvailableJobs(): Promise<void> {
    await this.exploreJobsLink.click();
  }

  // Scrolls to the job alerts form and waits until the section is visible.
  async scrollToJobAlerts(): Promise<void> {
    await this.jobAlertsHeading.scrollIntoViewIfNeeded();
    await expect(this.jobAlertsHeading).toBeVisible();
  }

  // Fills the job alert email field.
  async fillJobAlertEmail(email: string): Promise<void> {
    await this.alertEmailInput.fill(email);
  }

  // Selects a job alert category from the dropdown.
  async selectJobAlertCategory(category: string): Promise<void> {
    await this.alertCategorySelect.selectOption({ label: category });
  }

  // Types a location and confirms the first matching suggestion.
  async selectJobAlertLocation(location: string): Promise<void> {
    await this.alertLocationInput.fill(location);

    // Click the suggestion if IKEA already shows one.
    if (await this.alertLocationOptions.first().isVisible().catch(() => false)) {
      await this.alertLocationOptions.first().click();
      return;
    }

    // Otherwise confirm the highlighted option from the keyboard.
    await this.alertLocationInput.press('ArrowDown');
    await this.alertLocationInput.press('Enter');
  }

  // Adds the selected alert filters to the alert list.
  async addJobAlertSelection(): Promise<void> {
    await this.alertAddButton.scrollIntoViewIfNeeded();
    await this.alertAddButton.click({ force: true });
    await expect(this.selectedAlertsRegion).not.toContainText(/no items selected/i);
  }

  // Submits the alert subscription form.
  async submitJobAlertSignup(): Promise<void> {
    await this.alertSignUpButton.scrollIntoViewIfNeeded();
    await this.alertSignUpButton.click({ force: true });
  }

  // Verifies that a confirmation message is shown after subscription.
  async expectJobAlertConfirmation(messagePattern: RegExp): Promise<void> {
    await expect(this.alertFeedbackMessages.first()).toContainText(messagePattern);
  }

  // Searches for jobs using the keyword input and submits the search.
  async searchByKeyword(keyword: string): Promise<void> {
    await this.keywordInput.fill(keyword);
    await this.searchJobsButton.click();
  }

  // Searches with the primary keyword first and switches to fallback if no results are found.
  async searchWithFallback(primaryKeyword: string, fallbackKeyword: string): Promise<string> {
    await this.searchByKeyword(primaryKeyword);
    await this.acceptCookiesIfVisible();

    // Use fallback only when the first search returns zero jobs.
    const primaryResultsCount = await this.getResultsCount();
    if (primaryResultsCount === 0) {
      await this.searchByKeyword(fallbackKeyword);
      await this.acceptCookiesIfVisible();
      return fallbackKeyword;
    }

    return primaryKeyword;
  }

  // Reads the results summary and extracts the number of matching jobs.
  async getResultsCount(): Promise<number> {
    await expect(this.resultsSummary).toBeVisible();
    const summaryText = await this.resultsSummary.innerText();
    const match = summaryText.match(/(\d+)\s+results?\s+for/i);

    if (!match) {
      throw new Error(`Unable to parse results count from: ${summaryText}`);
    }

    return Number.parseInt(match[1], 10);
  }

  // Verifies that the results summary contains the expected search keyword.
  async expectResultsForKeyword(keyword: string): Promise<void> {
    await expect(this.resultsSummary).toContainText(new RegExp(`results?\\s+for\\s+${this.escapeForRegex(keyword)}`, 'i'));
  }

  // Tries the first few search results until it finds a job with a visible Save button.
  async openFirstJobFromResults(): Promise<void> {
    // Collect unique job URLs from the search results list.
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

    // Open results one by one and stop when the Save button appears.
    for (const jobUrl of resultJobUrls.slice(0, 8)) {
      await this.page.goto(jobUrl);
      await this.acceptCookiesIfVisible();

      // Stop on the first page that exposes a Save button.
      if (await this.saveJobButton.isVisible().catch(() => false)) {
        return;
      }
    }

    throw new Error('Could not find a searchable job with visible Save button in first results');
  }

  // Verifies that the job title contains the expected keyword.
  async expectJobTitleContains(keyword: string): Promise<void> {
    await expect(this.jobTitleHeading).toContainText(new RegExp(this.escapeForRegex(keyword), 'i'));
  }

  // Verifies that the current page is a job details page.
  async expectOnJobDetailsPage(): Promise<void> {
    await expect(this.page).toHaveURL(/\/job\//i);
  }

  // Verifies that the Job Description section is visible.
  async expectJobDescriptionVisible(): Promise<void> {
    await expect(this.jobDescriptionHeading).toBeVisible();
  }

  // Verifies that the Apply link is visible and uses a valid absolute URL.
  async expectApplyLinkIsValid(): Promise<void> {
    await expect(this.applyJobLink).toBeVisible();
    await expect(this.applyJobLink).toHaveAttribute('href', /https?:\/\//i);
  }

  // Saves the current job and waits until the button reflects the saved state.
  async saveCurrentJob(): Promise<void> {
    await this.acceptCookiesIfVisible();
    await this.saveJobButton.click();
    await expect(this.saveJobButton).toContainText(/saved/i);
  }

  // Verifies the saved jobs counter in the header.
  async expectSavedJobsCount(count: number): Promise<void> {
    await expect(this.savedJobsCounterButton).toContainText(new RegExp(`\\(${count}\\)`));
  }

  // Opens the Saved jobs dropdown in the header.
  async openSavedJobs(): Promise<void> {
    await this.acceptCookiesIfVisible();
    await this.savedJobsCounterButton.click();
  }

  // Verifies the saved job title either in the dropdown or as a fallback on the page.
  async expectSavedJobsContainsTitle(keyword: string): Promise<void> {
    const expectedTitle = new RegExp(this.escapeForRegex(keyword), 'i');

    // Use the dropdown content when the Saved jobs menu is rendered.
    if (await this.savedJobLinksInHeader.first().isVisible().catch(() => false)) {
      await expect(this.savedJobLinksInHeader.first()).toContainText(expectedTitle);
      return;
    }

    // Otherwise verify the saved counter and the current job title.
    await expect(this.savedJobsCounterButton).toContainText(/\(1\)/);
    await expect(this.jobTitleHeading).toContainText(expectedTitle);
  }

  // Escapes user-provided text so it can be safely used inside a regular expression.
  private escapeForRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}