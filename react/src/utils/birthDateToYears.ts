import { diffInYearsMonthsDays, now } from './dateUtil'; // Assuming dateUtil.ts contains the necessary date utility functions

/**
 * Converts a birth date to the number of years.
 * @param birthDate - The birth date to convert.
 * @returns The number of years since the birth date.
 */
export function birthDateToYears(birthDate: Date | string): number | string {
    if (birthDate) {
        const age = diffInYearsMonthsDays(new Date(birthDate), now());
        return age.years || 0;
    } else {
        return "";
    }
}
