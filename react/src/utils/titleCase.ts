/**
 * Converts a given string to title case.
 * Each word in the string will have its first letter capitalized and the rest lowercased.
 * 
 * @param input - The string to be converted to title case.
 * @returns The title-cased string.
 */
export function titleCase(input: string): string {
    input = input || '';
    return input.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}
