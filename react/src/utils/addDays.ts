/**
 * Adds a specified number of days to a given date.
 * 
 * @param {Date} date - The initial date.
 * @param {number} numberOfDays - The number of days to add.
 * @returns {Date} - The new date with the added days.
 */
export function addDays(date: Date, numberOfDays: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + numberOfDays);
    return result;
}
