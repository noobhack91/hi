// react/src/utils/bahmniDateInStrictMode.ts

// Importing the necessary utility function from Bahmni.Common.Util.DateUtil
import { formatDateInStrictMode } from 'path-to-bahmni-common-util-dateutil';

/**
 * Converts a date to a strict mode formatted date string.
 * 
 * @param date - The date to be formatted.
 * @returns The formatted date string.
 */
export function bahmniDateInStrictMode(date: Date): string {
    return formatDateInStrictMode(date);
}
