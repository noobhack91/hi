// Import necessary utilities from a date library, e.g., date-fns or moment
import { format } from 'date-fns';

/**
 * Formats a given date without time.
 * @param date - The date to format.
 * @returns The formatted date string.
 */
export function bahmniDate(date: Date): string {
    if (!date) {
        return '';
    }
    return format(date, 'yyyy-MM-dd');
}
