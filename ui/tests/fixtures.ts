import { test as base, type Page } from '@playwright/test';
import { setupCookieAutoAccept } from '../helpers/cookies.helper';
import { HomePage } from '../pages/home.page';
import { JobsSearchPage } from '../pages/jobs-search.page';
import { JobDetailsPage } from '../pages/job-details.page';
import { HeaderComponent } from '../pages/components/header.component';
import { JobAlertsComponent } from '../pages/components/job-alerts.component';

type JobsFixtures = {
  homePage: HomePage;
  jobsSearchPage: JobsSearchPage;
  jobDetailsPage: JobDetailsPage;
  headerComponent: HeaderComponent;
  jobAlertsComponent: JobAlertsComponent;
};

export const test = base.extend<JobsFixtures>({
  homePage: async ({ page }, use) => {
    await setupCookieAutoAccept(page);
    await use(new HomePage(page));
  },
  jobsSearchPage: async ({ page }, use) => {
    await use(new JobsSearchPage(page));
  },
  jobDetailsPage: async ({ page }, use) => {
    await use(new JobDetailsPage(page));
  },
  headerComponent: async ({ page }, use) => {
    await use(new HeaderComponent(page));
  },
  jobAlertsComponent: async ({ page }, use) => {
    await use(new JobAlertsComponent(page));
  },
});

export const expect = test.expect;
