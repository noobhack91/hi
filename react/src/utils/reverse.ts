/**
 * Utility function to reverse an array.
 * 
 * @param items - The array to be reversed.
 * @returns A new array with the elements in reverse order.
 */
export function reverse<T>(items: T[]): T[] {
    return items && items.slice().reverse();
}
