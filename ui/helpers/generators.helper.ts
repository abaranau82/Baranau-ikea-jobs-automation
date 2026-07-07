export function generateUniqueEmail(prefix = 'qa', domain = 'example.com'): string {
  const randomSuffix = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now()}_${randomSuffix}@${domain}`;
}
