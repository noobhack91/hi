// Import necessary utilities
import { format } from 'date-fns';

/**
 * Utility function to format a date with a specified format.
 * 
 * @param date - The date to be formatted.
 * @param formatString - The format string to use for formatting the date.
 * @returns The formatted date string.
 */
export function bahmniDateTimeWithFormat(date: Date, formatString: string): string {
    if (!date) {
        return '';
    }
    return format(date, formatString);
}
