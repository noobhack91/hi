import moment from 'moment';

/**
 * Formats a given date using the specified format.
 * 
 * @param date - The date to format.
 * @param format - The format to apply.
 * @returns The formatted date string.
 */
export function bahmniDateTimeWithFormat(date: Date | string, format: string): string {
    if (!date) {
        return '';
    }
    return moment(date).format(format);
}
