/**
 * Month utility functions
 */

// Month name to abbreviation mapping (supports both German and English)
export const MONTH_ABBREVIATIONS: Record<string, string> = {
  // German months
  'Januar': 'Jan',
  'Februar': 'Feb',
  'März': 'Mar',
  'April': 'Apr',
  'Mai': 'May',
  'Juni': 'Jun',
  'Juli': 'Jul',
  'August': 'Aug',
  'September': 'Sep',
  'Oktober': 'Oct',
  'November': 'Nov',
  'Dezember': 'Dec',
  // English months
  'January': 'Jan',
  'February': 'Feb',
  'March': 'Mar',
  'May': 'May',
  'June': 'Jun',
  'July': 'Jul',
  'October': 'Oct',
  'December': 'Dec',
}

/**
 * Get abbreviated month name
 * Converts German or English month names to abbreviations
 * Falls back to first 3 characters if month not found
 */
export function getMonthAbbr(month: string): string {
  return MONTH_ABBREVIATIONS[month] || month.substring(0, 3)
}

/**
 * Format array of months as abbreviated string
 * @param months Array of month names
 * @returns Comma-separated abbreviated month names
 */
export function formatMonthsAbbr(months: string[]): string {
  return months.map(getMonthAbbr).join(', ')
}
