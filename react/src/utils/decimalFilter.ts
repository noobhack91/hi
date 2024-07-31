/**
 * Converts a given value to a decimal and returns the floor value.
 * If the value is not a number or is an empty string, it returns the value as is.
 * 
 * @param value - The value to be converted to a decimal.
 * @returns The floor value of the decimal or the original value if it's not a number or an empty string.
 */
export function decimalFilter(value: any): any {
    if (!isNaN(value) && value !== '') {
        value = +(value);
        return Math.floor(value);
    }
    return value;
}
