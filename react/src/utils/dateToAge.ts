/**
 * Converts a birthdate and a reference date to an age in years.
 * @param birthdate - The birthdate of the patient.
 * @param referenceDate - The date to calculate the age from.
 * @returns The age in years.
 */
export function dateToAge(birthdate: Date, referenceDate: Date): number {
    const birth = new Date(birthdate);
    const reference = new Date(referenceDate);

    let age = reference.getFullYear() - birth.getFullYear();
    const monthDifference = reference.getMonth() - birth.getMonth();
    const dayDifference = reference.getDate() - birth.getDate();

    // Adjust age if the reference date is before the birthdate in the year
    if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
        age--;
    }

    return age;
}
