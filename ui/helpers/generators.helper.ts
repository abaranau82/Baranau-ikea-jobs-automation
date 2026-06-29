export function generateUniqueEmail(prefix = 'qa', domain = 'example.com'): string {
  return `${prefix}_${Date.now()}@${domain}`;
}
