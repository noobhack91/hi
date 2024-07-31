/**
 * Utility function to format decimal values.
 * Converts a number to a string and removes trailing ".0" followed by spaces.
 * 
 * @param value - The number to be formatted.
 * @returns The formatted string or null if the input is not a valid number.
 */
export function formatDecimalValues(value: number | null | undefined): string | null {
    return value ? value.toString().replace(/\.0(\s+)/g, "$1") : null;
}
