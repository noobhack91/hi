/**
 * Utility function to order an array of objects by a specified key.
 * 
 * @param array - The array of objects to be sorted.
 * @param key - The key to sort the array by.
 * @param ascending - Boolean indicating whether the sort should be in ascending order. Defaults to true.
 * @returns The sorted array.
 */
export function orderBy<T>(array: T[], key: keyof T, ascending: boolean = true): T[] {
    return array.sort((a, b) => {
        if (a[key] < b[key]) {
            return ascending ? -1 : 1;
        }
        if (a[key] > b[key]) {
            return ascending ? 1 : -1;
        }
        return 0;
    });
}
