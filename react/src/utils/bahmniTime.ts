/**
 * Utility function to format time in Bahmni style.
 * This function is a conversion from the AngularJS filter `bahmniTime`.
 */

import moment from 'moment';

/**
 * Formats a given date to Bahmni time format.
 * @param date - The date to be formatted.
 * @returns The formatted time string.
 */
export function bahmniTime(date: Date | string | number): string {
    if (!date) {
        return '';
    }
    return moment(date).format('HH:mm');
}
