import { test } from '@playwright/test';
import { setupCookieAutoAccept } from '../helpers/cookies.helper';
import { jobsData } from '../data/jobs.data';
import { JobsPage } from '../pages/jobs.page';

test('Search for a job', async ({ page }) => {
  const jobsPage = new JobsPage(page);

  await setupCookieAutoAccept(page);

  await test.step('Open jobs search page', async () => {
    await jobsPage.openHome(jobsData.baseUrl);

    await jobsPage.openJobsSection();

    await jobsPage.openExploreAvailableJobs();
  });

  const finalSearchKeyword = await test.step('Search jobs with fallback', async () => {
    const keyword = await jobsPage.searchWithFallback(jobsData.primarySearch, jobsData.fallbackSearch);
    await jobsPage.expectResultsForKeyword(keyword);
    return keyword;
  });

  await test.step('Open first job and verify title', async () => {
    await jobsPage.openFirstJobFromResults();
    await jobsPage.expectJobTitleContains(finalSearchKeyword);
  });

  await test.step('Save job and verify saved jobs count', async () => {
    await jobsPage.saveCurrentJob();
    await jobsPage.expectSavedJobsCount(1);
  });

  await test.step('Open saved jobs and verify title', async () => {
    await jobsPage.openSavedJobs();
    await jobsPage.expectSavedJobsContainsTitle(finalSearchKeyword);
  });
});