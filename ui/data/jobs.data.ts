const baseUrl = process.env.UI_BASE_URL;
const primarySearch = process.env.JOBS_SEARCH_PRIMARY;
const fallbackSearch = process.env.JOBS_SEARCH_FALLBACK;

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
  jobAlertCategory: 'Leadership & Management',
  jobAlertLocation: 'Sweden',
  jobAlertConfirmationPattern: /thank|success|subscrib|job alert/i
};
