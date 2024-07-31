// Import necessary utilities
import { diffInDays } from 'bahmni-common-util-dateutil';

/**
 * Calculate the difference in days between two dates.
 * 
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @returns {number} - The difference in days between the two dates
 */
export function days(startDate: Date, endDate: Date): number {
    return diffInDays(startDate, endDate);
}
