/**
 * Utility function to format a date in the Bahmni format.
 * @param date - The date to be formatted.
 * @returns The formatted date string.
 */
export function bahmniDate(date: Date | string | null | undefined): string {
    if (!date) {
        return '';
    }

    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
        return '';
    }

    const options: Intl.DateTimeFormatOptions = {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    };

    return dateObj.toLocaleDateString('en-US', options);
}
