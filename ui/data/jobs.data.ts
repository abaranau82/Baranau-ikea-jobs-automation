const baseUrl = process.env.UI_BASE_URL;
const primarySearch = process.env.JOBS_SEARCH_PRIMARY;
const fallbackSearch = process.env.JOBS_SEARCH_FALLBACK;
const jobAlertCategory = process.env.JOB_ALERT_CATEGORY ?? 'Leadership & Management';
const jobAlertLocation = process.env.JOB_ALERT_LOCATION ?? 'Sweden';

if (!baseUrl) {
  throw new Error('UI_BASE_URL is not set');
}

if (!primarySearch) {
  throw new Error('JOBS_SEARCH_PRIMARY is not set');
}

if (!fallbackSearch) {
  throw new Error('JOBS_SEARCH_FALLBACK is not set');
}

export const jobsData = {
  baseUrl,
  primarySearch,
  fallbackSearch,
  jobAlertCategory,
  jobAlertLocation,
  jobAlertConfirmationPattern: /thank|success|subscrib|job alert/i
};
