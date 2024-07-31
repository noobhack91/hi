/**
 * Utility function to add days to a given date.
 * @param date - The initial date.
 * @param days - The number of days to add.
 * @returns A new date with the added days.
 */
export function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}
