// react/src/utils/days.ts

/**
 * Utility function to calculate the difference in days between two dates.
 * @param {Date} startDate - The start date.
 * @param {Date} endDate - The end date.
 * @returns {number} - The difference in days between the two dates.
 */
export function diffInDays(startDate: Date, endDate: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours * minutes * seconds * milliseconds
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    return Math.round(Math.abs((end - start) / oneDay));
}
