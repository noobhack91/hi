/**
 * Converts a boolean value to a string representation.
 * @param value - The boolean value to convert.
 * @returns "Yes" if the value is true, "No" if the value is false, or the original value if it is neither true nor false.
 */
export function booleanFilter(value: any): string {
    if (value === true) {
        return "Yes";
    } else if (value === false) {
        return "No";
    }
    return value;
}
