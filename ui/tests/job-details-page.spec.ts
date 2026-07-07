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
import { test } from './fixtures';
import { jobsData } from '../data/jobs.data';

test('Validate job details page essentials', async ({ homePage, jobsSearchPage, jobDetailsPage }) => {

  await test.step('Open jobs search page', async () => {
    await homePage.openHome(jobsData.baseUrl);

    await homePage.openJobsSection();

    await jobsSearchPage.openExploreAvailableJobs();
  });

  await test.step('Find jobs by keyword with fallback', async () => {
    const finalKeyword = await jobsSearchPage.searchWithFallback(jobsData.primarySearch, jobsData.fallbackSearch);
    await jobsSearchPage.expectResultsForKeyword(finalKeyword);
  });

  await test.step('Open job and verify details blocks', async () => {
    await jobsSearchPage.openFirstJobFromResults();
    await jobDetailsPage.expectOnJobDetailsPage();
    await jobDetailsPage.expectJobDescriptionVisible();
    await jobDetailsPage.expectApplyLinkIsValid();
  });
});
// Overall, the test is clean and maintainable, and Copilot feedback has been addressed well (env configurability, cookie handler scoping, unique email generation, trace policy