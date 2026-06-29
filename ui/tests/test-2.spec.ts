import { test } from '@playwright/test';
import { jobsData } from '../data/jobs.data';
import { setupCookieAutoAccept } from '../helpers/cookies.helper';
import { generateUniqueEmail } from '../helpers/generators.helper';
import { JobsPage } from '../pages/jobs.page';

test('Subscribe for a job alert', async ({ page }) => {
  const jobsPage = new JobsPage(page);
  const uniqueEmail = generateUniqueEmail();

  await setupCookieAutoAccept(page);

  await test.step('Open jobs portal', async () => {
    await jobsPage.openHome(jobsData.baseUrl);

    await jobsPage.openJobsSection();

    await jobsPage.openExploreAvailableJobs();
  });

  await test.step('Fill subscription form', async () => {
    await jobsPage.scrollToJobAlerts();
    await jobsPage.fillJobAlertEmail(uniqueEmail);
    await jobsPage.selectJobAlertCategory(jobsData.jobAlertCategory);
    await jobsPage.selectJobAlertLocation(jobsData.jobAlertLocation);
    await jobsPage.addJobAlertSelection();
  });

  await test.step('Sign up and verify confirmation', async () => {
    await jobsPage.submitJobAlertSignup();
    await jobsPage.expectJobAlertConfirmation(jobsData.jobAlertConfirmationPattern);
  });
});
