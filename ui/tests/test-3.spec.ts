/**
 * Scenario 3 (custom): Validate essential blocks on a real job details page.
 *
 * Flow:
 * 1) Open IKEA jobs portal through the main website navigation.
 * 2) Search by primary keyword and fallback to a secondary keyword if needed.
 * 3) Open a job result and verify key details page elements:
 *    - URL is a job details URL (/job/)
 *    - Job Description section is visible
 *    - Apply link is visible and has a valid absolute URL
 */
import { test } from '@playwright/test';
import { jobsData } from '../data/jobs.data';
import { setupCookieAutoAccept } from '../helpers/cookies.helper';
import { JobsPage } from '../pages/jobs.page';

test('Validate job details page essentials', async ({ page }) => {
  const jobsPage = new JobsPage(page);

  await setupCookieAutoAccept(page);

  await test.step('Open jobs search page', async () => {
    await jobsPage.openHome(jobsData.baseUrl);

    await jobsPage.openJobsSection();

    await jobsPage.openExploreAvailableJobs();
  });

  await test.step('Find jobs by keyword with fallback', async () => {
    const finalKeyword = await jobsPage.searchWithFallback(jobsData.primarySearch, jobsData.fallbackSearch);
    await jobsPage.expectResultsForKeyword(finalKeyword);
  });

  await test.step('Open job and verify details blocks', async () => {
    await jobsPage.openFirstJobFromResults();
    await jobsPage.expectOnJobDetailsPage();
    await jobsPage.expectJobDescriptionVisible();
    await jobsPage.expectApplyLinkIsValid();
  });
});
// Overall, the test is clean and maintainable, and Copilot feedback has been addressed well (env configurability, cookie handler scoping, unique email generation, trace policy).