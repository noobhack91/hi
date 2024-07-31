// Import necessary utilities from Bahmni.Common.Util.DateUtil
import { formatDateWithTime } from 'path/to/Bahmni/Common/Util/DateUtil';

/**
 * Utility function to format a date with time.
 * 
 * @param {Date | string} date - The date to be formatted.
 * @returns {string} - The formatted date string.
 */
export function bahmniDateTime(date: Date | string): string {
    return formatDateWithTime(date);
}
