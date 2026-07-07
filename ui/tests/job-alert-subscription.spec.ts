import { test } from './fixtures';
import { jobsData } from '../data/jobs.data';
import { generateUniqueEmail } from '../helpers/generators.helper';

test('Subscribe for a job alert', async ({ homePage, jobsSearchPage, jobAlertsComponent }) => {
  const uniqueEmail = generateUniqueEmail();

  await test.step('Open jobs portal', async () => {
    await homePage.openHome(jobsData.baseUrl);

    await homePage.openJobsSection();

    await jobsSearchPage.openExploreAvailableJobs();
  });

  await test.step('Fill subscription form', async () => {
    await jobAlertsComponent.scrollToJobAlerts();
    await jobAlertsComponent.fillJobAlertEmail(uniqueEmail);
    await jobAlertsComponent.selectJobAlertCategory(jobsData.jobAlertCategory);
    await jobAlertsComponent.selectJobAlertLocation(jobsData.jobAlertLocation);
    await jobAlertsComponent.addJobAlertSelection();
  });

  await test.step('Sign up and verify confirmation', async () => {
    await jobAlertsComponent.submitJobAlertSignup();
    await jobAlertsComponent.expectJobAlertConfirmation(jobsData.jobAlertConfirmationPattern);
  });
});
