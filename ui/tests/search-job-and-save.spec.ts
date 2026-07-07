import { test } from './fixtures';
import { jobsData } from '../data/jobs.data';

test('Search for a job', async ({ homePage, jobsSearchPage, jobDetailsPage, headerComponent }) => {
  await test.step('Open jobs search page', async () => {
    await homePage.openHome(jobsData.baseUrl);

    await homePage.openJobsSection();

    await jobsSearchPage.openExploreAvailableJobs();
  });

  const finalSearchKeyword = await test.step('Search jobs with fallback', async () => {
    const keyword = await jobsSearchPage.searchWithFallback(jobsData.primarySearch, jobsData.fallbackSearch);
    await jobsSearchPage.expectResultsForKeyword(keyword);
    return keyword;
  });

  await test.step('Open first job and verify title', async () => {
    await jobsSearchPage.openFirstJobFromResults();
    await jobDetailsPage.expectJobTitleContains(finalSearchKeyword);
  });

  await test.step('Save job and verify saved jobs count', async () => {
    await jobDetailsPage.saveCurrentJob();
    await headerComponent.expectSavedJobsCount(1);
  });

  await test.step('Open saved jobs and verify title', async () => {
    await headerComponent.openSavedJobs();
    await headerComponent.expectSavedJobsContainsTitle(finalSearchKeyword);
  });
});